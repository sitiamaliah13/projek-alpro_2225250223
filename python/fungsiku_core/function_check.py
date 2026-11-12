"""Cek syarat fungsi (temuan IL01).

Fungsi dari A ke B: SETIAP anggota A punya TEPAT SATU pasangan di B.
Kembar dengan frontend/src/lib/fungsi.js; bila diubah, ubah keduanya (agents.md aturan 8).
"""

from __future__ import annotations

from typing import Any, Hashable, Iterable, Sequence

Anggota = Hashable
Pasangan = tuple[Anggota, Anggota]


def _kunci(nilai: Any) -> str:
    """Bandingkan anggota sebagai teks, sehingga 1 dan "1" dianggap sama (seperti di JavaScript)."""
    return str(nilai)


def cek_fungsi(domain: Sequence[Anggota], pasangan: Iterable[Pasangan]) -> dict:
    """Memeriksa apakah relasi `pasangan` dari `domain` merupakan fungsi.

    Mengembalikan dictionary:
        is_function : bool
        issues      : list of dict, tiap isu punya "tag" (MULTI_PAIR, NO_PAIR, OUT_OF_DOMAIN, EMPTY_DOMAIN)
        range       : list anggota B yang terkena panah (urutan kemunculan)
    """
    if not domain:
        return {"is_function": False, "issues": [{"tag": "EMPTY_DOMAIN"}], "range": []}

    pasangan_dari: dict[str, list[Anggota]] = {_kunci(a): [] for a in domain}
    di_luar_domain: list[Anggota] = []

    for item in pasangan:
        if len(item) != 2:
            raise ValueError(f"Pasangan harus berisi 2 anggota, bukan {item!r}.")
        a, b = item
        daftar = pasangan_dari.get(_kunci(a))
        if daftar is None:
            if all(_kunci(x) != _kunci(a) for x in di_luar_domain):
                di_luar_domain.append(a)
        elif all(_kunci(t) != _kunci(b) for t in daftar):
            daftar.append(b)  # panah ganda yang sama dihitung sekali

    issues: list[dict] = []
    for a in domain:
        targets = pasangan_dari[_kunci(a)]
        if len(targets) == 0:
            issues.append({"tag": "NO_PAIR", "a": a})
        elif len(targets) > 1:
            issues.append({"tag": "MULTI_PAIR", "a": a, "targets": list(targets)})
    for a in di_luar_domain:
        issues.append({"tag": "OUT_OF_DOMAIN", "a": a})

    range_: list[Anggota] = []
    for targets in pasangan_dari.values():
        for b in targets:
            if all(_kunci(r) != _kunci(b) for r in range_):
                range_.append(b)

    return {"is_function": len(issues) == 0, "issues": issues, "range": range_}


def korespondensi_satu_satu(
    domain: Sequence[Anggota], kodomain: Sequence[Anggota], pasangan: Iterable[Pasangan]
) -> bool:
    """Fungsi, n(A) = n(B), dan setiap anggota B terpasang tepat sekali."""
    hasil = cek_fungsi(domain, list(pasangan))
    if not hasil["is_function"] or len(domain) != len(kodomain):
        return False
    kunci_kodomain = {_kunci(c) for c in kodomain}
    semua_di_kodomain = all(_kunci(b) in kunci_kodomain for b in hasil["range"])
    return semua_di_kodomain and len(hasil["range"]) == len(kodomain)


def pesan_isu(isu: dict) -> str:
    """Umpan balik yang menjelaskan mengapa (design.md A9), kalimat pendek."""
    tag = isu.get("tag")
    if tag == "NO_PAIR":
        return f"{isu['a']} belum punya pasangan."
    if tag == "MULTI_PAIR":
        daftar = " dan ".join(str(t) for t in isu["targets"])
        return f"{isu['a']} punya {len(isu['targets'])} pasangan ({daftar}). Fungsi hanya boleh satu."
    if tag == "OUT_OF_DOMAIN":
        return f"{isu['a']} bukan anggota A."
    if tag == "EMPTY_DOMAIN":
        return "Himpunan A masih kosong."
    return "Periksa lagi pasangannya."
