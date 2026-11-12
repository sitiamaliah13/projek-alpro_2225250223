# Test Case — Inti Python FungsiKu

Dijalankan dengan `python -m pytest -v` pada 12 November 2026 (Python 3.13, pytest 9.2).
Hasil: **54 passed** (39 kasus bernomor; beberapa kasus memuat lebih dari satu masukan).
Kasus yang sama diuji di frontend (`frontend/src/lib/*.test.js`, Vitest: 39 passed).

Kategori: **N** = normal, **B** = batas, **I** = invalid.

## A. Syarat Fungsi (`function_check.py`)
| ID | Kat. | Input | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC01 | N | A={1,2,3}; 1→a, 2→a, 3→b | Fungsi; range {a, b} | Fungsi; range {a, b} | PASS |
| TC02 | N | A={1,2,3}; 1→a, 2→b, 2→c, 3→d | Bukan fungsi, MULTI_PAIR pada 2 | MULTI_PAIR pada 2 (b, c) | PASS |
| TC03 | N | A={1,2,3,4}; 1→p, 2→q, 4→r | Bukan fungsi, NO_PAIR pada 3 | NO_PAIR pada 3 | PASS |
| TC04 | N | A={1,2,3}; 1→a, 1→b, 3→c | MULTI_PAIR dan NO_PAIR | MULTI_PAIR, NO_PAIR | PASS |
| TC05 | B | A = {} | Bukan fungsi, EMPTY_DOMAIN, tidak error | EMPTY_DOMAIN | PASS |
| TC06 | I | A={1,2}; pasangan 5→c | OUT_OF_DOMAIN | OUT_OF_DOMAIN | PASS |
| TC07 | B | A={1}; 1→a dua kali | Fungsi (panah ganda dihitung sekali) | Fungsi | PASS |
| TC08 | B | A={"1","2"}; 1→a, 2→b | Fungsi ("1" = 1) | Fungsi | PASS |
| TC09 | N | A={1,2,3}, B={a,b,c}; 1→c, 2→a, 3→b | Korespondensi satu-satu | True | PASS |
| TC10 | N | 1→a, 2→a, 3→b | Bukan korespondensi satu-satu | False | PASS |
| TC11 | B | A={1,2}, B={a,b,c} | Bukan korespondensi satu-satu | False | PASS |
| TC12 | I | pasangan (1,) | ValueError | ValueError | PASS |
| — | N | Soal 5 pretest (ekstrakurikuler) | MULTI_PAIR Cici, NO_PAIR Eka | Sesuai | PASS |

## B. Penilaian Rumus & Tanda (`penilaian_rumus.py`)
| ID | Kat. | Input | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC13 | N | f(x)=2x−3, x=−2 | −7 | −7 | PASS |
| TC14 | N | f(2)=5, f(−1)=−4 | a=3, b=−1 | a=3, b=−1 | PASS |
| TC15 | N | f(20)=50.000, f(50)=95.000 (soal pretest 3) | a=1.500, b=20.000, f(80)=140.000 | Sesuai | PASS |
| TC16 | N | f(25)=75.000, f(55)=135.000 (soal posttest 3) | a=2.000, b=25.000, f(85)=195.000 | Sesuai | PASS |
| TC17 | I | x1 = x2 = 3 | ValueError (pembagian nol dicegah) | ValueError | PASS |
| TC18 | N | "3x-1", "-1 + 3x", "f(x) = 3x − 1", "y = 1.500x + 20.000", "2,5x", "-x + 4", "7" | Dibaca sebagai (a, b) yang setara | Sesuai (7 masukan) | PASS |
| TC19 | I | "", "abc", "x2", "3x+" | ValueError | ValueError (4 masukan) | PASS |
| TC20 | N | "-3 + 2x", kunci 2x−3 | Benar (bentuk setara diterima) | Benar | PASS |
| TC21 | N | "3x + 1", kunci 3x−1 | SIGN_ERROR | SIGN_ERROR | PASS |
| TC22 | N | "2x - 1", kunci 3x−1 | SLOPE_ERROR | SLOPE_ERROR | PASS |
| TC23 | N | "3x + 5", kunci 3x−1 | OFFSET_ERROR | OFFSET_ERROR | PASS |
| TC24 | I | "abc" | Salah, tanpa error program | benar=False, error_tag=None | PASS |
| TC25 | N | f(x)=2x−3, x=−2, jawaban −7 | Benar | Benar | PASS |
| TC26 | N | jawaban 1, 7, −1 | SIGN_ERROR | SIGN_ERROR (3 masukan) | PASS |
| TC27 | N | jawaban 10 | Salah hitung biasa (tanpa tag) | error_tag=None | PASS |
| TC28 | I | "−7", "2,5", "tujuh" | −7; 2,5; ValueError | Sesuai | PASS |
| TC29 | B | t(x)=20−2,5x; x=10 dan x=8 (soal pretest 4) | −5 dan 0 | −5 dan 0 | PASS |
| TC38 | N | Langkah kali: 2 × (−2) dijawab −4 / 4 / 5; (−3) × (−5) dijawab −15 | Benar / SIGN_ERROR / salah hitung; pesan "Negatif × negatif" | Sesuai | PASS |
| TC39 | N | Langkah tambah: −4 + (−3) dijawab −7 / −1 / 7 / 0 | Benar / SIGN_ERROR / SIGN_ERROR / salah hitung | Sesuai | PASS |

## C. Skor Tes (`skor.py`)
| ID | Kat. | Input | Expected | Actual | Status |
|---|---|---|---|---|---|
| TC30 | N | Total skor maksimum | 30 | 30 | PASS |
| TC31 | B | Skor 21, 0, 30 | 70; 0; 100 | 70,0; 0,0; 100,0 | PASS |
| TC32 | I | Skor −1, 31 | ValueError | ValueError | PASS |
| TC33 | I | Skor "dua puluh" | TypeError | TypeError | PASS |
| TC34 | N | R=9, F=3, E=6, I=0 | 75%, 50%, 100%, 0% | Sesuai | PASS |
| TC35 | I | Hanya reasoning diisi | KeyError | KeyError | PASS |
| TC36 | N | Pre 10 → post 24 / 16 / 12 | g = 0,7 tinggi / 0,3 sedang / 0,1 rendah | Sesuai | PASS |
| TC37 | B | Pre 30, post 30 | None (tidak terdefinisi), tidak error | None | PASS |

## Bug Log
| ID | Gejala | Penyebab | Perbaikan | Status |
|---|---|---|---|---|
| BUG-01 | Menu pertama dianggap "tidak dikenal" saat input dikirim lewat pipe PowerShell | PowerShell menambahkan karakter BOM (`﻿`) di awal input | `input().strip().lstrip("﻿")` di `main.py` | Closed |
