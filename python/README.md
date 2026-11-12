# FungsiKu — Inti Python

## Deskripsi
Program Python untuk materi **Pemetaan Fungsi (SMP kelas VIII)**. Ini bagian logika dari aplikasi FungsiKu.
- **Pengguna:** guru dan peneliti.
- **Masalah yang diselesaikan:** siswa sering keliru membedakan relasi dan fungsi (temuan wawancara IL01), salah tanda saat substitusi (IL05), dan bingung menyusun rumus dari dua nilai fungsi (F-2).
- **Cara kerja:** program memeriksa jawaban siswa secara otomatis dan menjelaskan *mengapa* jawabannya salah.
- **Penggunaan ulang:** logika yang sama ada di aplikasi web (`frontend/src/lib/`). Nanti modul ini juga dipakai backend FastAPI.

## Fitur
1. **Cek syarat fungsi:** memeriksa apakah relasi merupakan fungsi, dengan alasannya.
   - Jenis kesalahan: `MULTI_PAIR` (ada anggota A dengan 2 pasangan atau lebih) dan `NO_PAIR` (ada anggota A tanpa pasangan).
   - Program juga menghitung range dan memeriksa korespondensi satu-satu.
2. **Rumus dari dua nilai fungsi:** dari f(x₁) = y₁ dan f(x₂) = y₂ didapat a dan b. Langkah hitungnya ikut ditampilkan.
3. **Penilaian rumus:** bentuk setara diterima, misalnya `3x-1` sama dengan `-1 + 3x`.
   - Penulisan angka gaya Indonesia dikenali: `1.500x + 20.000` dan `2,5x`.
   - Jenis kesalahan: `SIGN_ERROR`, `SLOPE_ERROR`, `OFFSET_ERROR`.
4. **Penilaian substitusi:** mendeteksi salah tanda, misalnya 2 × (−2) − 3 dijawab 1 padahal hasilnya −7.
5. **Pengolahan skor tes literasi (maks. 30):** nilai akhir, persen per indikator, dan N-Gain beserta kategorinya.

## Persyaratan
- Python 3.10 atau lebih baru. Logika inti tidak butuh pustaka tambahan.
- `pytest` hanya diperlukan untuk menjalankan pengujian.

## Cara Menjalankan
Buka terminal VS Code di folder `python/`:
```bash
# 1. Program console
python main.py

# 2. Pengujian (sekali saja: buat venv dan pasang pytest)
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements-dev.txt
python -m pytest -v
```

Contoh sesi (menu 1 dan 3):
```
Pilih menu: 1
Anggota A (pisahkan dengan koma): 1,2,3
Pasangan (contoh: 1-a, 2-b): 1-a, 2-b, 2-c
✗ Bukan fungsi.
  - 2 punya 2 pasangan (b dan c). Fungsi hanya boleh satu.
  - 3 belum punya pasangan.

Pilih menu: 3
x1: 2   y1: 5   x2: -1   y2: -4
  a = (-4 − 5) : (-1 − 2) = 3
  b = 5 − 3 × 2 = -1
  Rumus: f(x) = 3x - 1
```

## Algoritma Inti (pseudocode)
```
CEK_FUNGSI(A, pasangan):
  jika A kosong → bukan fungsi (EMPTY_DOMAIN)
  untuk setiap anggota a di A: kumpulkan tujuan panahnya (tanpa duplikat)
  untuk setiap a di A:
    0 tujuan  → isu NO_PAIR
    >1 tujuan → isu MULTI_PAIR
  pasangan yang asalnya bukan anggota A → isu OUT_OF_DOMAIN
  fungsi ⇔ tidak ada isu; range = gabungan semua tujuan

RUMUS_DARI_DUA_NILAI(x1, y1, x2, y2):
  jika x1 = x2 → galat (pembagian nol)
  a = (y2 − y1) / (x2 − x1)
  b = y1 − a·x1
```

## Struktur Folder
```
python/
├── main.py                    # program console (menu, validasi input)
├── fungsiku_core/
│   ├── function_check.py      # syarat fungsi, range, korespondensi satu-satu
│   ├── penilaian_rumus.py     # nilai fungsi, rumus dari 2 nilai, penilaian rumus & tanda
│   └── skor.py                # nilai akhir, persen per indikator, N-Gain
├── tests/
│   ├── test_function_check.py
│   ├── test_penilaian_rumus.py
│   ├── test_skor.py
│   └── test_case.md           # tabel ID–Input–Expected–Actual–Status + bug log
├── pytest.ini
└── requirements-dev.txt
```

**Struktur data yang dipakai:**
- **list** untuk himpunan dan pasangan berurutan.
- **dictionary** untuk memetakan anggota A ke daftar pasangannya, sekaligus untuk hasil pemeriksaan (`is_function`, `issues`, `range`).
- **Fraction** untuk hasil hitung eksak, sehingga 2,5 tidak menjadi 2,4999….

## Test Case
Ringkasan saja; tabel lengkap ada di [tests/test_case.md](tests/test_case.md).
- **Hasil terakhir:** 54 passed.
- **Jenis kasus:** normal, batas (domain kosong, skor 0 atau 30, pretest maksimal), dan invalid (input bukan angka, x₁ = x₂, pasangan tidak lengkap).

| ID | Kategori | Kasus | Status |
|---|---|---|---|
| TC01 | Normal | Fungsi normal | PASS |
| TC02 | Normal | `MULTI_PAIR` | PASS |
| TC03 | Normal | `NO_PAIR` | PASS |
| TC04 | Normal | `MULTI_PAIR` + `NO_PAIR` | PASS |
| TC05 | Batas | Domain kosong | PASS |
| TC09 | Normal | Korespondensi satu-satu | PASS |
| TC17 | Invalid | x₁ = x₂ | PASS |
| TC21 | Normal | Salah tanda pada rumus | PASS |
| TC32 | Invalid | Skor di luar 0–30 | PASS |
| TC37 | Batas | N-Gain saat pretest = 30 | PASS |

## Known Issues
- Rumus yang dikenali hanya bentuk linear ax + b. Bentuk seperti `2(x+1)` belum didukung dan akan dilaporkan "format belum dikenali".
- Pada program console, pasangan ditulis `a-b`. Karena itu anggota bernilai negatif (misalnya `-1-a`) belum bisa dimasukkan lewat menu 1–2.

## Kontribusi
| Nama / NIM | Peran |
|---|---|
| Siti Amaliah / 2225250223 | Perancang, programmer, tester, dokumentasi |

## Referensi / Bantuan
- Bahan ajar Algoritma dan Pemrograman Pertemuan 14–15 (Dr. Aan Hendrayana, S.Si., M.Pd.).
- Dokumentasi Python 3: modul `fractions`, `re`; dokumentasi pytest.
- Bantuan AI: Claude Code (Anthropic) dipakai untuk membantu menyusun kode, pengujian, dan dokumentasi. Seluruh logika telah ditinjau dan diuji.
