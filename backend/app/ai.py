"""Mediator RMT berbasis DeepSeek (atau Gemini gratis sebagai alternatif) (Rigorous Mathematical Thinking, Kinard & Kozulin 2008).

Peran AI = mediator, bukan pemberi jawaban (Mediated Learning Experience):
intensionalitas, transendensi, makna, dan rasa mampu. Kunci API hanya ada di server
(agents.md aturan 6). Pesan siswa tidak pernah ditulis ke log.
"""

from __future__ import annotations

import os
import re
import time
from collections import defaultdict, deque
from typing import Any, Literal

import httpx
from pydantic import BaseModel, Field

from .auth import galat

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")
# Alternatif gratis: Gemini (Google AI Studio) lewat endpoint yang kompatibel dengan format OpenAI.
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
# Alternatif gratis kedua: Groq (console.groq.com), juga berformat OpenAI.
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")


def penyedia() -> tuple[str, str, str] | None:
    """(url, model, kunci) penyedia AI. DeepSeek diutamakan; Gemini dipakai bila hanya kuncinya yang ada."""
    if k := os.environ.get("DEEPSEEK_API_KEY"):
        return DEEPSEEK_URL, MODEL, k
    if k := os.environ.get("GEMINI_API_KEY"):
        return GEMINI_URL, GEMINI_MODEL, k
    if k := os.environ.get("GROQ_API_KEY"):
        return GROQ_URL, GROQ_MODEL, k
    return None
BATAS_PER_MENIT = 20
BATAS_PER_HARI = 1000

PROMPT_SISTEM = """Kamu adalah Mediator RMT di aplikasi FungsiKu untuk siswa SMP kelas VIII, materi Relasi dan Fungsi (pemetaan).
Kamu mengikuti model Rigorous Mathematical Thinking (Kinard & Kozulin) dan Mediated Learning Experience (Feuerstein).

ATURAN WAJIB:
1. JANGAN memberi jawaban akhir atau memilihkan opsi. Bantu siswa menemukannya sendiri.
2. Jawab dalam Bahasa Indonesia baku yang ramah. Maksimal 3 kalimat, tiap kalimat maksimal 20 kata.
3. Akhiri dengan TEPAT SATU pertanyaan pemandu yang membuat siswa berpikir.
4. Sebut fungsi kognitif yang sedang dipakai siswa bila relevan, misalnya: membandingkan, mencari sistematis, mendefinisikan masalah, memberi bukti logis, mempertahankan keajekan, membentuk hubungan fungsional.
5. Minta BUKTI LOGIS: tanyakan "mengapa" atau "apa buktinya", bukan hanya "apa jawabannya".
6. Bila ada bagian pikiran siswa yang benar, sebutkan secara spesifik apa yang sudah tepat (rasa mampu).
7. Arahkan memakai alat berpikir matematika: diagram panah, tabel, pasangan berurutan, rumus, atau grafik.
8. Bila cocok, kaitkan ke kehidupan sehari-hari (transendensi), tetapi tetap singkat.
9. Untuk fungsi, ingatkan syarat inti: setiap anggota domain punya tepat satu pasangan di kodomain.
   BOLEH: dua anggota domain menuju anggota kodomain yang sama, dan anggota kodomain boleh tidak punya pasangan. Itu tetap fungsi.
   BUKAN fungsi hanya bila ada anggota domain dengan dua pasangan atau lebih, atau tanpa pasangan.
10. Periksa sendiri kebenaran matematika sebelum menjawab. JANGAN membenarkan pendapat siswa yang keliru;
    tanggapi dengan pertanyaan yang membuat siswa memeriksa ulang, tanpa menyebut jawabannya.
11. Bila siswa bertanya KONSEP secara umum (bukan soal yang sedang dikerjakan), jelaskan singkat dengan contoh sehari-hari,
    lalu akhiri dengan satu pertanyaan untuk memeriksa pemahamannya. Aturan 1 tetap berlaku untuk soal latihan.
12. LITERASI MATEMATIS: bila konteks diawali "SOAL LITERASI 4 LANGKAH" atau berupa soal cerita, tuntun siswa lewat langkah:
    Pahami (pilih info penting, abaikan info pengecoh) -> Rumuskan (ubah ke rumus fungsi atau tabel) ->
    Hitung (substitusi dengan teliti, perhatikan tanda negatif) -> Tafsirkan (kembalikan hasil ke konteks soal dan satuannya).
    Tanyakan dulu siswa sedang di langkah mana, lalu bantu hanya langkah itu.
13. Tolak dengan sopan pertanyaan di luar matematika. Jangan meminta data pribadi apa pun.
Tulis teks polos tanpa Markdown, tanpa LaTeX."""


class Giliran(BaseModel):
    peran: Literal["siswa", "mediator"]
    teks: str = Field(min_length=1, max_length=800)  # sama dengan batas balasan mediator


class MediatorBody(BaseModel):
    fase: str = Field(default="", max_length=80)
    fungsi_kognitif: str = Field(default="", max_length=80)
    konteks: str = Field(default="", max_length=2000)
    pesan: str = Field(min_length=1, max_length=500)
    riwayat: list[Giliran] = Field(default_factory=list, max_length=6)


class PembatasAi:
    """Batas pemakaian per siswa (upaya terbaik di serverless) agar saldo tidak cepat habis."""

    def __init__(self, per_menit: int = BATAS_PER_MENIT, per_hari: int = BATAS_PER_HARI) -> None:
        self.per_menit = per_menit
        self.per_hari = per_hari
        self._catatan: dict[str, deque[float]] = defaultdict(deque)

    def cek(self, kunci: str, sekarang: float | None = None) -> None:
        t = sekarang if sekarang is not None else time.time()
        q = self._catatan[kunci]
        while q and t - q[0] > 86400:
            q.popleft()
        if len(q) >= self.per_hari or sum(1 for x in q if t - x <= 60) >= self.per_menit:
            raise galat(429, "RATE_LIMITED", "Mediator sedang istirahat sebentar. Coba lagi nanti.")
        q.append(t)


def susun_pesan(body: MediatorBody) -> list[dict[str, str]]:
    """Gabungkan konteks layar, riwayat singkat, dan pesan siswa menjadi format chat."""
    konteks = (
        f"Fase RMT: {body.fase or '-'}\n"
        f"Fungsi kognitif sasaran: {body.fungsi_kognitif or '-'}\n"
        f"Isi layar yang sedang dikerjakan siswa:\n{body.konteks or '-'}"
    )
    pesan: list[dict[str, str]] = [
        {"role": "system", "content": PROMPT_SISTEM},
        {"role": "system", "content": konteks},
    ]
    for g in body.riwayat:
        pesan.append({"role": "user" if g.peran == "siswa" else "assistant", "content": g.teks})
    pesan.append({"role": "user", "content": body.pesan})
    return pesan


def rapikan(teks: str, maks_kalimat: int = 3) -> str:
    """Jaga aturan cognitive load: maksimal 3 kalimat. Kalimat terakhir (pertanyaan pemandu) selalu dipertahankan."""
    teks = re.sub(r"\*\*|__|`|#+ ", "", teks).strip()
    kalimat = [k.strip() for k in re.split(r"(?<=[.?!])\s+", teks) if k.strip()]
    if len(kalimat) <= maks_kalimat:
        return " ".join(kalimat)
    tanya = next((k for k in reversed(kalimat) if k.endswith("?")), kalimat[-1])
    awal = [k for k in kalimat if k is not tanya][: maks_kalimat - 1]
    return " ".join([*awal, tanya])


def tanya_deepseek(pesan: list[dict[str, str]], klien: httpx.Client | None = None) -> str:
    pilihan = penyedia()
    if pilihan is None:
        raise galat(503, "AI_NOT_CONFIGURED", "Mediator AI belum diaktifkan.")
    url, model, kunci = pilihan
    data: dict[str, Any] = {"model": model, "messages": pesan, "temperature": 0.4, "max_tokens": 220}
    if url == GROQ_URL:  # model penalar: beri ruang token, nalar singkat
        data.update(max_tokens=600, reasoning_effort="low")
    try:
        kepala = {"Authorization": f"Bearer {kunci}"}
        if klien is not None:
            r = klien.post(url, json=data, headers=kepala)
        else:
            with httpx.Client(timeout=25) as k:
                r = k.post(url, json=data, headers=kepala)
    except httpx.HTTPError:
        raise galat(502, "AI_UNAVAILABLE", "Mediator tidak bisa dihubungi. Coba lagi nanti.")
    if r.status_code != 200:
        raise galat(502, "AI_UNAVAILABLE", "Mediator tidak bisa dihubungi. Coba lagi nanti.")
    try:
        teks = r.json()["choices"][0]["message"]["content"].strip()
    except (ValueError, KeyError, IndexError, TypeError):
        raise galat(502, "AI_UNAVAILABLE", "Jawaban mediator tidak terbaca. Coba lagi.")
    if not teks:
        raise galat(502, "AI_UNAVAILABLE", "Jawaban mediator kosong. Coba lagi.")
    return rapikan(teks)[:800]
