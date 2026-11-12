# Kisi-Kisi Materi Aplikasi FungsiKu
**Pemetaan Fungsi — Matematika SMP Kelas VIII**

| Komponen | Keterangan |
|---|---|
| Mata kuliah | Algoritma dan Pemrograman |
| Produk | FungsiKu: aplikasi Android (PWA) dengan pengelolaan *cognitive load* |
| Model pengembangan | ADDIE (luaran tahap Analysis → Design) |
| Kurikulum | Kurikulum Merdeka, **Fase D**, elemen **Aljabar** |
| Topik | Relasi dan Fungsi (Pemetaan) |
| Sasaran | Siswa kelas VIII; uji coba kelompok kecil 3 siswa |
| Kemampuan sasaran | **Literasi Matematis**, 4 indikator: *Mathematical Reasoning*, *Formulating*, *Employing*, *Interpreting & Evaluating* |
| Dasar analisis kebutuhan | Wawancara mendalam informan S01, 4 November 2026 (kode temuan K, IL, EL, GL, DS) |

---

## A. Capaian Pembelajaran (Fase D, Aljabar, bagian yang relevan)
> Peserta didik dapat memahami relasi dan fungsi (domain, kodomain, range) dan menyajikannya dalam bentuk diagram panah, tabel, himpunan pasangan berurutan, dan grafik.

## B. Ringkasan Temuan Wawancara yang Mendasari Materi
| Kode | Temuan | Dampak pada penyajian materi |
|---|---|---|
| IL01 | Sulit membedakan relasi dan fungsi bila anggota domain punya 2 pasangan atau tidak berpasangan | Syarat fungsi diajarkan lewat contoh–bukan contoh yang hanya berbeda satu panah |
| IL03 | Prasyarat: himpunan, relasi, aljabar dasar | Ada modul diagnostik M0 |
| IL04, EL04 | Kesulitan naik saat berpindah dari diagram ke rumus | Jembatan representasi bertahap (M4) |
| IL05 | Keliru tanda +/− saat substitusi | Penanda tanda pada substitusi (M5) |
| F-2 | Bingung mencari rumus dari dua nilai fungsi | Strategi tabel/perubahan sebelum eliminasi (M6) |
| K03 | Ragu menentukan banyaknya pemetaan | Modul khusus M3 |
| EL01, EL05, DS03 | Soal panjang, pengecoh, dan teks menumpuk membingungkan | Kalimat ≤ 20 kata, ≤ 3 kalimat per layar, langkah "Pahami" |
| GL01–GL05 | Membuat diagram sendiri, uji balik, petunjuk bertahap, menjelaskan, dan mengenali pola membantu | Aktivitas konstruksi, Cek Balik, hint 3 tingkat, "Jelaskan ke Temanmu", soal berstruktur sama |

## C. Kisi-Kisi Materi
Keterangan:
- **Proses literasi:** R = *reasoning* (bernalar), F = *formulating* (merumuskan), E = *employing* (menerapkan), I = *interpreting & evaluating* (menafsirkan).
- **Level kognitif:** C1–C6 (Taksonomi Bloom revisi).

| Modul | Tujuan Pembelajaran (TP) | Indikator Pencapaian | Proses literasi | Level | Temuan dasar | Aktivitas di aplikasi | Bentuk latihan |
|---|---|---|---|---|---|---|---|
| **M0 Cek Bekal** | TP0. Siswa mengingat kembali himpunan dan operasi bilangan bulat sebagai prasyarat fungsi. | 0.1 Menyebutkan anggota himpunan dari notasi {…}. 0.2 Menghitung perkalian & penjumlahan bilangan bulat negatif dengan tepat. | E | C1–C3 | IL03, IL05 | Diagnostik 6 soal; jalur penguatan bila skor < 70% | PG, isian angka |
| **M1 Relasi atau Fungsi?** | TP1. Siswa membedakan relasi yang merupakan fungsi dan yang bukan fungsi berdasarkan syarat fungsi. | 1.1 Menyatakan syarat fungsi: setiap anggota domain tepat satu pasangan. 1.2 Menentukan suatu diagram panah fungsi atau bukan disertai alasan. 1.3 Membuat contoh fungsi dan bukan fungsi. 1.4 Menentukan apakah relasi dalam konteks sehari-hari merupakan fungsi. | F, I | C2–C6 | IL01, GL01, DS01 | Simulasi Tarik Garis, pasangan contoh–bukan contoh, Buat Diagramku | Diagram interaktif, PG beralasan |
| **M2 Domain, Kodomain, Range** | TP2. Siswa menentukan domain, kodomain, dan range suatu fungsi. | 2.1 Menentukan domain & kodomain dari diagram. 2.2 Menentukan range sebagai anggota kodomain yang mendapat pasangan. 2.3 Menjelaskan beda kodomain dan range. | E | C2–C3 | IL02, IL03 | Ketuk untuk menyorot himpunan; warna semantik tetap | Ketuk-pilih, isian himpunan |
| **M3 Banyaknya Pemetaan** *(setelah MVP)* | TP3. Siswa menentukan banyaknya pemetaan dan korespondensi satu-satu. | 3.1 Mendaftar semua pemetaan dari himpunan kecil (2 → 2, 2 → 3). 3.2 Menemukan pola n(B)^n(A). 3.3 Menentukan banyaknya korespondensi satu-satu (n!). | F, E | C3–C4 | K03 | Bangun semua pemetaan kecil, lalu temukan polanya | Isian angka, PG |
| **M4 Jembatan Representasi** | TP4. Siswa menyajikan fungsi dalam diagram panah, pasangan berurutan, tabel, rumus, dan grafik, serta menghubungkan antarbentuk. | 4.1 Mengubah diagram panah menjadi pasangan berurutan. 4.2 Menyusun tabel dari pasangan berurutan. 4.3 Mengenali pola selisih pada tabel. 4.4 Menggambar titik fungsi pada bidang koordinat. | F, E | C2–C4 | IL04, EL02, EL04 | Satu data dalam 6 tahap; 3D "Panah jadi Titik" | Seret-lepas, isian tabel, plot titik |
| **M5 Nilai Fungsi** | TP5. Siswa menghitung nilai fungsi f(x) = ax + b untuk x bilangan bulat. | 5.1 Mensubstitusi x ke rumus dengan tanda kurung untuk bilangan negatif. 5.2 Menghitung f(a) dengan tepat. 5.3 Menentukan x bila f(x) diketahui. | E | C3 | IL05, DS02 | Penanda Tanda, cek per langkah, Mesin Fungsi 3D | Isian bertahap |
| **M6 Menyusun Rumus Fungsi** | TP6. Siswa menentukan rumus fungsi linear dari tabel atau dari dua nilai fungsi. | 6.1 Menentukan a dari perbandingan perubahan f(x) terhadap perubahan x. 6.2 Menentukan b dengan substitusi satu titik. 6.3 Memeriksa rumus dengan uji balik. | F, E | C3–C4 | F-2, IL04, GL02 | Strategi tabel, Cek Balik, cara eliminasi sebagai "cara lain" | Isian rumus (bentuk setara diterima) |
| **M7 Fungsi di Sekitarku** | TP7. Siswa memodelkan dan menyelesaikan masalah kontekstual dengan fungsi linear, lalu menafsirkan hasilnya. | 7.1 Mengidentifikasi informasi penting & mengabaikan pengecoh. 7.2 Merumuskan fungsi dari konteks. 7.3 Menghitung nilai fungsi. 7.4 Menafsirkan hasil terhadap konteks (cukup/tidak, lebih murah/mahal). | R, F, E, I | C3–C5 | EL01, EL05, GL05 | Soal 4 langkah: Pahami → Rumuskan → Hitung → Tafsirkan; "Pola Sama" | Soal cerita bertahap + alasan |

## D. Urutan dan Alokasi Belajar (usulan)
| Sesi | Tempat | Isi | Durasi |
|---|---|---|---|
| 1 | Kelas | Login, pretest, M0 Cek Bekal | 40 menit |
| 2 | Rumah | M1, M2 | 2 × 15–20 menit |
| 3 | Rumah | M4, M5 | 2 × 15–20 menit |
| 4 | Rumah | M6, M7 | 2 × 15–20 menit |
| 5 | Kelas | Posttest, SUS, wawancara singkat | 40 menit |

## E. Prinsip Penyajian Materi (Cognitive Load)
| Jenis beban | Prinsip | Wujud dalam materi |
|---|---|---|
| Intrinsic (dikelola) | Prasyarat, segmentasi, urutan sederhana → kompleks | M0; 1 ide per layar; diagram dahulu, rumus kemudian |
| Extraneous (dikurangi) | Koherensi, *signaling*, tanpa *split-attention* | Kalimat ≤ 20 kata; warna hanya untuk makna; label di dekat objek; tanpa animasi otomatis |
| Germane (didorong) | *Worked example* → *fading*, self-explanation, variasi konteks | Contoh lengkap → rumpang → mandiri; "Jelaskan ke Temanmu"; soal berstruktur sama |

## F. Usulan Indikator Literasi untuk Penyusunan Kisi-Kisi Soal
Bagian ini sebagai bahan bagi Bapak dalam menyusun kisi-kisi soal pretest/posttest.
| Proses literasi | Indikator | Contoh konteks |
|---|---|---|
| Bernalar (R) | Membandingkan dua fungsi/alternatif dan memberi alasan keputusan | Dua tarif sewa, dua paket harga |
| Merumuskan (F) | Mengubah situasi nyata menjadi relasi/fungsi (diagram, tabel, atau rumus) | Tarif ojek, biaya parkir, isi ulang galon |
| Menerapkan (E) | Menghitung nilai fungsi, menentukan domain/range, menyusun rumus dari data | Tabel harga per jumlah barang |
| Menafsirkan (I) | Menilai kewajaran hasil dalam konteks, membandingkan dua pilihan, menentukan apakah relasi nyata termasuk fungsi | "Cukupkah uangnya?", "Paket mana yang lebih hemat?" |

Contoh materi lengkap untuk satu sub-materi tersedia di [contoh-materi-M1.md](contoh-materi-M1.md).
