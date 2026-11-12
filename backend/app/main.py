"""Server FungsiKu Tahap 2 (api.md).

Endpoint:
  GET  /health          cek server hidup
  POST /auth/login      kode siswa -> JWT 30 hari
  POST /auth/daftar     siapa pun: buat kode samaran baru otomatis -> JWT 30 hari
  GET  /me              status siswa
  GET  /progress        ambil progres tersimpan (pindah perangkat)
  PUT  /progress        simpan progres + isi tabel rinci untuk peneliti
"""

from __future__ import annotations

import os
import secrets
from datetime import datetime, timezone
from typing import Any

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .auth import MASA_TOKEN, PembatasLogin, buat_token, galat, id_siswa_dari_header
from .db import Db, get_db
from .sinkron import KONFLIK, baris_dari_progres

app = FastAPI(title="FungsiKu API", version="0.2.0")

_asal = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_asal,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=86400,
)

pembatas = PembatasLogin()
pembatas_daftar = PembatasLogin(batas=10)

KELAS_UMUM = "Umum"  # pengguna tanpa kode dari guru; siswa penelitian memakai kode berlabel P01, P02, ...
HURUF_KODE = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # tanpa 0/O, 1/I/L agar tidak tertukar


class LoginBody(BaseModel):
    code: str = Field(min_length=1, max_length=32)


class ProgresBody(BaseModel):
    data: dict[str, Any]


def _sekarang() -> str:
    return datetime.now(timezone.utc).isoformat()


def _siswa(db: Db, student_id: str) -> dict[str, Any]:
    rows = db.select("students", {"id": f"eq.{student_id}", "select": "id,is_active,classes(name)"})
    if not rows:
        raise galat(401, "TOKEN_EXPIRED", "Kode siswa sudah tidak berlaku.")
    s = rows[0]
    if not s.get("is_active", True):
        raise galat(403, "INACTIVE", "Kode siswa ini sudah dinonaktifkan.")
    return s


def _status(db: Db, s: dict[str, Any]) -> dict[str, Any]:
    tes = db.select("assessment_results", {"student_id": f"eq.{s['id']}", "select": "kind"})
    diag = db.select("diagnostic_results", {"student_id": f"eq.{s['id']}", "select": "student_id"})
    kinds = {t["kind"] for t in tes}
    return {
        "id": s["id"],
        "class": (s.get("classes") or {}).get("name"),
        "pretest_done": "pre" in kinds,
        "posttest_done": "post" in kinds,
        "diagnostic_done": bool(diag),
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/login")
def login(body: LoginBody, request: Request, db: Db = Depends(get_db)) -> dict[str, Any]:
    pembatas.cek(_ip(request))
    kode = body.code.strip().upper()
    rows = db.select("students", {"code": f"eq.{kode}", "select": "id,is_active,classes(name)"})
    if not rows:
        raise galat(401, "INVALID_CODE", "Kode siswa tidak ditemukan. Periksa lagi hurufnya.")
    s = rows[0]
    if not s.get("is_active", True):
        raise galat(403, "INACTIVE", "Kode siswa ini sudah dinonaktifkan.")
    db.update("students", {"id": s["id"]}, {"last_seen_at": _sekarang()})
    return {
        "access_token": buat_token(s["id"]),
        "token_type": "bearer",
        "expires_in": MASA_TOKEN,
        "code": kode,
        "student": _status(db, s),
    }


def _ip(request: Request) -> str:
    return request.headers.get("x-forwarded-for", "").split(",")[0].strip() or (request.client.host if request.client else "?")


@app.post("/auth/daftar", status_code=201)
def daftar(request: Request, db: Db = Depends(get_db)) -> dict[str, Any]:
    """Buat siswa anonim baru. Tidak meminta data pribadi apa pun (agents.md aturan 6)."""
    pembatas_daftar.cek(_ip(request))
    kelas = db.select("classes", {"name": f"eq.{KELAS_UMUM}", "select": "id"})
    class_id = kelas[0]["id"] if kelas else None
    for _ in range(5):
        kode = "FK-UM-" + "".join(secrets.choice(HURUF_KODE) for _ in range(6))
        if not db.select("students", {"code": f"eq.{kode}", "select": "id"}):
            break
    else:
        raise galat(503, "SERVER_ERROR", "Gagal membuat kode. Coba lagi.")
    baru = db.insert("students", {"code": kode, "class_id": class_id, "last_seen_at": _sekarang()})
    return {
        "access_token": buat_token(baru["id"]),
        "token_type": "bearer",
        "expires_in": MASA_TOKEN,
        "code": kode,
        "student": {"id": baru["id"], "class": KELAS_UMUM if class_id else None,
                    "pretest_done": False, "posttest_done": False, "diagnostic_done": False},
    }


@app.get("/me")
def me(student_id: str = Depends(id_siswa_dari_header), db: Db = Depends(get_db)) -> dict[str, Any]:
    return _status(db, _siswa(db, student_id))


@app.get("/progress")
def ambil_progres(student_id: str = Depends(id_siswa_dari_header), db: Db = Depends(get_db)) -> dict[str, Any]:
    _siswa(db, student_id)
    rows = db.select("progress_snapshots", {"student_id": f"eq.{student_id}", "select": "data,updated_at"})
    return rows[0] if rows else {"data": None, "updated_at": None}


@app.put("/progress")
def simpan_progres(
    body: ProgresBody, student_id: str = Depends(id_siswa_dari_header), db: Db = Depends(get_db)
) -> dict[str, Any]:
    _siswa(db, student_id)
    waktu = _sekarang()
    db.upsert("progress_snapshots", [{"student_id": student_id, "data": body.data, "updated_at": waktu}], "student_id")
    jumlah: dict[str, int] = {}
    for tabel, baris in baris_dari_progres(student_id, body.data).items():
        kolom_unik, abaikan_ganda = KONFLIK[tabel]
        db.upsert(tabel, baris, kolom_unik, ignore_duplicates=abaikan_ganda)
        jumlah[tabel] = len(baris)
    db.update("students", {"id": student_id}, {"last_seen_at": waktu})
    return {"saved": True, "updated_at": waktu, "rows": jumlah}
