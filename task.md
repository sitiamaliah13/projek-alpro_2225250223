# Daftar Tugas — FungsiKu
Legenda: `[ ]` belum · `[~]` proses · `[x]` selesai

## Strategi: Frontend-First
Tahap awal dibuat sebagai **PWA frontend saja** (React + Vite + Tailwind), **tanpa backend eksternal**.
- **Tujuan:** draf aplikasi selesai, diunggah ke GitHub, dan siap didemokan pada **minggu depan (target 19 November 2026)**.
- **Alasan:**
  - Tidak bergantung pada akun Supabase/Render.
  - Tidak ada *cold start* server dan bisa jalan offline.
  - Sesuai arahan bahan ajar Pertemuan 14: "hindari integrasi layanan eksternal jika tidak diperlukan".
- **Setelah demo:** backend FastAPI + Supabase (Fase F) disambungkan tanpa merombak tampilan. Semua akses data lewat satu lapisan `src/data/` sehingga sumber datanya cukup diganti dari lokal ke API.

| Hal | Tahap 1 (Frontend-First, sekarang) | Tahap 2 (setelah demo) |
|---|---|---|
| Konten materi & soal | File `content/*.json` dibundel ke aplikasi | Diambil dari API |
| Login | Kode demo dicek di perangkat (bukan keamanan sungguhan) | `POST /auth/login` + JWT |
| Penyimpanan jawaban & progres | `localStorage` / IndexedDB di HP | Supabase lewat FastAPI |
| Penilaian latihan | `src/lib/` (JavaScript) | `services/` (Python) |
| Data untuk peneliti | Tombol **Ekspor CSV/JSON** di menu Pengaturan | Dashboard Supabase / `export.py` |
| Hosting | **GitHub Pages** (gratis, statis) | GitHub Pages + Render + Supabase |

**Batasan yang diterima selama Tahap 1:**
- Kunci jawaban **latihan** ikut terbundel di aplikasi. Ini menyimpang dari agents.md aturan 6, dan dapat diterima untuk demo.
- Kunci **pretest/posttest tidak dimasukkan** ke aplikasi. Kedua tes dinilai manual oleh peneliti dengan rubrik.
- Data hanya tersimpan di HP masing-masing. Peneliti perlu mengekspornya dari setiap HP.

---

## Fase A — Analysis (ADDIE)
- [x] Wawancara mendalam informan S01 (4 Nov 2026)
- [x] Matriks temuan → kebutuhan desain (prd.md §3)
- [x] Dokumen inti: prd, readme, agents, architecture, task, design, api
- [x] Interview lanjutan dengan pemilik proyek: HP campuran, kelas + rumah, 3 siswa, internet rumah belum diketahui, alasan pilih + ketik
- [ ] Simpan ringkasan wawancara **tanpa nama/foto siswa** di `docs/wawancara-S01.md`
- [ ] Konfirmasi hal yang ambigu: kelas saat belajar (K01), EL04, maksud "fungsinya tertukar" (IL02)
- [ ] (Disarankan) Wawancara 1–2 informan tambahan untuk triangulasi

## Fase B — Design: Konten & Instrumen
- [x] Kisi-kisi materi M0–M7 (CP, TP, indikator, proses literasi, kode temuan)
- [x] Contoh materi lengkap M1 (Relasi atau Fungsi?) mengikuti pola 8 langkah
- [x] Kirim kisi-kisi + contoh materi ke Pak Aan, lalu terima kisi-kisi soal
- [x] Draf instrumen **5 soal pretest + 5 soal posttest paralel**, lengkap dengan kunci, rubrik per tahap, pedoman skor, dan lembar soal siswa (`docs/kisi-kisi-soal-literasi.md`, maks. 30)
- [ ] **Konfirmasi ke Pak Aan:** soal nomor 5 (syarat fungsi) sebagai tambahan dari 4 indikator; total skor 30
- [ ] Pindahkan instrumen ke Word, beri identitas penyusun, lalu cetak untuk uji coba
- [ ] Validasi ahli instrumen (2–3 validator; Aiken's V bila diminta)
- [ ] Uji keterbacaan soal dengan 1 siswa non-peserta
- [ ] Susun soal Cek Bekal (6 soal) dan latihan per sub-materi
- [ ] Tulis konten MVP ke `content/*.json`

## Fase C — Frontend-First PWA · 12–19 November 2026 (menuju demo)
Urutan disusun agar setiap hari ada versi yang bisa dibuka.

**Hari 1 (Kamis 12/11) — Persiapan**
- [x] Install **Node.js** (terpasang v26.13.1, npm 11.20.0)
- [ ] Git & repositori GitHub: **ditunda** atas keputusan pemilik proyek (12/11)
- [x] `.gitignore` (node_modules, dist, .env, `.venv`, data siswa)

**Hari 2 (Jumat 13/11) — Kerangka aplikasi** · selesai lebih awal 12/11
- [x] `frontend/`: Vite 6 + React 18 + Tailwind 3 + React Router (HashRouter untuk GitHub Pages)
- [x] Token warna semantik design.md (domain #2563EB, codomain #0D9488, negative #9333EA, ok, hint); huruf ≥ 16 px
- [x] Alur halaman: Masuk → Pretest → Cek Bekal → Peta Modul → Pelajaran → Posttest (terkunci sampai modul selesai)
- [x] Lapisan data lokal `src/data/` (baca `content/*.json`, simpan progres ke `localStorage`)
- [ ] Halaman Progres & Pengaturan (sakelar 3D)

**Hari 3 (Sabtu 14/11) — Logika inti + tes** · selesai 12/11
- [x] `src/lib/fungsi.js`: cek syarat fungsi (MULTI_PAIR, NO_PAIR, OUT_OF_DOMAIN, EMPTY_DOMAIN), range, korespondensi satu-satu
- [x] `src/lib/aljabar.js`: nilai fungsi, rumus dari dua nilai, baca rumus setara, deteksi SIGN/SLOPE/OFFSET_ERROR
- [x] Vitest dengan kasus wajib agents.md (36 tes lulus)

**Hari 4–5 (Minggu–Senin 15–16/11) — Fitur yang didemokan**
- [x] **M1** lengkap 17 layar: Simulasi Tarik Garis SVG + penanda ⚠️ di samping anggota bermasalah (F5, IL01)
- [x] Kartu konsep, contoh lengkap → rumpang, hint 3 tingkat, umpan balik "mengapa", Buat Diagramku (A1–A10, F6)
- [x] **M4** Jembatan Representasi 6 tahap: diagram → pasangan → tabel → pola → rumus → grafik; x biru, f(x) teal di semua tahap (F7, IL04, EL04) — 14 layar
- [x] **M5** Substitusi bertahap + Penanda Tanda: bilangan negatif otomatis dalam kurung & ungu, cek per langkah (F8, IL05) — 12 layar
- [x] **M6** Menyusun rumus dari tabel & dua nilai + **Cek Balik** mandiri + cara eliminasi sebagai "cara lain" (F12, F-2, GL02, DS02) — 10 layar
- [x] Jelaskan ke Temanmu: pilih alasan + ketik opsional (F14, GL04)
- [x] Skala beban kognitif 1–9 di akhir pelajaran (F16)
- [x] Cek Bekal 6 soal + saran penguatan tanda bila < 70% (**draf soal, perlu disetujui**)

**Hari 6 (Selasa 17/11) — 3D, tes, PWA**
- [x] Three.js **Mesin Fungsi** (lazy load, `frameloop="demand"`, `dpr` maks 1,5) + sakelar **Matikan 3D** + gambar statis (F17, EL03); otomatis statis bila RAM ≤ 2 GB
- [ ] (Opsional) 3D PanahJadiTitik & TanggaPola — tahap grafik M4 saat ini memakai SVG 2D
- [x] Halaman tes: lembar jawaban uraian untuk 5 soal pretest/posttest (tanpa kunci, tanpa skor otomatis)
- [x] Tombol **Ekspor data** (JSON) untuk peneliti di Peta Belajar
- [x] PWA: manifest, ikon, service worker (`vite-plugin-pwa`), bisa dipakai offline; status "✓ Siap dipakai offline" di Peta Belajar (precache ±1,1 MB)
- [x] Masuk dengan nama panggilan samaran; nama tidak disertakan dalam ekspor

- [x] **M2** Domain, Kodomain, Range (11 layar): sorot range dengan latar #CCFBF1, deteksi `TERM_SWAP` (IL02, IL03)
- [x] **M7** Fungsi di Sekitarku (8 layar): soal literasi 4 langkah Pahami → Rumuskan → Hitung → Tafsirkan, satu pengecoh per soal, "Kerjakan langsung", Pola Sama (F13, F15, EL05, GL05)

- [x] **Desain dashboard v0.3** (design.md §7a):
  - sidebar laptop + menu bawah HP; header "Selamat Datang!" + nama panggilan;
  - Hero Banner, grid kartu modul 01–07, kartu tes literasi;
  - halaman Materi, Latihan Interaktif (langsung ke layar latihan), Tes, Ekspor;
  - tombol "Mulai Belajar"; logo f(x)
- [x] Study Time (Web Audio API): mati bawaan, dijeda otomatis di layar fokus
- [x] `frontend/vercel.json` (rewrite SPA) + panduan Vercel di docs/DEPLOY.md
- [ ] Amati saat uji coba: apakah ada siswa yang menyalakan Study Time, dan apakah rating bebannya berbeda?

**Hari 7 (Rabu 18/11) — Unggah & gladi**
- [x] Siap deploy: `base: './'` + HashRouter, `_redirects` (Netlify), `.nojekyll`, workflow `.github/workflows/deploy-pages.yml`, skrip `npm run siap-deploy`, panduan [docs/DEPLOY.md](docs/DEPLOY.md). Diuji di subfolder `/fungsiku/` (tiru GitHub Pages): tanpa 404, refresh halaman dalam aman
- [ ] Unggah: Netlify Drop (seret `frontend/dist`) **atau** GitHub Pages (perlu Git)
- [ ] Uji di HP Android (Chrome) dan DevTools 360 px; checklist design.md §1 per layar
- [ ] README: cara menjalankan, fitur, struktur folder, tabel test case, *known issues*
- [ ] Skenario demo 3–5 menit (masuk → M1 tarik garis → M6 Cek Balik → 3D → ekspor data)

**Kamis 19/11 — Demo**

## Fase D — Inti Python (untuk rubrik mata kuliah)
Rubrik Proyek Akhir Pertemuan 15 menilai program Python yang berjalan dan diuji. Logika matematika yang sama dibuat juga dalam Python. Nantinya kode ini dipakai ulang oleh backend FastAPI.
- [x] `python/fungsiku_core/` (selesai 12/11):
  - `function_check.py`: syarat fungsi, range, korespondensi satu-satu
  - `penilaian_rumus.py`: nilai fungsi, rumus dari dua nilai, penilaian rumus & tanda
  - `skor.py`: skor per indikator, nilai akhir, N-Gain
- [x] `python/main.py`: program console 6 menu dengan validasi input
- [x] `tests/`: pytest (52 lulus) + `tests/test_case.md` (37 kasus normal/batas/invalid + bug log)
- [x] Kasus uji Python **sama** dengan Vitest (agents.md aturan 8)
- [x] `python/README.md` sesuai format bahan ajar P15 (isi nama/NIM di bagian Kontribusi)

## Fase E — Asesmen & Adaptif (setelah demo)
- [ ] Cek Bekal + jalur penguatan
- [ ] Soal literasi 4 langkah + TandaiInfo (F13), Pola Sama (F15)
- [ ] Saran adaptif dari skala beban
- [ ] Jembatan Representasi 6 tahap (F7), Buat Diagramku (F6), PanahJadiTitik & TanggaPola 3D

## Fase F — Backend & Database (setelah demo)
- [x] Buat akun Supabase & Vercel (pengganti Render, tanpa Git) — 13 Nov 2026
- [x] `supabase/migrations/001_init.sql` + RLS + `seed.sql` (5 kode: P01–P05)
- [x] FastAPI: `/health`, `/auth/login`, `/me`, `/progress`, JWT, rate limit, CORS — 12 tes pytest di `backend/tests`
- [x] Lapisan `src/data/` (`api.js`, `sinkron.js`): kode siswa opsional di halaman Masuk; progres tetap di HP lalu dikirim ke server, antre saat offline
- [ ] Pindahkan kunci latihan ke backend (memenuhi kembali agents.md aturan 6)
- [ ] Penilaian rumus dengan SymPy + `error_tags.py`

## Fase G — Implementation & Evaluation
- [ ] Buat kode untuk **3 siswa peserta** (P01–P03) + 2 kode cadangan
- [ ] Uji coba kelompok kecil: pretest (kertas) → belajar dengan aplikasi → posttest (kertas)
- [ ] Pengamatan *think-aloud* & wawancara singkat (tanpa nama asli)
- [ ] SUS + wawancara kejelasan tampilan
- [ ] Rekap skor per indikator (%), N-Gain per siswa & per indikator, beban per sub-materi, tren `error_tag`, penggunaan hint

## Backlog
- [ ] M3 Banyaknya Pemetaan
- [ ] Narasi audio
- [ ] Dashboard guru
- [ ] APK (Capacitor)
