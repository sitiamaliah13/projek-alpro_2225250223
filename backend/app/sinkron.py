"""Ubah data progres aplikasi (frontend/src/data/progres.js) menjadi baris tabel rinci.

Fungsi murni tanpa database, sehingga mudah diuji. Data yang tidak valid dilewati, bukan ditolak,
agar satu catatan rusak tidak menggagalkan sinkron seluruh progres.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

MAKS_BARIS = 2000
MAKS_TEKS = 200


def _waktu(nilai: Any) -> str | None:
    if not isinstance(nilai, str):
        return None
    try:
        datetime.fromisoformat(nilai.replace("Z", "+00:00"))
    except ValueError:
        return None
    return nilai


def _teks_id(nilai: Any) -> str | None:
    if isinstance(nilai, (str, int)) and 0 < len(str(nilai)) <= 64:
        return str(nilai)
    return None


def _angka(nilai: Any) -> int | None:
    if isinstance(nilai, bool):
        return None
    if isinstance(nilai, int):
        return nilai
    if isinstance(nilai, float) and nilai.is_integer():
        return int(nilai)
    return None


def _bool(nilai: Any) -> bool | None:
    return nilai if isinstance(nilai, bool) else None


def _daftar(data: dict, kunci: str) -> list[dict]:
    isi = data.get(kunci)
    if not isinstance(isi, list):
        return []
    return [x for x in isi[-MAKS_BARIS:] if isinstance(x, dict)]


def baris_dari_progres(student_id: str, data: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    """Kembalikan {nama_tabel: [baris, ...]} yang siap di-upsert."""
    hasil: dict[str, list[dict[str, Any]]] = {
        "lesson_progress": [],
        "attempts": [],
        "explanations": [],
        "cognitive_load": [],
        "diagnostic_results": [],
        "assessment_results": [],
    }

    lessons = data.get("lessons")
    if isinstance(lessons, dict):
        for lesson_id, p in lessons.items():
            if not isinstance(p, dict) or _teks_id(lesson_id) is None:
                continue
            hasil["lesson_progress"].append({
                "student_id": student_id,
                "lesson_id": str(lesson_id),
                "done": bool(p.get("done")),
                "stars": _angka(p.get("stars")),
                "completed_at": _waktu(p.get("completedAt")),
            })

    for a in _daftar(data, "attempts"):
        item_id, ts = _teks_id(a.get("item_id")), _waktu(a.get("ts"))
        if item_id is None or ts is None:
            continue
        hasil["attempts"].append({
            "student_id": student_id,
            "item_id": item_id,
            "is_correct": _bool(a.get("correct")),
            "error_tag": a.get("error_tag") if isinstance(a.get("error_tag"), str) else None,
            "hints_used": max(_angka(a.get("hints_used")) or 0, 0),
            "tries": _angka(a.get("tries")),
            "client_ts": ts,
        })

    for e in _daftar(data, "explanations"):
        item_id, ts = _teks_id(e.get("item_id")), _waktu(e.get("ts"))
        if item_id is None or ts is None:
            continue
        teks = e.get("text")
        hasil["explanations"].append({
            "student_id": student_id,
            "item_id": item_id,
            "reason_choice": _angka(e.get("reason_choice")),
            "reason_correct": _bool(e.get("reason_correct")),
            "text": teks[:MAKS_TEKS] if isinstance(teks, str) and teks.strip() else None,
            "client_ts": ts,
        })

    for b in _daftar(data, "loads"):
        lesson_id, ts, rating = _teks_id(b.get("lesson_id")), _waktu(b.get("ts")), _angka(b.get("rating"))
        if lesson_id is None or ts is None or rating is None or not 1 <= rating <= 9:
            continue
        hasil["cognitive_load"].append({
            "student_id": student_id, "lesson_id": lesson_id, "rating": rating, "client_ts": ts,
        })

    diag = data.get("diagnostic")
    if isinstance(diag, dict) and diag.get("done"):
        hasil["diagnostic_results"].append({
            "student_id": student_id,
            "scores": diag.get("scores") if isinstance(diag.get("scores"), dict) else {},
            "penguatan_tanda": bool(diag.get("penguatanTanda")),
        })

    for kunci, kind in (("pretest", "pre"), ("posttest", "post")):
        t = data.get(kunci)
        if isinstance(t, dict) and t.get("done"):
            jawaban = t.get("answers") if isinstance(t.get("answers"), dict) else {}
            hasil["assessment_results"].append({
                "student_id": student_id,
                "kind": kind,
                "answers": {str(k): str(v)[:5000] for k, v in jawaban.items()},
                "submitted_at": _waktu(t.get("submittedAt")),
            })

    return hasil


# Kunci unik tiap tabel + apakah baris lama dibiarkan (catatan riwayat) atau diperbarui (status terkini).
KONFLIK: dict[str, tuple[str, bool]] = {
    "lesson_progress": ("student_id,lesson_id", False),
    "attempts": ("student_id,item_id,client_ts", True),
    "explanations": ("student_id,item_id,client_ts", True),
    "cognitive_load": ("student_id,lesson_id,client_ts", True),
    "diagnostic_results": ("student_id", False),
    # Jawaban tes tidak ditimpa setelah terkirim, agar skor yang sudah diisi peneliti tetap aman.
    "assessment_results": ("student_id,kind", True),
}
