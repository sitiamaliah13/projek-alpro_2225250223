"""Tes server memakai database tiruan di memori (tanpa Supabase sungguhan)."""

from __future__ import annotations

import os
from typing import Any

import pytest

os.environ.setdefault("JWT_SECRET", "rahasia-tes")

from fastapi.testclient import TestClient  # noqa: E402

from app import main  # noqa: E402
from app.auth import PembatasLogin, buat_token  # noqa: E402
from app.db import get_db  # noqa: E402
from app.sinkron import baris_dari_progres  # noqa: E402

ID_AKTIF = "11111111-1111-1111-1111-111111111111"
ID_NONAKTIF = "22222222-2222-2222-2222-222222222222"


class DbTiruan:
    def __init__(self) -> None:
        self.tabel: dict[str, list[dict[str, Any]]] = {
            "students": [
                {"id": ID_AKTIF, "code": "FK-8A-TES1", "is_active": True, "classes": {"name": "8A"}},
                {"id": ID_NONAKTIF, "code": "FK-8A-MATI", "is_active": False, "classes": {"name": "8A"}},
            ],
        }

    def select(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
        rows = self.tabel.get(table, [])
        for k, v in params.items():
            if v.startswith("eq."):
                rows = [r for r in rows if str(r.get(k)) == v[3:]]
        return rows

    def upsert(self, table: str, rows: list[dict[str, Any]], on_conflict: str, ignore_duplicates: bool = False) -> None:
        kunci = on_conflict.split(",")
        isi = self.tabel.setdefault(table, [])
        for r in rows:
            lama = next((x for x in isi if all(x.get(k) == r.get(k) for k in kunci)), None)
            if lama is None:
                isi.append(dict(r))
            elif not ignore_duplicates:
                lama.update(r)

    def insert(self, table: str, row: dict[str, Any]) -> dict[str, Any]:
        baru = {"id": f"00000000-0000-0000-0000-{len(self.tabel.setdefault(table, [])):012d}", "is_active": True, **row}
        self.tabel[table].append(baru)
        return baru

    def update(self, table: str, match: dict[str, str], values: dict[str, Any]) -> None:
        for r in self.tabel.get(table, []):
            if all(str(r.get(k)) == v for k, v in match.items()):
                r.update(values)


@pytest.fixture()
def db() -> DbTiruan:
    d = DbTiruan()
    main.app.dependency_overrides[get_db] = lambda: d
    main.pembatas = PembatasLogin()
    main.pembatas_daftar = PembatasLogin(batas=10)
    yield d
    main.app.dependency_overrides.clear()


@pytest.fixture()
def client(db: DbTiruan) -> TestClient:
    return TestClient(main.app)


def _auth(student_id: str = ID_AKTIF) -> dict[str, str]:
    return {"Authorization": f"Bearer {buat_token(student_id)}"}


PROGRES = {
    "pretest": {"done": True, "answers": {"1": "Persewaan B"}, "submittedAt": "2026-11-12T10:00:00Z"},
    "posttest": {"done": False, "answers": {}, "submittedAt": None},
    "diagnostic": {"done": True, "scores": {"bilangan_bulat": 60}, "penguatanTanda": True},
    "lessons": {"m1": {"done": True, "stars": 3, "completedAt": "2026-11-12T10:30:00Z"}},
    "attempts": [
        {"item_id": "m1-s1", "correct": False, "hints_used": 1, "tries": 2, "error_tag": "MULTI_PAIR", "ts": "2026-11-12T10:05:00Z"},
        {"item_id": "m1-s2", "correct": True, "hints_used": 0, "tries": 1, "error_tag": None, "ts": "2026-11-12T10:06:00Z"},
        {"item_id": "", "ts": "bukan-waktu"},  # rusak: dilewati
    ],
    "explanations": [{"item_id": "m1-j1", "reason_choice": 1, "reason_correct": True, "text": "x" * 300, "ts": "2026-11-12T10:07:00Z"}],
    "loads": [{"lesson_id": "m1", "rating": 4, "ts": "2026-11-12T10:08:00Z"}, {"lesson_id": "m1", "rating": 12, "ts": "2026-11-12T10:09:00Z"}],
}


def test_health(client: TestClient) -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_login_kode_benar_tidak_peka_huruf(client: TestClient) -> None:
    r = client.post("/auth/login", json={"code": "  fk-8a-tes1 "})
    assert r.status_code == 200
    body = r.json()
    assert body["token_type"] == "bearer" and body["access_token"]
    assert body["student"] == {"id": ID_AKTIF, "class": "8A", "pretest_done": False, "posttest_done": False, "diagnostic_done": False}


def test_login_kode_salah(client: TestClient) -> None:
    r = client.post("/auth/login", json={"code": "FK-8A-XXXX"})
    assert r.status_code == 401
    assert r.json()["detail"]["code"] == "INVALID_CODE"


def test_login_kode_nonaktif(client: TestClient) -> None:
    assert client.post("/auth/login", json={"code": "FK-8A-MATI"}).json()["detail"]["code"] == "INACTIVE"


def test_login_dibatasi_5_per_menit(client: TestClient) -> None:
    for _ in range(5):
        client.post("/auth/login", json={"code": "FK-8A-XXXX"})
    r = client.post("/auth/login", json={"code": "FK-8A-TES1"})
    assert r.status_code == 429
    assert r.json()["detail"]["code"] == "RATE_LIMITED"


def test_tanpa_token_ditolak(client: TestClient) -> None:
    assert client.get("/progress").status_code == 401
    assert client.get("/me", headers={"Authorization": "Bearer palsu"}).json()["detail"]["code"] == "TOKEN_EXPIRED"


def test_token_kedaluwarsa(client: TestClient) -> None:
    lama = buat_token(ID_AKTIF, sekarang=0)
    r = client.get("/me", headers={"Authorization": f"Bearer {lama}"})
    assert r.status_code == 401


def test_simpan_lalu_ambil_progres(client: TestClient, db: DbTiruan) -> None:
    assert client.get("/progress", headers=_auth()).json() == {"data": None, "updated_at": None}
    r = client.put("/progress", headers=_auth(), json={"data": PROGRES})
    assert r.status_code == 200 and r.json()["saved"]
    assert client.get("/progress", headers=_auth()).json()["data"] == PROGRES

    assert len(db.tabel["attempts"]) == 2
    assert db.tabel["explanations"][0]["text"] == "x" * 200
    assert [b["rating"] for b in db.tabel["cognitive_load"]] == [4]
    assert db.tabel["assessment_results"][0]["kind"] == "pre"

    me = client.get("/me", headers=_auth()).json()
    assert me["pretest_done"] and me["diagnostic_done"] and not me["posttest_done"]


def test_sinkron_berulang_tidak_menggandakan(client: TestClient, db: DbTiruan) -> None:
    client.put("/progress", headers=_auth(), json={"data": PROGRES})
    client.put("/progress", headers=_auth(), json={"data": PROGRES})
    assert len(db.tabel["attempts"]) == 2
    assert len(db.tabel["lesson_progress"]) == 1


def test_jawaban_tes_tidak_ditimpa(client: TestClient, db: DbTiruan) -> None:
    client.put("/progress", headers=_auth(), json={"data": PROGRES})
    db.tabel["assessment_results"][0]["score"] = 21  # diisi peneliti
    ubah = {**PROGRES, "pretest": {**PROGRES["pretest"], "answers": {"1": "diubah"}}}
    client.put("/progress", headers=_auth(), json={"data": ubah})
    assert db.tabel["assessment_results"][0]["score"] == 21
    assert db.tabel["assessment_results"][0]["answers"] == {"1": "Persewaan B"}


def test_siswa_nonaktif_tidak_bisa_sinkron(client: TestClient) -> None:
    r = client.put("/progress", headers=_auth(ID_NONAKTIF), json={"data": PROGRES})
    assert r.status_code == 403


def test_progres_kosong_tidak_membuat_baris() -> None:
    hasil = baris_dari_progres(ID_AKTIF, {})
    assert all(len(v) == 0 for v in hasil.values())


def test_daftar_otomatis_membuat_kode_baru(client: TestClient, db: DbTiruan) -> None:
    db.tabel["classes"] = [{"id": "kelas-umum", "name": "Umum"}]
    r = client.post("/auth/daftar")
    assert r.status_code == 201
    body = r.json()
    assert body["code"].startswith("FK-UM-") and len(body["code"]) == 12
    assert body["student"]["class"] == "Umum"
    baru = db.tabel["students"][-1]
    assert baru["code"] == body["code"] and baru["class_id"] == "kelas-umum"
    # Kode baru bisa dipakai masuk lagi (pindah HP) dan menyimpan progres.
    login = client.post("/auth/login", json={"code": body["code"].lower()})
    assert login.status_code == 200 and login.json()["code"] == body["code"]
    tok = {"Authorization": f"Bearer {body['access_token']}"}
    assert client.put("/progress", headers=tok, json={"data": PROGRES}).status_code == 200


def test_daftar_dibatasi_per_ip(client: TestClient) -> None:
    for _ in range(10):
        assert client.post("/auth/daftar").status_code == 201
    assert client.post("/auth/daftar").status_code == 429


# ---------- Mediator RMT (DeepSeek ditiru, tidak ada panggilan internet) ----------
import httpx  # noqa: E402

from app import ai  # noqa: E402

PESAN_AI = {"fase": "Fase III", "fungsi_kognitif": "Memberi bukti logis", "konteks": "Apakah relasi ini fungsi?",
            "pesan": "Aku bingung", "riwayat": [{"peran": "siswa", "teks": "Halo"}, {"peran": "mediator", "teks": "Hai"}]}


class _Respon:
    def __init__(self, status: int, data: Any) -> None:
        self.status_code = status
        self._data = data

    def json(self) -> Any:
        return self._data


class _KlienTiruan:
    def __init__(self, respon: _Respon) -> None:
        self.respon = respon
        self.dikirim: dict[str, Any] = {}

    def post(self, url: str, json: Any, headers: dict[str, str]) -> _Respon:
        self.dikirim = {"url": url, "json": json, "headers": headers}
        return self.respon


@pytest.fixture()
def ai_tiruan(monkeypatch: pytest.MonkeyPatch) -> dict[str, Any]:
    monkeypatch.setenv("DEEPSEEK_API_KEY", "sk-tes")
    main.pembatas_ai = ai.PembatasAi()
    catat: dict[str, Any] = {}

    def palsu(pesan: list[dict[str, str]]) -> str:
        catat["pesan"] = pesan
        return "Coba bandingkan pasangan angka 2. Apa buktinya?"

    monkeypatch.setattr(main, "tanya_deepseek", palsu)
    return catat


def test_mediator_tanpa_login_dibatasi_per_ip(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    for _ in range(ai.BATAS_PER_MENIT):
        assert client.post("/ai/mediator", json=PESAN_AI).status_code == 200
    assert client.post("/ai/mediator", json=PESAN_AI).status_code == 429
    # Siswa yang login punya jatah sendiri, terpisah dari jatah IP.
    assert client.post("/ai/mediator", headers=_auth(), json=PESAN_AI).status_code == 200


def test_mediator_token_rusak_dianggap_tamu(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    r = client.post("/ai/mediator", headers={"Authorization": "Bearer palsu"}, json=PESAN_AI)
    assert r.status_code == 200


def test_mediator_tetap_jalan_saat_database_mati(client: TestClient, db: DbTiruan, ai_tiruan: dict[str, Any]) -> None:
    def mati(*a: Any, **k: Any) -> Any:
        raise httpx.ConnectError("database dijeda")

    db.select = mati  # type: ignore[method-assign]
    assert client.post("/ai/mediator", headers=_auth(), json=PESAN_AI).status_code == 200


def test_mediator_menjawab_dan_menyusun_konteks(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    r = client.post("/ai/mediator", headers=_auth(), json=PESAN_AI)
    assert r.status_code == 200 and "buktinya" in r.json()["balasan"]
    pesan = ai_tiruan["pesan"]
    assert pesan[0]["role"] == "system" and "JANGAN memberi jawaban akhir" in pesan[0]["content"]
    assert "Memberi bukti logis" in pesan[1]["content"]
    assert [p["role"] for p in pesan[2:]] == ["user", "assistant", "user"]


def test_mediator_siswa_nonaktif_ditolak(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    assert client.post("/ai/mediator", headers=_auth(ID_NONAKTIF), json=PESAN_AI).status_code == 403


def test_mediator_pesan_kosong_atau_riwayat_panjang_ditolak(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    assert client.post("/ai/mediator", headers=_auth(), json={**PESAN_AI, "pesan": ""}).status_code == 422
    panjang = {**PESAN_AI, "riwayat": [{"peran": "siswa", "teks": "a"}] * 7}
    assert client.post("/ai/mediator", headers=_auth(), json=panjang).status_code == 422


def test_mediator_dibatasi_per_menit(client: TestClient, ai_tiruan: dict[str, Any]) -> None:
    for _ in range(ai.BATAS_PER_MENIT):
        assert client.post("/ai/mediator", headers=_auth(), json=PESAN_AI).status_code == 200
    r = client.post("/ai/mediator", headers=_auth(), json=PESAN_AI)
    assert r.status_code == 429 and r.json()["detail"]["code"] == "RATE_LIMITED"


def test_pembatas_ai_harian() -> None:
    p = ai.PembatasAi(per_menit=100, per_hari=3)
    for i in range(3):
        p.cek("s", sekarang=i * 100.0)
    with pytest.raises(Exception):
        p.cek("s", sekarang=400.0)
    p.cek("s", sekarang=86400.0 + 150)  # dua catatan lama sudah lewat sehari


def test_tanya_deepseek_tanpa_kunci(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    with pytest.raises(Exception) as e:
        ai.tanya_deepseek([{"role": "user", "content": "x"}])
    assert e.value.detail["code"] == "AI_NOT_CONFIGURED"


def test_tanya_deepseek_berhasil_dan_gagal(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DEEPSEEK_API_KEY", "sk-tes")
    k = _KlienTiruan(_Respon(200, {"choices": [{"message": {"content": "  Apa buktinya?  "}}]}))
    assert ai.tanya_deepseek([{"role": "user", "content": "x"}], klien=k) == "Apa buktinya?"
    assert k.dikirim["headers"]["Authorization"] == "Bearer sk-tes"
    assert k.dikirim["json"]["model"] == ai.MODEL
    for respon in (_Respon(500, {}), _Respon(200, {"choices": []})):
        with pytest.raises(Exception) as e:
            ai.tanya_deepseek([{"role": "user", "content": "x"}], klien=_KlienTiruan(respon))
        assert e.value.detail["code"] == "AI_UNAVAILABLE"


def test_gemini_dipakai_bila_hanya_kunci_gemini(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY", "AIza-tes")
    k = _KlienTiruan(_Respon(200, {"choices": [{"message": {"content": "Apa buktinya?"}}]}))
    assert ai.tanya_deepseek([{"role": "user", "content": "x"}], klien=k) == "Apa buktinya?"
    assert k.dikirim["url"] == ai.GEMINI_URL
    assert k.dikirim["json"]["model"] == ai.GEMINI_MODEL
    assert k.dikirim["headers"]["Authorization"] == "Bearer AIza-tes"


def test_groq_dipakai_bila_hanya_kunci_groq(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("GROQ_API_KEY", "gsk_tes")
    k = _KlienTiruan(_Respon(200, {"choices": [{"message": {"content": "Apa buktinya?"}}]}))
    assert ai.tanya_deepseek([{"role": "user", "content": "x"}], klien=k) == "Apa buktinya?"
    assert k.dikirim["url"] == ai.GROQ_URL


def test_rapikan_maksimal_3_kalimat_dan_pertanyaan_tetap_ada() -> None:
    teks = "Bagus. Kamu teliti. Ingat syaratnya. Apa buktinya? Coba lagi."
    hasil = ai.rapikan(teks)
    assert hasil == "Bagus. Kamu teliti. Apa buktinya?"
    assert ai.rapikan("**Tepat**, lihat angka 2. Apa buktinya?") == "Tepat, lihat angka 2. Apa buktinya?"


def test_prompt_memuat_langkah_literasi() -> None:
    assert "Pahami" in ai.PROMPT_SISTEM and "Tafsirkan" in ai.PROMPT_SISTEM
