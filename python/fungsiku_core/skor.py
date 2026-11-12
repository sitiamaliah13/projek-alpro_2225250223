"""Pengolahan skor tes Mathematical Literacy (docs/kisi-kisi-soal-literasi.md §D).

5 soal: Reasoning (soal 1 dan 5, maks 12), Formulating (6), Employing (6), Interpreting (6). Total 30.
"""

from __future__ import annotations

SKOR_MAKS_INDIKATOR: dict[str, int] = {
    "reasoning": 12,
    "formulate": 6,
    "employ": 6,
    "interpret": 6,
}
SKOR_MAKS_TOTAL = sum(SKOR_MAKS_INDIKATOR.values())  # 30

BATAS_TINGGI = 0.7
BATAS_SEDANG = 0.3


def _validasi_skor(skor: float, maks: float, nama: str = "skor") -> None:
    if isinstance(skor, bool) or not isinstance(skor, (int, float)):
        raise TypeError(f"{nama} harus berupa angka.")
    if not 0 <= skor <= maks:
        raise ValueError(f"{nama} harus di antara 0 dan {maks}, bukan {skor}.")


def nilai_akhir(skor_total: float) -> float:
    """Nilai 0–100 = (skor total : 30) × 100, dibulatkan 2 angka di belakang koma."""
    _validasi_skor(skor_total, SKOR_MAKS_TOTAL, "skor total")
    return round(skor_total / SKOR_MAKS_TOTAL * 100, 2)


def persen_per_indikator(skor: dict[str, float]) -> dict[str, float]:
    """Skor per indikator dalam persen, agar Reasoning (maks 12) sebanding dengan indikator lain (maks 6)."""
    hasil: dict[str, float] = {}
    for indikator, maks in SKOR_MAKS_INDIKATOR.items():
        if indikator not in skor:
            raise KeyError(f"Skor indikator '{indikator}' belum diisi.")
        _validasi_skor(skor[indikator], maks, f"skor {indikator}")
        hasil[indikator] = round(skor[indikator] / maks * 100, 2)
    lebih = set(skor) - set(SKOR_MAKS_INDIKATOR)
    if lebih:
        raise KeyError(f"Indikator tidak dikenal: {', '.join(sorted(lebih))}.")
    return hasil


def n_gain(pre: float, post: float, maks: float = SKOR_MAKS_TOTAL) -> float | None:
    """N-Gain = (post − pre) : (maks − pre).

    Mengembalikan None bila pretest sudah maksimal (pembagian dengan nol tidak terdefinisi).
    """
    _validasi_skor(pre, maks, "skor pretest")
    _validasi_skor(post, maks, "skor posttest")
    if pre == maks:
        return None
    return round((post - pre) / (maks - pre), 4)


def kategori_n_gain(g: float | None) -> str:
    """Kategori Hake: tinggi (g ≥ 0,7), sedang (0,3 ≤ g < 0,7), rendah (g < 0,3)."""
    if g is None:
        return "tidak terdefinisi (pretest sudah maksimal)"
    if g >= BATAS_TINGGI:
        return "tinggi"
    if g >= BATAS_SEDANG:
        return "sedang"
    return "rendah"
