"""Kasus uji syarat fungsi. Sama dengan frontend/src/lib/fungsi.test.js (agents.md aturan 8)."""

import pytest

from fungsiku_core.function_check import cek_fungsi, korespondensi_satu_satu, pesan_isu


def tags(hasil):
    return [i["tag"] for i in hasil["issues"]]


def test_tc01_fungsi_normal():
    """Normal: dua anggota A ke anggota B yang sama tetap fungsi."""
    h = cek_fungsi([1, 2, 3], [(1, "a"), (2, "a"), (3, "b")])
    assert h["is_function"] is True
    assert h["issues"] == []
    assert h["range"] == ["a", "b"]


def test_tc02_multi_pair():
    h = cek_fungsi([1, 2, 3], [(1, "a"), (2, "b"), (2, "c"), (3, "d")])
    assert h["is_function"] is False
    assert h["issues"] == [{"tag": "MULTI_PAIR", "a": 2, "targets": ["b", "c"]}]


def test_tc03_no_pair():
    h = cek_fungsi([1, 2, 3, 4], [(1, "p"), (2, "q"), (4, "r")])
    assert h["is_function"] is False
    assert h["issues"] == [{"tag": "NO_PAIR", "a": 3}]


def test_tc04_keduanya_sekaligus():
    h = cek_fungsi([1, 2, 3], [(1, "a"), (1, "b"), (3, "c")])
    assert tags(h) == ["MULTI_PAIR", "NO_PAIR"]


def test_tc05_domain_kosong_batas():
    h = cek_fungsi([], [])
    assert h["is_function"] is False
    assert tags(h) == ["EMPTY_DOMAIN"]


def test_tc06_pasangan_dari_luar_domain_invalid():
    h = cek_fungsi([1, 2], [(1, "a"), (2, "b"), (5, "c")])
    assert h["is_function"] is False
    assert tags(h) == ["OUT_OF_DOMAIN"]


def test_tc07_panah_ganda_sama_dihitung_sekali():
    assert cek_fungsi([1], [(1, "a"), (1, "a")])["is_function"] is True


def test_tc08_angka_dan_teks_dianggap_sama():
    assert cek_fungsi(["1", "2"], [(1, "a"), (2, "b")])["is_function"] is True


def test_tc09_korespondensi_satu_satu():
    assert korespondensi_satu_satu([1, 2, 3], ["a", "b", "c"], [(1, "c"), (2, "a"), (3, "b")]) is True


def test_tc10_fungsi_tetapi_bukan_satu_satu():
    assert korespondensi_satu_satu([1, 2, 3], ["a", "b", "c"], [(1, "a"), (2, "a"), (3, "b")]) is False


def test_tc11_banyak_anggota_berbeda():
    assert korespondensi_satu_satu([1, 2], ["a", "b", "c"], [(1, "a"), (2, "b")]) is False


def test_tc12_pasangan_tidak_lengkap_invalid():
    with pytest.raises(ValueError):
        cek_fungsi([1, 2], [(1,)])


def test_pesan_menjelaskan_mengapa():
    assert pesan_isu({"tag": "MULTI_PAIR", "a": 2, "targets": ["b", "c"]}) == (
        "2 punya 2 pasangan (b dan c). Fungsi hanya boleh satu."
    )
    assert pesan_isu({"tag": "NO_PAIR", "a": 3}) == "3 belum punya pasangan."


def test_soal5_pretest_ekstrakurikuler():
    """Soal 5 pretest: bukan fungsi karena Cici dua pasangan dan Eka tanpa pasangan (bukan karena Futsal)."""
    A = ["Ani", "Beni", "Cici", "Dedi", "Eka"]
    relasi = [
        ("Ani", "Futsal"),
        ("Beni", "Futsal"),
        ("Cici", "Pramuka"),
        ("Cici", "Paduan Suara"),
        ("Dedi", "Pramuka"),
    ]
    h = cek_fungsi(A, relasi)
    assert h["is_function"] is False
    assert {(i["tag"], i["a"]) for i in h["issues"]} == {("MULTI_PAIR", "Cici"), ("NO_PAIR", "Eka")}
