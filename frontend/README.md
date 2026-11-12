# FungsiKu — Frontend (PWA, Tahap 1 Frontend-First)

React 18 + Vite 6 + Tailwind CSS 3. Aplikasi ini berjalan tanpa backend. Konten dibaca dari `../content/*.json`, sedangkan progres siswa disimpan di `localStorage` HP.

## Menjalankan
```bash
cd frontend
npm install          # sekali saja
npm run dev -- --host  # buka alamat "Network" dari HP yang satu Wi-Fi
npm run test         # Vitest: logika syarat fungsi & penilaian rumus
npm run build        # hasil di dist/, siap diunggah ke GitHub Pages
```
Masuk memakai nama panggilan samaran. Jangan masukkan nama lengkap; nama hanya tersimpan di perangkat dan tidak ikut ekspor.

## Alur Halaman
Masuk → Pretest → Cek Bekal → Peta Belajar → Pelajaran → Posttest. Posttest baru terbuka setelah semua modul yang tersedia selesai.

## Struktur
```
src/
  pages/        Masuk, Pretest, CekBekal, PetaModul, Pelajaran, Posttest
  components/   Layar, Tombol, Teks, UmpanBalik, PanelHint, SkalaBeban, InputAngka, LembarTes
    diagram/    DiagramPanah.jsx   (SVG: ketuk A lalu B; F5, IL01)
    kartu/      9 jenis layar pelajaran (pola 8 langkah design.md §3)
  data/         storage (localStorage), konten (content/*.json), nama samaran, progres, ProgresContext
  lib/          fungsi.js, aljabar.js (+ *.test.js) — kembar dengan python/fungsiku_core
```

## Aturan Tampilan yang Diterapkan
| Aturan | Cara penerapan |
|---|---|
| Warna semantik (design.md §2) | Token Tailwind `domain` #2563EB, `codomain` #0D9488, `negative` #9333EA, `ok`, `hint` |
| Huruf ≥ 16 px | Skala `fontSize` Tailwind diganti total, sehingga `text-sm`/`text-xs` tidak tersedia. Isi utama memakai 18 px |
| Tanpa animasi (EL03) | Semua `transition` dan `animation` dimatikan di `index.css` |
| Siswa mengatur tempo (A5) | Tidak ada perpindahan otomatis. Tombol Lanjut aktif setelah aktivitas selesai |
| Hint 3 tingkat (A8) | `PanelHint`: dibuka satu per satu hanya bila diminta |
| Status tidak hanya warna (§8) | Ikon ✓/⚠️ selalu disertai teks |
| Target sentuh ≥ 48 px | `min-h-tap` dan `min-w-tap` |

## Modul yang Tersedia
| Modul | Isi | Komponen utama |
|---|---|---|
| M1 Relasi atau Fungsi? | 17 layar | `DiagramPanah` (tarik garis), `KartuBuat` |
| M4 Jembatan Representasi | 14 layar, 6 tahap | `KartuJembatan`, `TabelFungsi`, `GrafikTitik` |
| M5 Nilai Fungsi | 12 layar | `aljabar/Substitusi` + `Bilangan` (Penanda Tanda ungu otomatis) |
| M6 Menyusun Rumus | 10 layar | `KartuRumus` + `aljabar/CekBalik` |
| Mesin Fungsi (M4, M5) | 3D / statis | `three/MesinFungsi3D` (lazy), `three/MesinFungsiStatis` |

**3D:** Three.js baru diunduh saat Mesin Fungsi dibuka. Kanvas memakai `frameloop="demand"` dan `dpr` maks 1,5, jadi hanya bergerak saat diketuk. Sakelar "Matikan 3D" ada di kartu dan di Peta Belajar. Bila RAM ≤ 2 GB atau WebGL gagal, tampilan otomatis memakai gambar statis.

**PWA:** setelah aplikasi dibuka sekali saat online, semua aset (±1,1 MB) tersimpan di HP dan aplikasi bisa dipakai offline. Aplikasi juga bisa dipasang ke layar utama ("Tambahkan ke Layar Utama"). Uji PWA dengan `npm run build && npm run preview`, karena service worker tidak aktif di `npm run dev`.

## Belum Dikerjakan (lihat task.md)
- M3 Banyaknya Pemetaan
- 3D PanahJadiTitik & TanggaPola (opsional)
- Deploy publik dan uji pada HP Android

Backend FastAPI, Supabase, serta integrasi API bukan bagian MVP demo. Rancangannya ada di
dokumen proyek untuk dipertimbangkan setelah demo.
