"""Penilaian rumus dan tanda untuk fungsi linear f(x) = ax + b (temuan IL05, F-2).

Memakai Fraction agar hasil eksak (tidak ada galat pembulatan seperti 0.1 + 0.2).
Kembar dengan frontend/src/lib/aljabar.js.
"""

from __future__ import annotations

import re
from fractions import Fraction

Angka = int | float | Fraction

POLA_ANGKA = re.compile(r"^[+-]?\d+(\.\d+)?$")


def nilai_fungsi(a: Angka, b: Angka, x: Angka) -> Fraction:
    """f(x) = ax + b."""
    return Fraction(a) * Fraction(x) + Fraction(b)


def rumus_dari_dua_nilai(x1: Angka, y1: Angka, x2: Angka, y2: Angka) -> tuple[Fraction, Fraction]:
    """Rumus dari f(x1) = y1 dan f(x2) = y2 (design.md §4.3, strategi tabel).

    a = perubahan f(x) : perubahan x, lalu b dicari dengan substitusi satu titik.
    """
    if Fraction(x1) == Fraction(x2):
        raise ValueError("Nilai x kedua titik harus berbeda.")
    a = (Fraction(y2) - Fraction(y1)) / (Fraction(x2) - Fraction(x1))
    b = Fraction(y1) - a * Fraction(x1)
    return a, b


def _normalisasi_angka(teks: str) -> str:
    """Gaya Indonesia: titik ribuan dibuang, koma menjadi desimal ("1.500" -> "1500", "2,5" -> "2.5")."""
    teks = re.sub(r"\.(?=\d{3}(\D|$))", "", teks)
    return teks.replace(",", ".")


def baca_rumus_linear(teks: str) -> tuple[Fraction, Fraction]:
    """Membaca rumus linear dari jawaban siswa.

    Contoh yang diterima: "3x-1", "-1 + 3x", "f(x) = 3x − 1", "y = 1.500x + 20.000", "2,5x".
    Melempar ValueError bila format tidak dikenali.
    """
    s = str(teks or "").lower()
    s = re.sub(r"\s+", "", s)
    s = s.replace("−", "-").replace("–", "-")
    s = re.sub(r"[×*·]", "", s)
    s = re.sub(r"^(f\(x\)|y)=", "", s)
    s = _normalisasi_angka(s)
    if s == "":
        raise ValueError("Rumus masih kosong.")

    suku = re.findall(r"[+-]?[^+-]+", s)
    if "".join(suku) != s:
        raise ValueError("Format rumus belum dikenali.")

    a = Fraction(0)
    b = Fraction(0)
    for t in suku:
        if t.endswith("x"):
            k = t[:-1]
            if k in ("", "+"):
                a += 1
            elif k == "-":
                a -= 1
            elif POLA_ANGKA.match(k):
                a += Fraction(k)
            else:
                raise ValueError("Format rumus belum dikenali.")
        elif POLA_ANGKA.match(t):
            b += Fraction(t)
        else:
            raise ValueError("Format rumus belum dikenali.")
    return a, b


def periksa_rumus(teks: str, a_kunci: Angka, b_kunci: Angka) -> dict:
    """Membandingkan rumus siswa dengan kunci. Bentuk setara diterima.

    error_tag (api.md): SIGN_ERROR, SLOPE_ERROR, OFFSET_ERROR, atau None.
    """
    a_kunci, b_kunci = Fraction(a_kunci), Fraction(b_kunci)
    try:
        a, b = baca_rumus_linear(teks)
    except ValueError as e:
        return {"benar": False, "error_tag": None, "pesan": f"{e} Contoh penulisan: 3x - 1."}

    if a == a_kunci and b == b_kunci:
        return {"benar": True, "error_tag": None, "pesan": "Tepat!"}
    tanda_a = a_kunci != 0 and a == -a_kunci and b == b_kunci
    tanda_b = b_kunci != 0 and b == -b_kunci and a == a_kunci
    if tanda_a or tanda_b:
        return {
            "benar": False,
            "error_tag": "SIGN_ERROR",
            "pesan": "Angkanya sudah benar, tetapi tandanya terbalik. Periksa + dan −.",
        }
    if a != a_kunci:
        return {
            "benar": False,
            "error_tag": "SLOPE_ERROR",
            "pesan": "Nilai a belum tepat. Bandingkan perubahan f(x) dengan perubahan x.",
        }
    return {
        "benar": False,
        "error_tag": "OFFSET_ERROR",
        "pesan": "Nilai a sudah tepat. Coba substitusi satu titik untuk mencari b.",
    }


def periksa_substitusi(a: Angka, b: Angka, x: Angka, jawaban: Angka) -> dict:
    """Memeriksa hasil substitusi f(x) = ax + b dan mendeteksi salah tanda (IL05)."""
    a, b, x, jawaban = Fraction(a), Fraction(b), Fraction(x), Fraction(jawaban)
    nilai = nilai_fungsi(a, b, x)
    if jawaban == nilai:
        return {"benar": True, "nilai": nilai, "error_tag": None, "pesan": "Tepat!"}

    kandidat_salah_tanda = {a * -x + b, -(a * x) + b, a * x - b, -nilai} - {nilai}
    if jawaban in kandidat_salah_tanda:
        if x < 0 or a < 0:
            pesan = "Periksa tanda. Positif × negatif hasilnya negatif."
        else:
            pesan = "Periksa tanda + dan − pada setiap langkah."
        return {"benar": False, "nilai": nilai, "error_tag": "SIGN_ERROR", "pesan": pesan}
    return {
        "benar": False,
        "nilai": nilai,
        "error_tag": None,
        "pesan": "Hasilnya belum tepat. Hitung a × x dulu, lalu tambahkan b.",
    }


def periksa_langkah_kali(a: Angka, x: Angka, jawaban: Angka) -> dict:
    """Langkah 1 substitusi (F8 Penanda Tanda): a × x."""
    a, x, jawaban = Fraction(a), Fraction(x), Fraction(jawaban)
    nilai = a * x
    if jawaban == nilai:
        return {"benar": True, "nilai": nilai, "error_tag": None, "pesan": "Tepat!"}
    if nilai != 0 and jawaban == -nilai:
        if a < 0 and x < 0:
            pesan = "Tandanya terbalik. Negatif × negatif hasilnya positif."
        else:
            pesan = "Tandanya terbalik. Positif × negatif hasilnya negatif."
        return {"benar": False, "nilai": nilai, "error_tag": "SIGN_ERROR", "pesan": pesan}
    return {"benar": False, "nilai": nilai, "error_tag": None, "pesan": "Hitung lagi perkaliannya."}


def periksa_langkah_tambah(hasil_kali: Angka, b: Angka, jawaban: Angka) -> dict:
    """Langkah 2 substitusi: hasil kali + b."""
    p, b, jawaban = Fraction(hasil_kali), Fraction(b), Fraction(jawaban)
    nilai = p + b
    if jawaban == nilai:
        return {"benar": True, "nilai": nilai, "error_tag": None, "pesan": "Tepat!"}
    if jawaban in {p - b, -p + b, -nilai} - {nilai}:
        if b < 0:
            pesan = f"Mengurangi {format_angka(-b)} berarti mundur {format_angka(-b)} langkah pada garis bilangan."
        else:
            pesan = f"Menambah {format_angka(b)} berarti maju {format_angka(b)} langkah pada garis bilangan."
        return {"benar": False, "nilai": nilai, "error_tag": "SIGN_ERROR", "pesan": pesan}
    return {"benar": False, "nilai": nilai, "error_tag": None, "pesan": "Hitung lagi penjumlahannya langkah demi langkah."}


def baca_angka(teks: str) -> Fraction:
    """Membaca isian angka siswa ("−7", "2,5", "1.500"). Melempar ValueError bila tidak valid."""
    s = _normalisasi_angka(str(teks or "").strip().replace("−", "-").replace("–", "-").replace(" ", ""))
    if not POLA_ANGKA.match(s):
        raise ValueError(f"'{teks}' bukan angka.")
    return Fraction(s)


def format_angka(nilai: Fraction) -> str:
    """Menampilkan Fraction dengan rapi gaya Indonesia: 3, -1, 2,5, atau 1/3."""
    if nilai.denominator == 1:
        return str(nilai.numerator)
    desimal = float(nilai)
    if Fraction(desimal).limit_denominator() == nilai and len(repr(desimal)) <= 8:
        return repr(desimal).replace(".", ",")
    return f"{nilai.numerator}/{nilai.denominator}"


def format_rumus(a: Fraction, b: Fraction) -> str:
    """Contoh: (3, -1) -> "f(x) = 3x - 1"."""
    if a == 0:
        return f"f(x) = {format_angka(b)}"
    if a == 1:
        bagian_a = "x"
    elif a == -1:
        bagian_a = "-x"
    else:
        bagian_a = f"{format_angka(a)}x"
    if b == 0:
        return f"f(x) = {bagian_a}"
    tanda = "+" if b > 0 else "-"
    return f"f(x) = {bagian_a} {tanda} {format_angka(abs(b))}"
