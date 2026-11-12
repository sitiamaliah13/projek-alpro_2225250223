"""Program console FungsiKu: alat bantu guru/peneliti untuk materi Pemetaan Fungsi.

Jalankan:  python main.py
"""

from __future__ import annotations

from fungsiku_core.function_check import cek_fungsi, korespondensi_satu_satu, pesan_isu
from fungsiku_core.penilaian_rumus import (
    baca_angka,
    format_angka,
    format_rumus,
    periksa_rumus,
    periksa_substitusi,
    rumus_dari_dua_nilai,
)
from fungsiku_core.skor import kategori_n_gain, n_gain, nilai_akhir

MENU = """
=== FungsiKu (console) ===
1. Cek relasi: fungsi atau bukan?
2. Cek korespondensi satu-satu
3. Rumus fungsi dari dua nilai
4. Periksa rumus jawaban siswa
5. Periksa substitusi (deteksi salah tanda)
6. Nilai akhir dan N-Gain
0. Keluar
"""


def baca_himpunan(label: str) -> list[str]:
    """Contoh masukan: 1, 2, 3"""
    teks = input(f"{label} (pisahkan dengan koma): ").strip()
    return [x.strip() for x in teks.split(",") if x.strip()]


def baca_pasangan() -> list[tuple[str, str]]:
    """Contoh masukan: 1-a, 2-b, 2-c"""
    teks = input("Pasangan (contoh: 1-a, 2-b): ").strip()
    hasil = []
    for bagian in (x.strip() for x in teks.split(",") if x.strip()):
        if bagian.count("-") != 1:
            raise ValueError(f"'{bagian}' harus berbentuk a-b.")
        a, b = (y.strip() for y in bagian.split("-"))
        if not a or not b:
            raise ValueError(f"'{bagian}' belum lengkap.")
        hasil.append((a, b))
    return hasil


def baca_bilangan(label: str):
    return baca_angka(input(f"{label}: "))


def menu_cek_fungsi() -> None:
    domain = baca_himpunan("Anggota A")
    pasangan = baca_pasangan()
    hasil = cek_fungsi(domain, pasangan)
    if hasil["is_function"]:
        print("✓ Fungsi. Setiap anggota A punya tepat satu pasangan.")
        print("  Range:", "{" + ", ".join(hasil["range"]) + "}")
    else:
        print("✗ Bukan fungsi.")
        for isu in hasil["issues"]:
            print("  -", pesan_isu(isu))


def menu_satu_satu() -> None:
    domain = baca_himpunan("Anggota A")
    kodomain = baca_himpunan("Anggota B")
    pasangan = baca_pasangan()
    if korespondensi_satu_satu(domain, kodomain, pasangan):
        print("✓ Korespondensi satu-satu.")
    else:
        print("✗ Bukan korespondensi satu-satu.")


def menu_dua_nilai() -> None:
    print("Masukkan dua nilai fungsi: f(x1) = y1 dan f(x2) = y2.")
    x1, y1 = baca_bilangan("x1"), baca_bilangan("y1")
    x2, y2 = baca_bilangan("x2"), baca_bilangan("y2")
    a, b = rumus_dari_dua_nilai(x1, y1, x2, y2)
    print(f"  a = ({format_angka(y2)} − {format_angka(y1)}) : ({format_angka(x2)} − {format_angka(x1)}) = {format_angka(a)}")
    print(f"  b = {format_angka(y1)} − {format_angka(a)} × {format_angka(x1)} = {format_angka(b)}")
    print("  Rumus:", format_rumus(a, b))


def menu_periksa_rumus() -> None:
    a = baca_bilangan("Kunci a")
    b = baca_bilangan("Kunci b")
    jawaban = input("Rumus jawaban siswa (contoh: 3x - 1): ")
    hasil = periksa_rumus(jawaban, a, b)
    print(("✓ " if hasil["benar"] else "✗ ") + hasil["pesan"])
    if hasil["error_tag"]:
        print("  Jenis kesalahan:", hasil["error_tag"])


def menu_substitusi() -> None:
    a, b = baca_bilangan("a"), baca_bilangan("b")
    x = baca_bilangan("x")
    jawaban = baca_bilangan("Jawaban siswa untuk f(x)")
    hasil = periksa_substitusi(a, b, x, jawaban)
    print(("✓ " if hasil["benar"] else "✗ ") + hasil["pesan"])
    if not hasil["benar"]:
        print("  Nilai yang benar:", format_angka(hasil["nilai"]))
    if hasil["error_tag"]:
        print("  Jenis kesalahan:", hasil["error_tag"])


def menu_skor() -> None:
    pre = float(baca_bilangan("Skor pretest (0–30)"))
    post = float(baca_bilangan("Skor posttest (0–30)"))
    print(f"  Nilai pretest  : {nilai_akhir(pre)}")
    print(f"  Nilai posttest : {nilai_akhir(post)}")
    g = n_gain(pre, post)
    print(f"  N-Gain         : {g if g is not None else '-'} ({kategori_n_gain(g)})")


AKSI = {
    "1": menu_cek_fungsi,
    "2": menu_satu_satu,
    "3": menu_dua_nilai,
    "4": menu_periksa_rumus,
    "5": menu_substitusi,
    "6": menu_skor,
}


def main() -> None:
    while True:
        print(MENU)
        pilihan = input("Pilih menu: ").strip().lstrip("﻿")  # BOM dari pipe PowerShell
        if pilihan == "0":
            print("Sampai jumpa!")
            return
        aksi = AKSI.get(pilihan)
        if aksi is None:
            print("⚠ Menu tidak dikenal. Ketik angka 0–6.")
            continue
        try:
            aksi()
        except (ValueError, TypeError, KeyError) as e:
            # Input tidak valid ditangani tanpa menghentikan program (rubrik P15: ketahanan).
            print(f"⚠ Input tidak valid: {e}")


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\nProgram dihentikan.")
