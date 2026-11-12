# Server FungsiKu (Tahap 2)

FastAPI kecil yang menyimpan progres siswa ke Supabase. Kontrak: [api.md](../api.md).

- **Alamat:** https://fungsiku-api-2225250223.vercel.app (cek: `/health`, dokumentasi: `/docs`)
- **Database:** Supabase project `fungsiku` (Singapura). Skema: [../supabase/migrations/001_init.sql](../supabase/migrations/001_init.sql)
- **Rahasia** (`SUPABASE_SERVICE_KEY`, `JWT_SECRET`) hanya ada di pengaturan Vercel → Environment Variables. Jangan ditulis di repo.

## Cara kerja singkat
1. Siswa penelitian mengisi **kode siswa** (P01–P05). Siapa pun yang mengosongkan kode otomatis dibuatkan kode `FK-UM-xxxxxx` (kelas "Umum"); kodenya tampil di menu Ekspor untuk pindah HP. Bila offline, belajar tetap jalan di HP saja.
2. Server memberi token 30 hari. Nama panggilan **tidak** dikirim ke server.
3. Setiap progres berubah, aplikasi mengirim salinan lewat `PUT /progress`. Saat offline, kiriman menunggu internet.
4. Server memecah progres ke tabel `attempts`, `explanations`, `cognitive_load`, `lesson_progress`,
   `diagnostic_results`, dan `assessment_results`. Kiriman berulang tidak membuat data ganda.

## Melihat data (peneliti)
Buka dashboard Supabase → project `fungsiku` → **Table Editor**:
- **`rekap_siswa`**: nilai latihan 0–100, skor & nilai pretest/posttest, N-Gain + kategori Hake, salah tanda, rata-rata beban.
- **`rekap_indikator`**: persen dan N-Gain per indikator literasi.
- Unduh ke Excel: **Export → Download as CSV**.

Skor pretest/posttest uraian diisi manual di tabel `assessment_results`:
kolom `score` (0–30) dan `per_process`, misalnya `{"reasoning": 9, "formulate": 5, "employ": 3, "interpret": 4}`.
Rumus sama dengan `python/fungsiku_core/skor.py` ([../supabase/migrations/002_rekap_nilai.sql](../supabase/migrations/002_rekap_nilai.sql), dijalankan 13 Nov 2026).

## Kode siswa
Lihat [../supabase/seed.sql](../supabase/seed.sql). Tambah kode baru lewat **SQL Editor** dengan meniru baris di file itu.

## Tes & unggah ulang
```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\pip install -r requirements-dev.txt
.\.venv\Scripts\python -m pytest -q
vercel deploy --prod
```
