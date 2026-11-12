"""Kasus uji pengolahan skor tes (maks 30)."""

import pytest

from fungsiku_core.skor import SKOR_MAKS_TOTAL, kategori_n_gain, n_gain, nilai_akhir, persen_per_indikator


def test_tc30_total_maksimum_30():
    assert SKOR_MAKS_TOTAL == 30


def test_tc31_nilai_akhir_normal_dan_batas():
    assert nilai_akhir(21) == 70.0
    assert nilai_akhir(0) == 0.0
    assert nilai_akhir(30) == 100.0


@pytest.mark.parametrize("skor", [-1, 31])
def test_tc32_nilai_akhir_di_luar_rentang(skor):
    with pytest.raises(ValueError):
        nilai_akhir(skor)


def test_tc33_nilai_akhir_bukan_angka():
    with pytest.raises(TypeError):
        nilai_akhir("dua puluh")


def test_tc34_persen_per_indikator():
    hasil = persen_per_indikator({"reasoning": 9, "formulate": 3, "employ": 6, "interpret": 0})
    assert hasil == {"reasoning": 75.0, "formulate": 50.0, "employ": 100.0, "interpret": 0.0}


def test_tc35_indikator_belum_diisi():
    with pytest.raises(KeyError):
        persen_per_indikator({"reasoning": 9})


def test_tc36_n_gain_dan_kategori():
    assert n_gain(10, 24) == 0.7
    assert kategori_n_gain(n_gain(10, 24)) == "tinggi"
    assert kategori_n_gain(n_gain(10, 16)) == "sedang"  # 0,3
    assert kategori_n_gain(n_gain(10, 12)) == "rendah"  # 0,1


def test_tc37_n_gain_pretest_maksimal():
    """Batas: pretest 30 → pembagian nol, dikembalikan None, tidak error."""
    assert n_gain(30, 30) is None
    assert kategori_n_gain(None).startswith("tidak terdefinisi")
