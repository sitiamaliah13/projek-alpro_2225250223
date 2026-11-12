# Proposal Proyek — FungsiKu
*Format mengikuti Bahan Ajar Pertemuan 14 (Perancangan Proyek), Algoritma dan Pemrograman, Dr. Aan Hendrayana, S.Si., M.Pd.*

| | |
|---|---|
| Nama / NIM | Siti Amaliah / 2225250223 |
| Mata kuliah | Algoritma dan Pemrograman, S1 Pendidikan Matematika FKIP Untirta, 2026/2027 Ganjil |
| Jenis proyek | Program pembelajaran matematika (individu) |

## 1. Judul Proyek
**FungsiKu: Program Pembelajaran Pemetaan Fungsi Kelas VIII dengan Pengelolaan Beban Kognitif untuk Literasi Matematis**

## 2. Latar Belakang
Wawancara dengan siswa (informan S01, 4 November 2026) menunjukkan empat kesulitan utama pada materi pemetaan fungsi:
- Siswa bingung membedakan relasi dan fungsi bila satu anggota domain punya dua pasangan atau tidak punya pasangan (IL01).
- Siswa sering salah tanda negatif saat menghitung nilai fungsi (IL05).
- Siswa sulit menyusun rumus dari dua nilai fungsi (F-2).
- Soal yang panjang dan berisi informasi pengecoh membuat siswa kewalahan (EL01, EL05).

Siswa belum mendapat umpan balik langsung yang menjelaskan *mengapa* jawabannya salah. Karena itu dibutuhkan program yang memeriksa jawaban secara otomatis, menjelaskan letak kesalahannya, dan menyajikan materi sedikit demi sedikit.

## 3. Pengguna dan Tujuan
| Pengguna | Kebutuhan | Manfaat langsung |
|---|---|---|
| Siswa SMP kelas VIII (uji coba 3 siswa, P01–P03) | Belajar mandiri di HP, di kelas maupun di rumah | Umpan balik instan beserta alasannya, petunjuk bertahap, bisa dipakai offline |
| Guru / peneliti | Memeriksa jawaban dan mengolah skor tes | Program memeriksa syarat fungsi, rumus, dan tanda; menghitung skor per indikator dan N-Gain |

**Tujuan:** membantu siswa menguasai pemetaan fungsi dan meningkatkan literasi matematis. Literasi diukur dengan 5 soal pretest dan 5 soal posttest paralel, skor maksimal 30.

## 4. Ruang Lingkup
**Fitur wajib (inti Python, berbasis console, sesuai batasan RPS):**
1. Memeriksa apakah suatu relasi merupakan fungsi, lengkap dengan alasannya.
2. Menyusun rumus fungsi linear dari dua nilai fungsi.
3. Menilai rumus jawaban siswa (bentuk setara diterima) dan mendeteksi jenis kesalahan.
4. Memeriksa substitusi dan mendeteksi salah tanda.
5. Mengolah skor tes: nilai akhir, persen per indikator, dan N-Gain.

**Fitur tambahan (antarmuka siswa):** aplikasi web PWA (React + Vite) yang memakai logika yang sama. Isinya:
- 7 materi (M0–M2, M4–M7);
- Mesin Fungsi 3D;
- mode offline;
- dipublikasikan lewat GitHub Pages.

**Batas proyek:**
- Tanpa server dan database. Data siswa tersimpan di perangkat dan diekspor sebagai JSON.
- Tanpa nama asli siswa.
- Materi hanya pemetaan fungsi kelas VIII.
- M3 (Banyaknya Pemetaan) ditunda.

## 5. Kebutuhan
### Kebutuhan Fungsional
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F01 | Program menerima himpunan A dan daftar pasangan, lalu menentukan fungsi atau bukan beserta alasannya | Wajib |
| F02 | Program mendeteksi anggota A dengan dua pasangan atau lebih (`MULTI_PAIR`) dan tanpa pasangan (`NO_PAIR`) | Wajib |
| F03 | Program menyusun rumus f(x) = ax + b dari dua nilai fungsi | Wajib |
| F04 | Program menilai rumus siswa dan mendeteksi `SIGN_ERROR`, `SLOPE_ERROR`, `OFFSET_ERROR` | Wajib |
| F05 | Program memeriksa substitusi dan mendeteksi salah tanda | Wajib |
| F06 | Program menghitung nilai akhir, persen per indikator, dan N-Gain | Wajib |
| F07 | Program menolak input tidak valid dengan pesan yang jelas, tanpa berhenti | Wajib |
| F08 | Antarmuka web untuk siswa: materi, latihan, tes, ekspor data | Tambahan |

### Kebutuhan Nonfungsional
- Mudah dijalankan dari terminal VS Code dengan `python main.py`.
- Pesan kesalahan berbahasa Indonesia, pendek, dan menjelaskan *mengapa*.
- Nama fungsi dan variabel jelas.
- Tidak memuat data pribadi siswa.
- Dapat diuji ulang dengan test case yang sama (pytest).
- Antarmuka web: huruf ≥ 16 px, tanpa animasi otomatis, rapi di layar HP 360 px.

## 6. Input – Proses – Output
| Fitur | Input | Proses | Output |
|---|---|---|---|
| Cek fungsi | A = `1,2,3`; pasangan `1-a, 2-b, 2-c` | Kelompokkan tujuan per anggota A, lalu hitung banyak pasangannya | "✗ Bukan fungsi. 2 punya 2 pasangan. 3 belum punya pasangan." |
| Rumus dua nilai | f(2)=5, f(−1)=−4 | a = Δf(x) : Δx; b = y₁ − a·x₁ | `f(x) = 3x - 1` dan langkah hitungnya |
| Penilaian rumus | kunci a=3, b=−1; jawaban `3x + 1` | Baca rumus menjadi (a, b), lalu bandingkan dengan kunci | "✗ Tandanya terbalik", `SIGN_ERROR` |
| Substitusi | f(x)=2x−3, x=−2, jawaban 1 | Hitung nilai benar, lalu cocokkan dengan pola salah tanda | "Positif × negatif hasilnya negatif", nilai benar −7 |
| Skor | pre = 10, post = 24 | Nilai = skor : 30 × 100; g = (post − pre) : (30 − pre) | Nilai 33,33 → 80; N-Gain 0,7 (tinggi) |

## 7. Algoritma (pseudocode alur utama)
```
MULAI
  ulangi:
    tampilkan menu 1–6, 0 = keluar
    baca pilihan
    jika pilihan = 0 → SELESAI
    jika pilihan tidak dikenal → tampilkan peringatan, ulangi
    coba:
      jalankan fitur sesuai pilihan
    jika input tidak valid (ValueError/TypeError/KeyError):
      tampilkan "Input tidak valid: <alasan>"   # program tidak berhenti

CEK_FUNGSI(A, pasangan):
  jika A kosong → bukan fungsi (EMPTY_DOMAIN)
  untuk setiap a di A: kumpulkan tujuan panahnya (tanpa duplikat)
  untuk setiap a di A:
    0 tujuan  → isu NO_PAIR
    >1 tujuan → isu MULTI_PAIR
  asal pasangan bukan anggota A → isu OUT_OF_DOMAIN
  fungsi ⇔ tidak ada isu; range = gabungan semua tujuan

RUMUS_DARI_DUA_NILAI(x1, y1, x2, y2):
  jika x1 = x2 → galat "nilai x harus berbeda"
  a ← (y2 − y1) / (x2 − x1)
  b ← y1 − a × x1
```

## 8. Struktur Program
| Modul / fungsi | Tanggung jawab | Input | Output |
|---|---|---|---|
| `function_check.cek_fungsi()` | Memeriksa syarat fungsi | domain, pasangan | dict `is_function`, `issues`, `range` |
| `function_check.korespondensi_satu_satu()` | Memeriksa korespondensi satu-satu | A, B, pasangan | bool |
| `penilaian_rumus.rumus_dari_dua_nilai()` | Menyusun a dan b | x1, y1, x2, y2 | (a, b) |
| `penilaian_rumus.periksa_rumus()` | Menilai rumus siswa | teks, a, b | dict `benar`, `error_tag`, `pesan` |
| `penilaian_rumus.periksa_substitusi()` | Menilai substitusi dan mendeteksi salah tanda | a, b, x, jawaban | dict |
| `skor.nilai_akhir()`, `skor.n_gain()` | Mengolah skor tes | skor | angka / kategori |
| `main.main()` | Mengatur menu dan validasi input | — | — |

```
projek-alpro_2225250223/
├── README.md, proposal.md, prd.md, design.md, architecture.md, task.md
├── python/                 ← INTI PROYEK (console)
│   ├── main.py
│   ├── fungsiku_core/      function_check.py, penilaian_rumus.py, skor.py
│   └── tests/              test_*.py, test_case.md
├── frontend/               ← antarmuka siswa (React + Vite, PWA)
├── content/                materi & soal (JSON)
├── docs/                   kisi-kisi materi, instrumen tes, panduan deploy
└── .github/workflows/      deploy otomatis ke GitHub Pages
```

## 9. Struktur Data
| Kebutuhan | Struktur | Alasan |
|---|---|---|
| Himpunan A dan B | `list` | Urutan anggota dipertahankan untuk ditampilkan |
| Pasangan berurutan | `list` of `tuple` (a, b) | Satu pasangan berisi tepat dua nilai |
| Pasangan per anggota A | `dict` {anggota: [tujuan]} | Akses cepat berdasarkan anggota A |
| Hasil pemeriksaan | `dict` (`is_function`, `issues`, `range`) | Mudah dibaca dan diuji |
| Bilangan hasil hitung | `Fraction` | Hasil eksak; 2,5 tidak menjadi 2,4999… |
| Skor maksimum per indikator | `dict` konstanta | Menghindari *magic number* |

## 10. Test Case
Ada 39 kasus bernomor, mencakup kondisi normal, batas, dan invalid. Tabel lengkapnya di [python/tests/test_case.md](python/tests/test_case.md). Hasil terakhir: **pytest 54 passed** dan **Vitest 39 passed**. Ringkasannya:

| ID | Kategori | Input / Kondisi | Expected |
|---|---|---|---|
| TC01 | Normal | A={1,2,3}; 1→a, 2→a, 3→b | Fungsi, range {a, b} |
| TC02 | Normal | 2→b dan 2→c | Bukan fungsi, `MULTI_PAIR` pada 2 |
| TC03 | Normal | 3 tanpa pasangan | Bukan fungsi, `NO_PAIR` pada 3 |
| TC05 | Batas | A kosong | `EMPTY_DOMAIN`, tidak error |
| TC17 | Invalid | x1 = x2 | Galat ditangani (cegah pembagian nol) |
| TC21 | Normal | Rumus `3x + 1`, kunci 3x − 1 | `SIGN_ERROR` |
| TC32 | Invalid | Skor 31 | Ditolak dengan pesan validasi |
| TC37 | Batas | N-Gain dengan pretest = 30 | Tidak terdefinisi, tidak error |

## 11. Pembagian Tugas
Proyek ini dikerjakan secara individu. Semua peran dipegang satu orang.

| Peran | PIC | Bukti |
|---|---|---|
| Koordinator & perancang materi | Siti Amaliah | proposal.md, prd.md, docs/kisi-kisi-*.md |
| Programmer logika (Python) | Siti Amaliah | python/fungsiku_core/ |
| Programmer antarmuka (JavaScript) | Siti Amaliah | frontend/ |
| Tester / QA | Siti Amaliah | python/tests/, frontend/src/lib/*.test.js |
| Dokumentasi | Siti Amaliah | README.md, docs/ |

## 12. Jadwal Milestone
| Waktu | Target | Status |
|---|---|---|
| Pertemuan 14 | Proposal, struktur repositori, pseudocode, test case | ✅ |
| Antara P14–P15 | Implementasi fitur wajib (inti Python) + antarmuka web | ✅ |
| Pertemuan 15 | Integrasi, pengujian, debugging, dokumentasi README | ✅ (bug log di test_case.md) |
| Pertemuan 16 | Presentasi dan demonstrasi 3–5 menit | ⏳ |

## 13. Repository
- **URL repositori GitHub:** *(diisi setelah repositori dibuat)*
- **Demo publik:** https://aplikasi-pembelajaran-fungsiku-2225250223.netlify.app

---
**Bantuan yang dipakai:** Claude Code (Anthropic) membantu menyusun kode, pengujian, dan dokumentasi. Seluruh logika ditinjau dan diuji ulang oleh penyusun.
