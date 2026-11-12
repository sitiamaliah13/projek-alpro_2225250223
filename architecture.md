# Arsitektur — FungsiKu

> **MVP demo (Tahap 1): Frontend-First.** Yang dijalankan sekarang hanya React PWA, konten `content/*.json`, dan penyimpanan lokal. Backend FastAPI serta Supabase pada rancangan ini adalah rencana Tahap 2, bukan syarat demo. Rincian ada di [task.md](task.md).

## 1. Gambaran Umum MVP
```
┌────────────── HP Android (Chrome / PWA) ──────────────┐
│ React + Vite                                          │
│  ├─ SVG interaktif: diagram panah (tarik garis)       │
│  ├─ Three.js pelengkap: Mesin Fungsi (opsional)       │
│  ├─ Service Worker (cache konten, offline)            │
│  └─ localStorage: pengaturan dan progres              │
│     Konten: content/*.json                            │
└───────────────────────────────────────────────────────┘
```

### Rencana tahap berikutnya (belum dibangun)
Jika penelitian memerlukan pengumpulan data terpusat, tambahkan FastAPI dan Supabase setelah demo.
API, JWT, database, serta skema di bawah adalah rancangan, bukan layanan yang saat ini berjalan.

**Pembagian visual (penting untuk cognitive load):**
- **Diagram panah** memakai **SVG 2D**. Interaksi utama harus jelas dan presisi (EL02: "panahnya jelas dan nama himpunannya terlihat").
- **Three.js** dipakai sebagai **pelengkap ilustrasi** saja (Mesin Fungsi, transisi panah → titik grafik, tangga pola). Ilustrasi selalu diam sampai diketuk (EL03).
- Pink lembut adalah warna identitas UI. Warna matematika tetap memakai token semantik design.md §2.

## 2. Teknologi
| Komponen | MVP Tahap 1 | Rencana Tahap 2 |
|---|---|---|
| UI | React 18 + Vite 6 + Tailwind CSS | Tetap |
| Diagram & ilustrasi | SVG; Three.js opsional dan lazy load | Tetap |
| Konten dan progres | JSON bundel + localStorage | API + Supabase |
| Backend dan database | Tidak digunakan | FastAPI + Supabase |
| Penilaian | JavaScript untuk latihan lokal; Python untuk tugas inti | FastAPI memakai logika Python |
| Tes | Vitest + pytest | Tambahkan tes API bila backend dibuat |

## 3. Struktur Folder
```
frontend/src/
  pages/        Masuk, Pretest, CekBekal, PetaModul, Pelajaran, Latihan, Progres, Posttest
  components/
    KartuKonsep, TombolLanjut, PanelHint, SkalaBeban, UmpanBalik
    diagram/    DiagramPanah.jsx (SVG, tarik/ketuk), PenandaFungsi.jsx, BuatDiagramku.jsx
    jembatan/   JembatanRepresentasi.jsx (tahap 1–6), TabelPola.jsx
    aljabar/    Substitusi.jsx (penanda tanda), CekBalik.jsx
    soal/       SoalLiterasi.jsx (Pahami/Rumuskan/Hitung/Tafsirkan), TandaiInfo.jsx
  three/        MesinFungsi.jsx, PanahJadiTitik.jsx, TanggaPola.jsx
  lib/          fungsi.js (cek syarat fungsi di sisi klien untuk umpan balik instan)
  api/          client.js, hooks.js
backend/app/
  main.py, config.py, db.py, auth.py, schemas.py
  routers/      auth, content, attempts, progress, assessments, diagnostic
  services/
    grading.py       # penilaian per tipe soal
    function_check.py# syarat fungsi: tiap anggota domain tepat satu pasangan
    error_tags.py    # klasifikasi kesalahan: SIGN_ERROR, MULTI_PAIR, NO_PAIR, ...
    adaptive.py      # aturan jalur & saran
supabase/migrations/001_init.sql, seed.sql
content/m0..m7.json
```

## 4. Skema Database
```sql
classes            (id uuid pk, name text, grade int)
students           (id uuid pk, code text unique, nickname text, class_id fk,
                    is_active bool default true, created_at timestamptz)
modules            (id text pk, title text, order_no int, published bool)
lessons            (id text pk, module_id fk, title text, order_no int, cards jsonb)
items              (id text pk, lesson_id fk null,
                    assessment text null,            -- 'pre' | 'post' | 'diagnostic' | null
                    type text,                       -- 'mcq' | 'numeric' | 'arrow_diagram'
                                                     -- | 'formula' | 'multi_step' | 'explain'
                    literacy_process text[],         -- 'reasoning' | 'formulate' | 'employ' | 'interpret'
                    difficulty int,                  -- 1..3
                    structure_tag text,              -- untuk fitur "Pola Sama" (GL05)
                    stem jsonb, answer jsonb, hints jsonb, feedback jsonb)
attempts           (id uuid pk, student_id fk, item_id fk, step text,
                    response jsonb, is_correct bool,
                    error_tag text null,             -- mis. SIGN_ERROR, MULTI_PAIR, NO_PAIR
                    hints_used int, used_check_back bool,
                    duration_ms int, created_at timestamptz)
explanations       (id uuid pk, student_id fk, item_id fk, reason_choice int,
                    reason_correct bool, text text null, created_at)  -- GL04
lesson_progress    (student_id fk, lesson_id fk, status text, stars int,
                    completed_at timestamptz, pk(student_id, lesson_id))
cognitive_load     (id uuid pk, student_id fk, lesson_id fk, rating int check (rating between 1 and 9), created_at)
assessment_results (id uuid pk, student_id fk, kind text, score numeric,
                    per_process jsonb, created_at)
```
- RLS aktif di semua tabel tanpa policy publik; hanya backend yang mengakses.
- `items.answer` tidak pernah dikirim ke frontend.
- `error_tag` menjadi dasar indikator G5 (penurunan kesalahan tanda) dan G3.

## 5. Logika Inti
**Cek syarat fungsi** (`function_check.py`, juga diduplikasi di `lib/fungsi.js` untuk umpan balik instan):
```
input: A (domain), pasangan [(a,b), ...]
untuk tiap a di A:
  0 pasangan  → BUKAN fungsi, alasan NO_PAIR: "a belum punya pasangan"
  >1 pasangan → BUKAN fungsi, alasan MULTI_PAIR: "a punya k pasangan"
selain itu → FUNGSI; range = himpunan b yang terpasang
```

**Penilaian rumus:** SymPy mem-*parse* jawaban siswa, lalu memeriksa kesetaraannya dengan kunci. Bila tidak setara, sistem mencoba mendiagnosis: apakah hasil berubah tanda pada x negatif (SIGN_ERROR), atau b salah (OFFSET_ERROR).

**Adaptif (`adaptive.py`):**
- Cek Bekal: skor bilangan bulat < 70% → modul penguatan tanda.
- Rating beban ≥ 7, atau 2× salah berturut-turut → tawarkan contoh tambahan & hint 1.
- 3 benar tanpa hint dan rating ≤ 3 → tawarkan "Kerjakan langsung" (lewati contoh rumpang).

## 6. Autentikasi
1. Kode dibuat lewat seed dengan format `FK-<kelas>-<4 karakter acak>`.
2. `POST /auth/login` mengembalikan JWT (30 hari, `sub=student_id`).
3. Token disimpan di `localStorage`.
4. Rate limit 5 percobaan/menit/IP.

## 7. Offline
- App shell & konten di-cache.
- Latihan dapat dinilai offline untuk tipe sederhana: cek syarat fungsi di klien, dan hash jawaban numerik.
- Jawaban masuk antrian dan dikirim lewat `POST /attempts/batch` saat online.
- Pretest/posttest wajib online karena dikerjakan **di kelas**.
- **Pra-unduh konten:** setelah login pertama di kelas, semua modul MVP otomatis di-cache (target < 3 MB). Dengan begitu belajar di rumah bisa tanpa kuota. Status "✓ Siap dipakai offline" tampil di Peta Modul.
- Token JWT berlaku 30 hari, jadi siswa tidak perlu login ulang di rumah.

## 8. Deployment
| Bagian | Layanan | Catatan |
|---|---|---|
| DB | Supabase Free (project `fungsiku`, Singapura) | pause setelah 7 hari tanpa aktivitas |
| Backend | **Vercel** (FastAPI serverless, project `fungsiku-api-2225250223`) | dipilih karena bisa diunggah tanpa Git; batas login per IP bersifat upaya terbaik |
| Frontend | Netlify (`aplikasi-pembelajaran-fungsiku-2225250223`) | HTTPS gratis |

Skema yang benar-benar dipakai ada di [supabase/migrations/001_init.sql](supabase/migrations/001_init.sql)
(menyesuaikan bentuk progres aplikasi; tabel konten `modules/lessons/items` belum dibuat karena konten masih di JSON).

Variabel lingkungan:
- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `CORS_ORIGINS`
- Frontend: `VITE_API_URL`

## 9. Performa 3D
- Geometri prosedural tanpa file model.
- `dpr={[1,1.5]}` dan `frameloop="demand"`.
- Tanpa bayangan real-time; satu kanvas per layar.
- Ada sakelar "Matikan 3D" yang menggantinya dengan gambar statis.
- **HP siswa campuran** (hasil interview pemilik proyek), sehingga kualitas dipilih otomatis saat pertama dibuka:
  | Kondisi (`navigator.deviceMemory`, uji FPS 2 dtk) | Mode |
  |---|---|
  | RAM ≤ 2 GB atau FPS < 25 | **Statis**: 3D diganti gambar SVG, sakelar 3D tetap bisa dinyalakan |
  | RAM 3 GB atau FPS 25–45 | **Ringan**: `dpr` 1, tanpa antialias, segmen geometri dikurangi |
  | RAM ≥ 4 GB dan FPS > 45 | **Standar**: `dpr` maks 1,5, antialias |
- Pilihan mode disimpan di `localStorage` dan bisa diubah di Pengaturan.
