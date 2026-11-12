"""Kasus uji penilaian rumus & tanda. Sama dengan frontend/src/lib/aljabar.test.js."""

from fractions import Fraction

import pytest

from fungsiku_core.penilaian_rumus import (
    baca_angka,
    baca_rumus_linear,
    format_rumus,
    nilai_fungsi,
    periksa_langkah_kali,
    periksa_langkah_tambah,
    periksa_rumus,
    periksa_substitusi,
    rumus_dari_dua_nilai,
)


def test_tc13_nilai_fungsi_x_negatif():
    assert nilai_fungsi(2, -3, -2) == -7


def test_tc14_rumus_dari_dua_nilai_contoh_design():
    assert rumus_dari_dua_nilai(2, 5, -1, -4) == (3, -1)


def test_tc15_rumus_soal_pretest_3():
    a, b = rumus_dari_dua_nilai(20, 50_000, 50, 95_000)
    assert (a, b) == (1500, 20_000)
    assert nilai_fungsi(a, b, 80) == 140_000


def test_tc16_rumus_soal_posttest_3():
    a, b = rumus_dari_dua_nilai(25, 75_000, 55, 135_000)
    assert (a, b) == (2000, 25_000)
    assert nilai_fungsi(a, b, 85) == 195_000


def test_tc17_x_sama_invalid():
    with pytest.raises(ValueError):
        rumus_dari_dua_nilai(3, 1, 3, 2)


@pytest.mark.parametrize(
    "teks, a, b",
    [
        ("3x-1", 3, -1),
        ("-1 + 3x", 3, -1),
        ("f(x) = 3x − 1", 3, -1),
        ("y = 1.500x + 20.000", 1500, 20_000),
        ("2,5x", Fraction(5, 2), 0),
        ("-x + 4", -1, 4),
        ("7", 0, 7),
    ],
)
def test_tc18_bentuk_setara_dibaca(teks, a, b):
    assert baca_rumus_linear(teks) == (a, b)


@pytest.mark.parametrize("teks", ["", "abc", "x2", "3x+"])
def test_tc19_format_tidak_valid(teks):
    with pytest.raises(ValueError):
        baca_rumus_linear(teks)


def test_tc20_periksa_rumus_setara_diterima():
    assert periksa_rumus("-3 + 2x", 2, -3)["benar"] is True


def test_tc21_sign_error_pada_rumus():
    assert periksa_rumus("3x + 1", 3, -1)["error_tag"] == "SIGN_ERROR"


def test_tc22_slope_error():
    assert periksa_rumus("2x - 1", 3, -1)["error_tag"] == "SLOPE_ERROR"


def test_tc23_offset_error():
    assert periksa_rumus("3x + 5", 3, -1)["error_tag"] == "OFFSET_ERROR"


def test_tc24_rumus_tidak_dikenali_tidak_error():
    h = periksa_rumus("abc", 3, -1)
    assert h["benar"] is False
    assert h["error_tag"] is None


def test_tc25_substitusi_benar():
    assert periksa_substitusi(2, -3, -2, -7)["benar"] is True


@pytest.mark.parametrize("jawaban", [1, 7, -1])
def test_tc26_substitusi_salah_tanda(jawaban):
    assert periksa_substitusi(2, -3, -2, jawaban)["error_tag"] == "SIGN_ERROR"


def test_tc27_substitusi_salah_hitung_biasa():
    h = periksa_substitusi(2, -3, -2, 10)
    assert h["benar"] is False
    assert h["error_tag"] is None


def test_tc28_baca_angka():
    assert baca_angka("−7") == -7
    assert baca_angka("2,5") == Fraction(5, 2)
    with pytest.raises(ValueError):
        baca_angka("tujuh")


def test_tc29_lilin_di_luar_domain():
    """Soal pretest 4: t(10) = -5 secara aljabar; nilai negatif menandakan x di luar domain."""
    assert nilai_fungsi(Fraction(-5, 2), 20, 10) == -5
    assert nilai_fungsi(Fraction(-5, 2), 20, 8) == 0


def test_tc38_langkah_kali():
    assert periksa_langkah_kali(2, -2, -4)["benar"] is True
    assert periksa_langkah_kali(2, -2, 4)["error_tag"] == "SIGN_ERROR"
    assert "Negatif × negatif" in periksa_langkah_kali(-3, -5, -15)["pesan"]
    assert periksa_langkah_kali(2, -2, 5)["error_tag"] is None


def test_tc39_langkah_tambah():
    assert periksa_langkah_tambah(-4, -3, -7)["benar"] is True
    assert periksa_langkah_tambah(-4, -3, -1)["error_tag"] == "SIGN_ERROR"
    assert periksa_langkah_tambah(-4, -3, 7)["error_tag"] == "SIGN_ERROR"
    assert periksa_langkah_tambah(-4, -3, 0)["error_tag"] is None


def test_format_rumus():
    assert format_rumus(Fraction(3), Fraction(-1)) == "f(x) = 3x - 1"
    assert format_rumus(Fraction(5, 2), Fraction(0)) == "f(x) = 2,5x"
    assert format_rumus(Fraction(-1), Fraction(4)) == "f(x) = -x + 4"
