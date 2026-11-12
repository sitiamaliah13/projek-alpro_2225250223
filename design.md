# Desain — FungsiKu

## 1. Aturan Cognitive Load (berlaku di setiap layar)
| # | Aturan | Dasar wawancara |
|---|---|---|
| A1 | 1 ide utama per layar, **≤ 3 kalimat**, kalimat ≤ 20 kata | DS03, EL01 |
| A2 | 1 visual utama per layar (diagram **atau** tabel **atau** 3D) | EL02 |
| A3 | Warna **hanya untuk makna**, maksimal 4 warna semantik | EL03 |
| A4 | Tidak ada animasi otomatis/dekoratif; gerak hanya saat siswa mengetuk | EL03 |
| A5 | Siswa mengatur tempo (tombol **Lanjut / Ulangi**); tanpa auto-advance | EL04 |
| A6 | Transisi visual → simbol selalu lewat tahap perantara | IL04, EL04 |
| A7 | Soal cerita: data penting dapat ditandai, kalimat pengecoh dibuat minimal | EL05 |
| A8 | Hint hanya bila diminta, 3 tingkat | GL03 |
| A9 | Umpan balik menjelaskan **mengapa**, dengan nada suportif | GL03, kepercayaan diri |
| A10 | Teks dan gambar menyatu (label di dekat objek, bukan di legenda terpisah) | *split-attention* |

## 2. Warna Semantik
| Token | Hex | Makna (konsisten di semua tahap) |
|---|---|---|
| `domain` | `#2563EB` biru | himpunan asal / nilai x |
| `codomain` | `#0D9488` teal | himpunan kawan |
| `range` | `#0D9488` + latar `#CCFBF1` | anggota kawan yang terpasang |
| `arrow` | `#475569` abu tua | panah / aturan |
| `negative` | `#9333EA` ungu | bilangan negatif (penanda tanda, IL05) |
| `ok` | `#16A34A` | benar |
| `hint` | `#CA8A04` | petunjuk |
| `bg` / `text` | `#F8FAFC` / `#0F172A` | latar / teks |

Warna dasar tampilan memakai pink lembut (`#FFF7FB`) untuk identitas FungsiKu dan permintaan pemilik.
Pink hanya untuk tombol utama, logo, dan permukaan dekoratif statis; warna matematika pada tabel tetap mengikuti token semantik di atas.

Kesalahan ditandai dengan ikon ⚠️ dan garis bawah lembut, tanpa blok merah besar.

## 3. Pola Alur Sub-materi (tetap, agar tidak perlu belajar navigasi baru)
```
① Analogi nyata   → "Setiap siswa punya tepat satu nomor absen." (EL02, K02)
② Kartu konsep    → 1–3 kartu pendek
③ Simulasi / 3D   → tarik garis, jembatan, atau mesin fungsi
④ Contoh lengkap  → langkah muncul satu per satu (diketuk)
⑤ Contoh rumpang  → 1–2 langkah dikosongkan
⑥ Latihan         → hint, umpan balik, Cek Balik
⑦ Jelaskan        → "Bagaimana kamu menjelaskan ini ke temanmu?" (GL04)
⑧ Refleksi        → skala beban 1–9
```

## 4. Komponen Kunci
### 4.1 Simulasi Tarik Garis (F5) — IL01, GL01, DS01
```
   A          B
 ┌───┐      ┌───┐
 │ 1 │──────▶ a │
 │ 2 │──┬───▶ b │
 │   │  └───▶ c │      ✗ Bukan fungsi
 │ 3 │      │ d │      • 2 punya dua pasangan (b dan c)
 └───┘      └───┘      • 3 belum punya pasangan
```
- Interaksi: **tarik** dari anggota A ke B, atau **ketuk A lalu ketuk B** (alternatif untuk layar kecil). Ketuk panah untuk menghapusnya.
- Anggota A yang bermasalah diberi cincin ⚠️ dan alasannya ditampilkan tepat di sampingnya, bukan di bawah layar.
- **Pasangan contoh–bukan contoh**: dua diagram berdampingan yang hanya berbeda satu panah.
- **Tantangan Buat Diagramku**: contohnya "Buat relasi yang *bukan* fungsi karena satu anggota tidak punya pasangan."

### 4.2 Jembatan Representasi (F7) — IL04, EL04
Satu data yang sama (mis. f(x) = 2x + 1, A = {1, 2, 3, 4}) ditampilkan dalam 6 tahap. Setiap tahap mengisi satu layar dan dapat diulang:
| Tahap | Tampilan | Pertanyaan pemandu |
|---|---|---|
| 1 | Diagram panah | "Ke mana 1 dipasangkan?" |
| 2 | Pasangan berurut {(1,3), (2,5), ...} | "Panah 1→3 ditulis (1, 3)." |
| 3 | Tabel x \| f(x) | "Lihat kolom f(x)." |
| 4 | Pola selisih: +1 di x → +2 di f(x) | "Naik berapa setiap langkah?" → **a = 2** |
| 5 | Rumus: f(x) = 2x + **?**, mundur ke x = 0 | "Kalau x = 0, f(x) = ?" → **b = 1** |
| 6 | Grafik (3D *Panah jadi Titik*) | Panah "berdiri" menjadi titik pada bidang koordinat |

Warna x (biru) dan f(x) (teal) tetap sama di semua tahap, sehingga siswa melihat bahwa objek yang ditampilkan sama.

### 4.3 Menyusun Rumus dari Dua Nilai (M6) — temuan F-2
Contoh: f(2) = 5 dan f(−1) = −4.
1. Masukkan ke tabel 2 baris.
2. Hitung perubahan x: 2 − (−1) = **3**. Perubahan f(x): 5 − (−4) = **9**.
3. a = 9 : 3 = **3**.
4. Hitung b dari f(2): 3·2 + b = 5, sehingga **b = −1**.
5. **Cek Balik**: f(−1) = 3·(−1) − 1 = −4 ✓

Cara eliminasi aljabar ditampilkan *setelah* cara tabel, sebagai "cara lain" (DS02).

### 4.4 Penanda Tanda (F8) — IL05
- Saat siswa mengetik substitusi, bilangan negatif otomatis dibungkus kurung dan diberi warna ungu: `2 × (−2) − 3`.
- Setiap langkah dicek: `2 × (−2) = ?` → `−4` → `−4 − 3 = ?` → `−7`.
- Bila salah tanda, umpan balik menunjuk langkah yang salah: "Positif × negatif hasilnya negatif."

### 4.5 Soal Literasi 4 Langkah (F13) — EL05
```
Tarif ojek: Rp5.000 saat naik, lalu Rp2.000 per km.
Rani naik 6 km. Uangnya Rp20.000. Cukupkah?
──────────────────────────────────────────
① Pahami    : ketuk info penting  [Rp5.000] [Rp2.000/km] [6 km] [Rp20.000]
② Rumuskan  : f(x) = ___x + ___
③ Hitung    : f(6) = ___
④ Tafsirkan : Cukup / Tidak cukup, karena ___
                         [💡 Petunjuk]   [Periksa]
```
Langkah berikutnya terbuka setelah langkah sebelumnya selesai. Tombol "Kerjakan langsung" tersedia bagi siswa yang sudah mahir.

### 4.6 Ilustrasi 3D Three.js (pelengkap)
| Adegan | Isi | Interaksi |
|---|---|---|
| **Mesin Fungsi** | Kotak mesin bertuliskan "×2, lalu −3". Bola bernilai x masuk dan keluar sebagai f(x) | Siswa memilih x lalu mengetuk "Masukkan" |
| **Panah jadi Titik** | Diagram panah berputar 90° menjadi sumbu x dan y; tiap panah menjadi titik (x, f(x)) | Slider 0–100% |
| **Tangga Pola** | Balok setinggi f(x) berjejer; selisih tinggi antarbalok sama (a) | Ketuk balok untuk melihat selisih |

Aturan 3D: latar polos, ≤ 3 warna semantik, kamera tetap (putar opsional), tanpa rotasi otomatis, label HTML di dekat objek, dan sakelar **Matikan 3D**.

## 5. Gaya Visual
- Mobile-first, acuan lebar 360 px, satu kolom, tombol utama di zona jempol.
- Huruf Nunito/Inter; isi 16–18 px, judul 22 px, *line-height* 1,5.
- Ikon garis sederhana; ilustrasi datar tanpa gradasi berlebihan.

## 6. Wireframe Ringkas
```
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ FungsiKu            │ │ ← Relasi/Fungsi ●●○○│ │ ← Rumus dari Tabel  │
│                     │ │ Tarik panah dari A  │ │  x │ 1 │ 2 │ 3 │    │
│ Masukkan kodemu     │ │ ke B.               │ │ f(x)│ 3 │ 5 │ 7 │    │
│ ┌─────────────────┐ │ │  [diagram panah]    │ │      +2  +2         │
│ │ FK-8A-____      │ │ │                     │ │ f(x) = [2]x + [ ]   │
│ └─────────────────┘ │ │ ✓ Fungsi! Setiap    │ │                     │
│                     │ │ anggota A punya     │ │ [🔁 Cek Balik]      │
│ [     Masuk      ]  │ │ tepat 1 pasangan.   │ │ [💡] [ Periksa ]    │
│                     │ │        [Lanjut →]   │ │                     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

## 7. Motivasi Ringan
- Bintang 1–3 per sub-materi (benar tanpa hint).
- Lencana "Penjaga Syarat Fungsi" dan "Detektif Tanda".
- Tanpa papan peringkat.

## 7a. Tata Letak Dashboard (v0.3)
Ada dua jenis layar:
- **Layar menu** (Beranda, Materi Belajar, Latihan Interaktif, Pretest & Posttest, Ekspor Data) memakai *dashboard*:
  - laptop: sidebar kiri;
  - HP: bilah menu bawah 5 ikon + label;
  - header berisi "Selamat Datang!" dan lencana kode siswa aktif.
- **Layar fokus** (pelajaran, Cek Bekal, tes) **tanpa** sidebar dan menu, hanya tombol kembali. Tujuannya menekan *extraneous load* saat siswa berpikir (A1, A2).

Isi Beranda dari atas ke bawah:
1. Bar Study Time.
2. Hero Banner: gradien lembut biru → teal tua, satu tombol "Mulai Belajar", ilustrasi Mesin Fungsi yang **diam**.
3. Batang progres (angka + batang statis).
4. Grid kartu modul 01–07: ikon biru = siap dipelajari, hijau = selesai, status juga ditulis dengan teks.
5. Kartu "Sudah siap mencoba tes literasi?".

Logo memakai tanda **f(x)**, bukan huruf "f" polos, agar tidak mirip merek lain dan langsung menunjukkan isi aplikasi.

**Study Time (opsional).** Melodi instrumental ceria lembut dibangkitkan dengan Web Audio API: nada pentatonis, tempo sedang, volume rendah, tanpa lirik, tanpa file audio. Aturannya:
- **mati secara bawaan**, dan setiap sesi mulai dalam keadaan mati;
- hanya berbunyi bila siswa menekan Putar;
- **dijeda otomatis saat layar fokus dibuka**.

Alasannya, musik latar berisiko menambah *extraneous load* (prinsip koherensi Mayer). Pengaruhnya perlu diamati saat uji coba.

## 8. Aksesibilitas
- Kontras AA dan target sentuh ≥ 48 px.
- Status tidak hanya ditunjukkan dengan warna, selalu disertai ikon/teks.
- Alternatif teks untuk diagram & 3D.
