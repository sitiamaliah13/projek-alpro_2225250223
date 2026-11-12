# AGENTS.md — Panduan untuk AI Coding Agent (Claude Code, dll.)

Baca berkas ini sebelum mengubah kode. Rujukan: [prd.md](prd.md) (terutama §3 peta temuan wawancara), [design.md](design.md), [architecture.md](architecture.md), [api.md](api.md), [task.md](task.md).

## Konteks
**FungsiKu** adalah PWA untuk siswa SMP kelas VIII belajar **Pemetaan Fungsi** di HP Android. Proyek ini adalah penelitian pengembangan **ADDIE** dengan dasar wawancara *cognitive load* informan S01. Sasarannya meningkatkan **literasi matematis**. Pemilik proyek adalah mahasiswa Pendidikan Matematika, jadi jelaskan hal teknis dengan bahasa sederhana.

## Aturan Wajib
1. **Setiap fitur harus punya bukti temuan.** Cantumkan kode temuan (mis. `IL01`, `EL03`, `GL02`) di komentar komponen atau deskripsi PR. Jangan menambah fitur tanpa bukti di prd.md §3 kecuali diminta pemilik proyek.
2. **Bahasa:**
   - Teks UI dan konten memakai Bahasa Indonesia baku yang ramah anak SMP.
   - Kalimat ≤ 20 kata, maksimal 3 kalimat per kartu.
   - Nama variabel/fungsi kode boleh bahasa Inggris.
3. **Stack sesuai tahap:**
   - MVP/demo: **JavaScript + React (Vite)**; materi di JSON dan progres lokal. Jangan menambah backend atau layanan berbayar sebelum diminta.
   - Tahap lanjutan bila disetujui: **Python + FastAPI** (+ SymPy) dan **Supabase**.
   - Diagram panah: **SVG**.
   - Ilustrasi 3D pelengkap: **Three.js** (`@react-three/fiber`).
   - Database: **Supabase**.
4. **Aturan cognitive load** (design.md §1):
   - Tanpa animasi otomatis/dekoratif (EL03).
   - Warna hanya untuk makna, sesuai token semantik.
   - Satu visual utama per layar.
   - Siswa mengatur tempo.
   - Hint 3 tingkat yang muncul hanya bila diminta.
   - Umpan balik menjelaskan *mengapa*.
5. **Three.js hanya pelengkap:**
   - Di-*lazy load*, `frameloop="demand"`, `dpr` maks 1,5.
   - Wajib ada sakelar "Matikan 3D" + alternatif statis.
6. **Keamanan & etika data anak:**
   - MVP memakai nama panggilan samaran dan penyimpanan lokal; jangan minta nama lengkap atau data pribadi.
   - Kunci jawaban asesmen formal tidak boleh dikirim ke frontend. Kunci latihan lokal hanya untuk demo dan jangan dianggap rahasia.
   - Nama panggilan tidak ikut ekspor; pengenal ekspor harus anonim.
   - Bila backend dibuat, `SUPABASE_SERVICE_KEY` hanya ada di backend.
   - Jangan commit `.env`.
   - **Jangan pernah** menulis nama asli siswa, foto, atau rekaman wawancara ke repositori/log. Gunakan kode S01, S02.
7. **Kontrak API** di [api.md](api.md) adalah rancangan Tahap 2. Endpoint belum perlu dibuat untuk MVP.
8. **Logika syarat fungsi & penilaian rumus** ada di dua tempat: `python/fungsiku_core/` (`function_check.py`, `penilaian_rumus.py`; nanti dipakai backend) dan `frontend/src/lib/` (`fungsi.js`, `aljabar.js`). Keduanya harus diubah bersama dan diuji dengan kasus yang sama.

## Perintah MVP
```bash
# Frontend
cd frontend
npm run dev -- --host
npm run build
npm run test

# Inti Python untuk tugas algoritma
cd python
python -m pytest -q
```

## Konvensi
- **Python (tugas inti / backend masa depan):** type hints; Pydantic dan router hanya bila FastAPI disetujui.
- **JavaScript:** komponen fungsional + hooks; satu komponen per file.
- **Konten** materi/soal disimpan di `content/*.json`, tidak di-*hardcode*.
- Kasus uji minimal untuk syarat fungsi:
  - fungsi normal
  - `MULTI_PAIR`
  - `NO_PAIR`
  - keduanya sekaligus
  - domain kosong
  - korespondensi satu-satu

## Definition of Done
- Untuk perubahan MVP: ada kode temuan, sesuai checklist design.md §1, tes frontend lolos, dan dokumen terkait diperbarui.
- Uji 360 px/Chrome Android sebelum demo langsung dengan siswa.
- Backend, Supabase, dan lint tambahan hanya menjadi syarat bila Tahap 2 disetujui.

## Tanyakan Dulu ke Pemilik Proyek Bila Menyangkut
Isi materi/soal, kunci jawaban, cara penilaian, data yang dikumpulkan, penambahan layanan berbayar, atau perubahan ruang lingkup materi.
