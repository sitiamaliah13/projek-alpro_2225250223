# FungsiKu ➡️🔢
Program pembelajaran **Pemetaan Fungsi** untuk siswa SMP kelas VIII.
- **Sasaran:** meningkatkan **Literasi Matematis**.
- **Dasar rancangan:** wawancara *cognitive load* (model ADDIE).
- **Isi proyek:** inti logika **Python** (program console + pytest) dan antarmuka siswa berupa aplikasi web **PWA** (React + Vite + Three.js) yang bisa dibuka di HP Android, iPhone, dan laptop.

🌐 **Demo publik:** https://aplikasi-pembelajaran-fungsiku-2225250223.netlify.app (server: https://fungsiku-api-2225250223.vercel.app, lihat [backend/README.md](backend/README.md))

## Identitas & Kontribusi
- *Nama:* Siti Amaliah *
- *NIM:* 2225250223 *
- *Mata Kuliah:* Algoritma dan Pemrograman
- *Peran:* Perancang materi, instrumen literasi, wawancara analisis beban kognitif, dan pengembang aplikasi FungsiKu.

## Deskripsi
Hasil wawancara dengan siswa menunjukkan beberapa kesulitan:
- membedakan relasi dan fungsi;
- salah tanda negatif saat substitusi;
- menyusun rumus dari dua nilai fungsi;
- kewalahan oleh soal panjang.

FungsiKu memeriksa jawaban siswa secara otomatis dan menjelaskan **mengapa** jawabannya salah. Materi disajikan satu ide per layar dengan petunjuk bertahap. Rancangan lengkapnya ada di [proposal.md](proposal.md).

## Fitur
**Inti Python (console)**, di folder [python/](python/) untuk tugas algoritma:
1. Cek syarat fungsi beserta alasannya (`MULTI_PAIR`, `NO_PAIR`), range, dan korespondensi satu-satu.
2. Rumus fungsi linear dari dua nilai fungsi, lengkap dengan langkah hitungnya.
3. Penilaian rumus siswa: bentuk setara diterima; mendeteksi `SIGN_ERROR`, `SLOPE_ERROR`, `OFFSET_ERROR`.
4. Penilaian substitusi dan deteksi salah tanda per langkah.
5. Pengolahan skor tes: nilai akhir, persen per indikator, N-Gain.

**Aplikasi siswa (PWA)**, di folder [frontend/](frontend/):
- Dashboard berisi Cek Bekal, Relasi atau Fungsi?, Domain–Kodomain–Range, Jembatan Representasi, Nilai Fungsi, Menyusun Rumus, dan Fungsi di Sekitarku.
- Simulasi Tarik Garis, Penanda Tanda (bilangan negatif berwarna ungu), Cek Balik, dan soal literasi 4 langkah.
- Mesin Fungsi 3D yang hanya bergerak saat diketuk, dengan sakelar "Matikan 3D".
- Pretest & posttest 5 soal, ekspor data JSON, dan mode offline.

## Persyaratan
- **Python 3.10+**. Program console tanpa pustaka tambahan; `pytest` untuk pengujian.
- **Node.js 20+** dan npm, untuk aplikasi web.
- **Git** dan **VS Code**.

## MVP Saat Ini
Untuk demo, aplikasi memakai frontend statis dan penyimpanan lokal. Siswa masuk memakai nama panggilan samaran;
nama panggilan tidak dimasukkan ke ekspor. Backend FastAPI dan Supabase belum diperlukan.

## Cara Menjalankan
```powershell
# Aplikasi siswa — kebutuhan utama untuk demo
cd frontend
npm install
npm run dev -- --host
```

Di terminal frontend lain, jalankan tes dan siapkan paket deploy:
```powershell
cd frontend
# Uji produksi sebelum demo
npm run siap-deploy
```

Program Python adalah bagian tugas algoritma, bukan server aplikasi. Jalankan di terminal terpisah:
```powershell
cd python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
python -m pytest -v
python main.py
```
Panduan publikasi (GitHub Pages, Netlify, Vercel) ada di [docs/DEPLOY.md](docs/DEPLOY.md).

## Status Saat Ini
- Backend FastAPI/Supabase belum dibuat; [api.md](api.md) adalah rancangan untuk tahap berikutnya.
- Tes Python terakhir: 54 passed.
- Tes frontend terakhir: 43 passed.
- Build frontend terakhir: berhasil.

## Struktur Folder
```
python/               INTI PROYEK: main.py, fungsiku_core/, tests/ (pytest + test_case.md)
frontend/             aplikasi siswa: React + Vite + Tailwind + Three.js (PWA)
content/              materi & soal dalam JSON (tidak di-hardcode)
docs/                 kisi-kisi materi, instrumen tes 5 soal, lembar soal, panduan deploy
.github/workflows/    deploy otomatis ke GitHub Pages
proposal.md           proposal proyek (format Pertemuan 14)
prd.md · design.md · architecture.md · api.md · task.md · AGENTS.md
```

## Test Case
Tabel lengkapnya (ID–Input–Expected–Actual–Status, beserta bug log) ada di [python/tests/test_case.md](python/tests/test_case.md). Hasil terakhir: **pytest 54 passed** dan **Vitest 43 passed**.

| ID | Kategori | Input | Expected | Status |
|---|---|---|---|---|
| TC01 | Normal | A={1,2,3}; 1→a, 2→a, 3→b | Fungsi, range {a, b} | PASS |
| TC02 | Normal | 2→b dan 2→c | `MULTI_PAIR` pada 2 | PASS |
| TC05 | Batas | A kosong | `EMPTY_DOMAIN`, tidak error | PASS |
| TC14 | Normal | f(2)=5, f(−1)=−4 | a=3, b=−1 | PASS |
| TC17 | Invalid | x1 = x2 | Galat ditangani | PASS |
| TC21 | Normal | `3x + 1` (kunci 3x − 1) | `SIGN_ERROR` | PASS |
| TC32 | Invalid | Skor 31 | Ditolak | PASS |
| TC37 | Batas | N-Gain, pretest = 30 | Tidak terdefinisi, tidak error | PASS |

## Known Issues
- Rumus yang dikenali hanya bentuk linear ax + b. Bentuk seperti `2(x+1)` belum didukung.
- Di program console, pasangan ditulis `a-b`, sehingga anggota negatif belum bisa dimasukkan lewat menu 1–2.
- Data siswa di aplikasi web tersimpan di masing-masing perangkat, belum di server. Data diambil lewat menu **Ekspor Data**.
- Modul M3 (Banyaknya Pemetaan) belum dibuat.

## Dokumen Proyek
| File | Isi |
|---|---|
| [proposal.md](proposal.md) | Proposal proyek: masalah, kebutuhan, IPO, algoritma, struktur, test case |
| [prd.md](prd.md) | Kebutuhan produk & peta temuan wawancara → fitur |
| [design.md](design.md) | Desain UI/UX & aturan cognitive load |
| [architecture.md](architecture.md) | Arsitektur & teknologi |
| [task.md](task.md) | Daftar tugas & jadwal |
| [docs/kisi-kisi-soal-literasi.md](docs/kisi-kisi-soal-literasi.md) | Instrumen pretest–posttest 5 soal + rubrik |

## Etika Data
Hanya kode informan (S01) dan kode peserta (P01–P03) yang dipakai. Nama siswa, foto, dan rekaman wawancara tidak dimasukkan ke repositori ini.

## Referensi / Bantuan
- Bahan Ajar Algoritma dan Pemrograman Pertemuan 14–15 (Dr. Aan Hendrayana, S.Si., M.Pd.).
- Dokumentasi Python 3, pytest, React, Vite, Three.js.
- Bantuan AI: Claude Code (Anthropic) dipakai untuk membantu menyusun kode, pengujian, dan dokumentasi. Seluruh logika telah ditinjau dan diuji.
