# Contoh Materi Aplikasi FungsiKu
## Modul M1 — Relasi atau Fungsi?

| Komponen | Keterangan |
|---|---|
| Tujuan Pembelajaran | TP1. Siswa membedakan relasi yang merupakan fungsi dan yang bukan fungsi berdasarkan syarat fungsi. |
| Indikator | 1.1 – 1.4 (lihat [kisi-kisi-materi.md](kisi-kisi-materi.md)) |
| Temuan dasar | IL01, GL01, GL03, GL04, DS01, DS03, EL03 |
| Durasi | ± 15–20 menit, belajar mandiri di HP |
| Pola | 8 langkah tetap: Analogi → Konsep → Simulasi → Contoh lengkap → Contoh rumpang → Latihan → Jelaskan → Refleksi |

Keterangan: setiap kotak di bawah adalah **satu layar** di aplikasi. Siswa berpindah layar dengan tombol **Lanjut**.

---

## ① Analogi Nyata
> **Layar 1**
> Di kelasmu, setiap siswa punya **tepat satu** nomor absen.
> Tidak ada siswa yang punya dua nomor absen.
> Tidak ada siswa yang tidak punya nomor absen.
>
> *[Gambar sederhana: 3 siswa → panah → nomor 1, 2, 3]*

## ② Kartu Konsep
> **Layar 2 — Relasi**
> **Relasi** adalah aturan yang memasangkan anggota himpunan A dengan anggota himpunan B.
> Pasangan digambar dengan **panah**.

> **Layar 3 — Fungsi**
> **Fungsi** adalah relasi khusus.
> Syaratnya: **setiap** anggota A punya **tepat satu** pasangan di B.

> **Layar 4 — Dua cara gagal jadi fungsi**
> ✗ Ada anggota A yang punya **dua** pasangan atau lebih.
> ✗ Ada anggota A yang **tidak punya** pasangan.
>
> *[Dua diagram kecil berdampingan, anggota bermasalah diberi tanda ⚠️ dan label di sampingnya]*

> **Layar 5 — Yang boleh**
> ✓ Dua anggota A **boleh** berpasangan dengan anggota B yang sama.
> ✓ Anggota B **boleh** tidak punya pasangan.
>
> *[Diagram: 1→a, 2→a, 3→b; c tanpa panah. Label: "Ini tetap fungsi"]*

## ③ Simulasi Tarik Garis (F5)
> **Layar 6**
> A = {1, 2, 3}, B = {a, b, c, d}.
> Tarik panah dari A ke B. Lihat tanda di kanan.
>
> *[Diagram interaktif. Saat siswa menarik panah, penanda berubah langsung:]*
> - Belum lengkap → "⚠️ 3 belum punya pasangan."
> - 2 dipasangkan ke b dan c → "✗ Bukan fungsi. 2 punya dua pasangan."
> - Lengkap & tepat satu → "✓ Fungsi! Setiap anggota A punya tepat satu pasangan."

> **Layar 7 — Contoh dan bukan contoh**
> Kedua diagram ini hanya beda **satu panah**. Ketuk panah yang berbeda.
>
> | Diagram X (fungsi) | Diagram Y (bukan fungsi) |
> |---|---|
> | 1→a, 2→b, 3→d | 1→a, 2→b, **2→c**, 3→d |
>
> Umpan balik setelah diketuk: "Tepat. Panah 2→c membuat 2 punya dua pasangan."

## ④ Contoh Lengkap (*worked example*)
> **Layar 8** — langkah muncul satu per satu saat diketuk.
> **Soal:** A = {1, 2, 3, 4}, B = {p, q, r}. Relasi: 1→p, 2→q, 3→q, 4→r. Fungsi atau bukan?
> **Langkah 1.** Periksa setiap anggota A satu per satu.
> **Langkah 2.** 1 → p (satu) ✓ · 2 → q (satu) ✓ · 3 → q (satu) ✓ · 4 → r (satu) ✓
> **Langkah 3.** Semua anggota A punya tepat satu pasangan.
> **Kesimpulan.** Relasi ini **fungsi**. 2 dan 3 sama-sama ke q, dan itu boleh.

## ⑤ Contoh Rumpang (*faded example*)
> **Layar 9**
> **Soal:** A = {1, 2, 3}, B = {a, b, c}. Relasi: 1→a, 1→b, 3→c.
> **Langkah 1.** Periksa setiap anggota A.
> **Langkah 2.** 1 → a dan b, jadi punya **[ ___ ]** pasangan. *(isian: 2)*
> 2 → **[ ___ ]** *(pilihan: a / b / c / tidak ada → "tidak ada")*
> **Kesimpulan.** **[ Fungsi / Bukan fungsi ]**, karena **[ ___ ]**.
> *(pilihan alasan: "1 punya dua pasangan dan 2 tidak punya pasangan")*

## ⑥ Latihan
Setiap soal punya **3 tingkat petunjuk** (dibuka hanya bila diminta) dan **umpan balik penyebab salah**.

### Soal L1 — Menilai diagram (Indikator 1.2)
A = {1, 2, 3}, B = {a, b, c}. Relasi: 1→a, 2→a, 3→b. Fungsi atau bukan?
- **Kunci:** Fungsi.
- 💡 Hint 1: Periksa anggota A satu per satu.
- 💡 Hint 2: Berapa pasangan yang dimiliki 1? 2? 3?
- 💡 Hint 3: Ingat Layar 5. Dua anggota A boleh ke anggota B yang sama.
- Umpan balik bila menjawab "bukan fungsi": "Hati-hati! 1 dan 2 sama-sama ke a. Itu **boleh**. Yang dilarang adalah satu anggota A punya dua pasangan."

### Soal L2 — Menilai diagram (Indikator 1.2)
A = {1, 2, 3, 4}, B = {p, q, r}. Relasi: 1→p, 2→q, 4→r. Fungsi atau bukan?
- **Kunci:** Bukan fungsi (3 tidak punya pasangan).
- 💡 Hint 1: Apakah semua anggota A sudah punya panah?
- 💡 Hint 2: Lihat angka 3.
- 💡 Hint 3: Syarat fungsi: **setiap** anggota A harus punya pasangan.
- Umpan balik bila menjawab "fungsi": "Coba cari angka 3. Belum ada panah dari 3, jadi syarat 'setiap anggota A' tidak terpenuhi."

### Soal L3 — Buat Diagramku (Indikator 1.3)
A = {1, 2, 3}, B = {a, b}. Buatlah relasi yang **bukan fungsi** karena **satu anggota A punya dua pasangan**. Semua anggota A lain harus punya tepat satu pasangan.
- **Penilaian otomatis:** tepat satu anggota A punya 2 pasangan dan tidak ada anggota A tanpa pasangan.
- Contoh jawaban benar: 1→a, 1→b, 2→a, 3→b.

### Soal L4 — Konteks sehari-hari (Indikator 1.4, literasi: menafsirkan)
Manakah relasi berikut yang merupakan **fungsi**?
- (a) Setiap siswa → golongan darahnya
- (b) Setiap siswa → hobinya
- **Kunci:** (a) fungsi, karena setiap orang punya tepat satu golongan darah. (b) belum tentu fungsi, karena satu siswa bisa punya lebih dari satu hobi.
- 💡 Hint 1: Bayangkan satu siswa. Berapa golongan darah yang ia punya?
- 💡 Hint 2: Apakah seseorang bisa punya dua hobi?
- 💡 Hint 3: Fungsi = setiap anggota punya **tepat satu** pasangan.

## ⑦ Jelaskan ke Temanmu (F14)
> **Layar akhir latihan**
> Temanmu bingung dengan Soal L2. Pilih penjelasan terbaik:
> - (a) Bukan fungsi, karena ada anggota B yang tidak punya pasangan.
> - (b) **Bukan fungsi, karena 3 di A tidak punya pasangan.** ✓
> - (c) Fungsi, karena semua panah menuju anggota B yang berbeda.
> - (d) Bukan fungsi, karena banyak anggota A dan B tidak sama.
>
> ✏️ *Tambahkan kalimatmu sendiri (boleh dikosongkan):* [____________]

Pilihan (a), (c), dan (d) sengaja mewakili miskonsepsi yang umum. Pilihan siswa dicatat untuk analisis.

## ⑧ Refleksi
> **Seberapa berat usahamu belajar bagian ini?**
> 1 2 3 4 5 6 7 8 9
> *(1 = sangat ringan, 9 = sangat berat)*
>
> - Rating ≥ 7 → aplikasi menawarkan contoh tambahan.
> - Rating ≤ 3 dan semua latihan benar tanpa hint → modul berikutnya boleh dikerjakan langsung.

## Ringkasan (layar penutup)
> ✓ Fungsi: **setiap** anggota A punya **tepat satu** pasangan.
> ✗ Bukan fungsi: ada anggota A dengan dua pasangan, atau tanpa pasangan.
> ✓ Boleh: dua anggota A ke anggota B yang sama.
> 🏅 Lencana: **Penjaga Syarat Fungsi**

---

### Lampiran: Contoh Soal Literasi M7 (gambaran tingkat lanjut)
**Tarif ojek:** Rp5.000 saat naik, lalu Rp2.000 per km. Rani akan naik sejauh 6 km. Uangnya Rp20.000. Cukupkah?
| Langkah | Proses literasi | Jawaban yang diharapkan |
|---|---|---|
| ① Pahami | — | Menandai: Rp5.000, Rp2.000 per km, 6 km, Rp20.000 |
| ② Rumuskan | Merumuskan | f(x) = 2.000x + 5.000 (x = jarak dalam km) |
| ③ Hitung | Menerapkan | f(6) = 2.000 × 6 + 5.000 = 17.000 |
| ④ Tafsirkan | Menafsirkan | **Cukup**, sisa Rp3.000 |
