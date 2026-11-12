# PRD — FungsiKu
**Aplikasi Android (PWA) untuk Belajar Pemetaan Fungsi Siswa SMP Kelas VIII, Dirancang dengan Pengelolaan Cognitive Load untuk Meningkatkan Literasi Matematis**

| Item | Keterangan |
|---|---|
| Versi dokumen | 0.2 |
| Tanggal | 12 November 2026 |
| Model pengembangan | ADDIE. Dokumen ini adalah luaran tahap **Analysis**, menjadi masukan tahap **Design** |
| Dasar data | Wawancara mendalam semiterstruktur dengan informan **S01** (kelas IX, sudah mempelajari pemetaan fungsi), 4 November 2026, 45 menit, daring |
| Status | Draf: menunggu interview lanjutan dengan pemilik proyek |

> **Etika data:** dokumen dan repositori hanya memakai kode informan (S01). Nama siswa dan foto wawancara **tidak boleh** dimasukkan ke repositori maupun prompt AI.

---

## 1. Latar Belakang
Pemetaan fungsi adalah titik peralihan siswa SMP dari representasi visual (diagram panah) ke representasi simbolik (f(x) = ax + b). Hasil wawancara S01 menunjukkan tiga sumber kesulitan utama:
1. Membedakan **relasi biasa dan fungsi**, terutama ketika ada anggota domain yang punya dua pasangan atau tidak punya pasangan.
2. **Peralihan dari diagram ke rumus** yang dirasa terlalu cepat.
3. **Kekeliruan tanda positif/negatif** saat substitusi.

Selain itu, kalimat soal yang panjang, informasi pengecoh, animasi ramai, dan warna mencolok menambah beban yang tidak perlu.

Berdasarkan **Cognitive Load Theory** (Sweller; Paas, 1992; Leppink dkk., 2013; Klepsch dkk., 2017), aplikasi dirancang untuk:
- **mengelola intrinsic load** (prasyarat, segmentasi, jembatan representasi),
- **menekan extraneous load** (bahasa ringkas, tampilan minimalis, penanda informasi penting),
- **mendorong germane load** (membuat diagram sendiri, uji balik, petunjuk bertahap, pertanyaan "mengapa?", variasi konteks).

Kemampuan sasaran adalah **Literasi Matematis**, diukur dengan 4 indikator sesuai instrumen dari Pak Aan: **Mathematical Reasoning**, **Formulating** (merumuskan), **Employing** (menerapkan), dan **Interpreting & Evaluating** (menafsirkan), mengacu pada kerangka PISA.

## 2. Tujuan Produk
| Kode | Tujuan | Indikator keberhasilan |
|---|---|---|
| G1 | Literasi matematis meningkat pada materi pemetaan fungsi | N-Gain tiap siswa (n = 3) ≥ 0,3 (sedang), dilaporkan deskriptif per proses literasi |
| G2 | Beban kognitif terkelola | Rata-rata *mental effort* (skala Paas 1–9) ≤ 5 per sub-materi |
| G3 | Siswa mampu membedakan fungsi/bukan fungsi beserta alasannya | ≥ 80% benar pada soal diagram baru disertai alasan yang tepat |
| G4 | Siswa mampu menyusun rumus fungsi dari tabel atau dua nilai | ≥ 70% benar tanpa petunjuk langsung |
| G5 | Kesalahan tanda saat substitusi berkurang | Jumlah kesalahan tanda menurun dari latihan awal ke latihan akhir |
| G6 | Mudah dipakai di HP Android | Skor SUS ≥ 68 |

## 3. Peta Temuan Wawancara → Kebutuhan Desain
Bagian ini adalah inti dokumen. Setiap fitur pada §6 harus punya bukti di tabel ini.

### 3.1 Intrinsic Load (kerumitan materi)
| Kode | Temuan S01 | Kebutuhan desain |
|---|---|---|
| K03 | Diagram panah sederhana langsung dikenali; ragu saat menentukan **banyaknya pemetaan** | Sub-materi khusus banyaknya pemetaan, dibangun dari diagram kecil (2×2, 2×3) |
| IL01 | Sulit membedakan relasi dan fungsi bila anggota domain **punya 2 pasangan atau tidak berpasangan** | Simulasi tarik garis dengan penanda otomatis "fungsi / bukan fungsi" + alasan; pasangan contoh–bukan contoh |
| IL02 | Urutan langkah domain → aturan → bayangan sudah diingat, tetapi ada istilah yang tertukar | Langkah dengan label tetap dan warna semantik per istilah |
| IL03 | Prasyarat: himpunan, relasi, aljabar dasar. Istilah domain/kodomain/range sudah bisa dibedakan | Diagnostik prasyarat di awal → jalur adaptif |
| IL04 | Kesulitan naik dari **diagram visual ke mencari rumus fungsi** | Jembatan representasi: diagram → pasangan berurut → tabel → pola → rumus (1 tahap per layar) |
| IL05 | Sering keliru **tanda +/−** saat substitusi | Latihan substitusi berjenjang dengan penanda tanda dan umpan balik per langkah |
| F-2 | Bingung pada langkah eliminasi/substitusi saat mencari rumus dari f(2)=5 dan f(−1)=−4 | Strategi "perubahan x → perubahan f(x)" berbasis tabel sebelum cara aljabar |

### 3.2 Extraneous Load (cara penyajian)
| Kode | Temuan S01 | Kebutuhan desain |
|---|---|---|
| EL01 | Konsep paham, tetapi bingung karena **kalimat soal panjang dan berbelit** | Kalimat ≤ 20 kata, satu informasi per kalimat |
| EL02 | Gambar & tabel membantu; teks menuntut ketelitian ekstra; analogi dunia nyata membantu | Utamakan visual & tabel; setiap konsep dibuka dengan analogi nyata |
| EL03 | **Animasi ramai & warna mencolok** mengganggu | Tampilan minimalis; animasi hanya bila diminta siswa; warna hanya untuk makna |
| EL04 | Guru melompat terlalu cepat dari visual ke rumus (meski tempo umum pelan) | Siswa mengatur tempo sendiri; tahap transisi dapat diulang |
| EL05 | Terjebak **kalimat pengecoh / informasi tidak penting** | Alat "tandai info penting" dan langkah "Pahami" dalam soal cerita |
| DS03 | Jangan ada **teks teori panjang menumpuk di satu layar** | Maksimal 3 kalimat per kartu |

### 3.3 Germane Load (membangun pemahaman)
| Kode | Temuan S01 | Kebutuhan desain |
|---|---|---|
| GL01 | **Simulasi langsung / membuat diagram panah sendiri** paling membantu; fungsi terlihat dari arah panah | Mode "Buat Diagramku" |
| GL02 | Melakukan **uji balik**; latihan mandiri untuk tahu letak kesalahan | Tombol "Cek Balik" (substitusi otomatis ke rumus siswa) |
| GL03 | **Petunjuk bertahap** dan pembahasan alasan kesalahan membantu | Hint 3 tingkat yang memudar (*fading*) + umpan balik penyebab salah |
| GL04 | **Menjelaskan ke orang lain** membuat pemahaman melekat | Prompt "Jelaskan ke temanmu" (isian singkat / pilih alasan) |
| GL05 | Menemukan **pola/struktur yang sama** membantu soal baru | Soal berstruktur sama dengan konteks berbeda + label "pola sama" |
| DS01 | Butuh **simulasi tarik garis antarhimpunan** dan latihan bertahap | Fitur inti F5 |
| DS02 | Konsep dasar & transisi ke rumus dijelaskan perlahan; latihan hitung & menyusun rumus dicoba sendiri; **koreksi mandiri** penting | Mode terpandu vs mandiri; umpan balik instan |

### 3.4 Faktor Pendukung & Keterbatasan
- **Kondisi belajar:** sebelumnya hanya memakai buku, papan tulis, dan latihan (K02), belum terbiasa dengan media digital. Karena itu onboarding harus sangat sederhana.
- **Kepercayaan diri:** masih ragu pada beberapa contoh (K03, IL01). Umpan balik dibuat suportif, tidak menghakimi.
- **Motivasi:** belum digali. Perlu ditanyakan di wawancara tambahan.
- **Keterbatasan:** temuan berasal dari **satu informan**, sehingga belum dapat digeneralisasi. Perlu informan tambahan, triangulasi, atau uji fitur.
- **Hal yang perlu dikonfirmasi:**
  - S01 menyebut belajar di kelas 9, padahal materi ini kelas VIII (K01).
  - Pernyataan EL04 tampak berbeda (transisi cepat vs tempo pelan).
  - Kesalahan tanda (IL05) tidak muncul pada tugas pemicu.

## 4. Pengguna
**Peran tunggal: siswa SMP kelas VIII** (data kebutuhan diambil dari siswa kelas IX yang merefleksikan pengalamannya).

Persona **"S-08"**:
- Belajar dari buku dan papan tulis, belum terbiasa belajar lewat aplikasi.
- Memakai HP Android dengan kuota terbatas.
- Bisa memahami diagram panah, tetapi ragu membedakan fungsi dari relasi biasa.
- Cepat bingung oleh soal cerita panjang dan rawan salah tanda negatif.

**Konteks pemakaian (interview pemilik proyek): campuran.**
| Tempat | Kegiatan | Implikasi |
|---|---|---|
| Kelas, didampingi guru/peneliti | Login pertama, Cek Bekal, **pretest**, **posttest**, SUS | Wajib online; sesi terjadwal; guru membagikan kode siswa di kelas |
| Rumah, mandiri (akses internet **belum diketahui**, jadi dirancang untuk kondisi terburuk: tanpa internet) | Belajar modul & latihan | Kuota terbatas, sehingga **mode offline** dan unduh konten sekali saat di kelas sangat penting; tanpa bantuan guru, maka hint & umpan balik harus cukup jelas |

> Guru/peneliti tidak memiliki antarmuka di MVP. Kode siswa & konten dikelola lewat dashboard Supabase / skrip seed.

## 5. Ruang Lingkup Materi
Kurikulum Merdeka **Fase D**, elemen **Aljabar**, topik **Relasi dan Fungsi** (kelas VIII).

| Modul | Isi | Temuan acuan |
|---|---|---|
| M0 Cek Bekal | Diagnostik himpunan, relasi, operasi bilangan bulat (tanda) | IL03, IL05 |
| M1 Relasi atau Fungsi? | Syarat fungsi: tiap anggota domain **tepat satu** pasangan. Simulasi tarik garis | IL01, GL01, DS01 |
| M2 Domain, Kodomain, Range | Menyorot ketiga himpunan pada diagram | IL02, IL03 |
| M3 Banyaknya Pemetaan | n(B)^n(A); korespondensi satu-satu | K03 |
| M4 Jembatan Representasi | Diagram panah → pasangan berurut → tabel → pola → rumus → grafik | IL04, EL04 |
| M5 Nilai Fungsi | Substitusi f(a) dengan penanda tanda | IL05 |
| M6 Menyusun Rumus Fungsi | Dari tabel, lalu dari dua nilai (mis. f(2)=5, f(−1)=−4) | F-2, DS02 |
| M7 Fungsi di Sekitarku | Soal literasi konteks: tarif ojek/taksi, parkir, pulsa, suhu | Literasi, GL05 |

**MVP = M0–M2, M4–M6** dan 1 sub-materi M7. M3 menyusul.

## 6. Fitur
### 6.1 Fitur MVP
| ID | Fitur | Deskripsi | Bukti | Prinsip CLT |
|---|---|---|---|---|
| F1 | Login kode siswa | Kode unik (mis. `FK-8A-K3P9`), tanpa email/password | — | Hambatan awal minimal |
| F2 | Pretest literasi | 5 soal uraian konteks (format Pak Aan + soal syarat fungsi, maks skor 30), posttest paralel. Tahap 1: dikerjakan di kertas; aplikasi menyediakan lembar jawaban per tahap. Skor diperiksa peneliti dengan rubrik | — | Baseline |
| F3 | Cek Bekal + jalur adaptif | Bila prasyarat lemah, siswa diarahkan ke penguatan sebelum M1 | IL03, IL05 | Kelola intrinsic |
| F4 | Kartu konsep tersegmentasi | 1 ide per layar, ≤ 3 kalimat, tempo dikendalikan siswa | DS03, EL01, EL04 | Segmenting, coherence |
| F5 | **Simulasi Tarik Garis** | Siswa menarik panah A→B. Penanda otomatis "Fungsi ✓ / Bukan fungsi ✗" beserta alasannya, mis. "2 punya dua pasangan" atau "3 belum punya pasangan" | IL01, GL01, DS01 | Germane, signaling |
| F6 | **Buat Diagramku** | Siswa membuat sendiri contoh fungsi & bukan fungsi sesuai tantangan | GL01, GL04 | Generative activity |
| F7 | **Jembatan Representasi** | Satu data ditampilkan bertahap: diagram → pasangan berurut → tabel → pola selisih → rumus → grafik. Unsur yang sama diberi warna yang sama di setiap tahap | IL04, EL04, EL02 | Mengurangi lompatan |
| F8 | **Penanda Tanda** | Saat substitusi, bilangan negatif otomatis diberi kurung dan warna khusus; umpan balik per langkah | IL05 | Worked example |
| F9 | Contoh bertahap | Worked → faded → mandiri | DS02, GL03 | Worked example, fading |
| F10 | Petunjuk 3 tingkat | Hint 1 arah → Hint 2 langkah → Hint 3 contoh mirip | GL03 | Bantuan sesuai kebutuhan |
| F11 | Umpan balik penyebab salah | Menjelaskan *mengapa* salah, bukan hanya benar/salah | GL03, DS02 | Koreksi mandiri |
| F12 | **Cek Balik** | Setelah menemukan rumus, siswa memasukkan x untuk memeriksa apakah hasilnya cocok dengan tabel | GL02 | Self-monitoring |
| F13 | Soal literasi 4 langkah | Pahami (tandai info penting) → Rumuskan → Hitung → Tafsirkan | EL05, literasi | Segmenting, signaling |
| F14 | "Jelaskan ke Temanmu" | Setelah soal, siswa **memilih alasan** (3–4 opsi, dinilai otomatis), lalu **boleh menambah kalimat sendiri** (opsional) | GL04 | Self-explanation |
| F15 | "Pola Sama" | Dua soal konteks berbeda dengan struktur sama ditampilkan berdampingan | GL05 | Transfer |
| F16 | Rating beban kognitif | Skala 1–9 setelah tiap sub-materi | — | Pengukuran CLT |
| F17 | Mesin Fungsi 3D (Three.js) | Ilustrasi pelengkap: bola x masuk mesin "×2 lalu −3" dan keluar f(x). Hanya bergerak saat diketuk | EL02, IL04 | Visual tenang |
| F18 | Posttest & progres | Posttest paralel; bintang & riwayat sederhana | — | Ukur peningkatan |
| F19 | PWA + offline | Dapat dipasang di layar utama Android; konten tercache | — | Hemat kuota |

### 6.2 Setelah MVP
- M3 Banyaknya Pemetaan
- Narasi audio singkat
- Dashboard guru
- APK via Capacitor
- Analisis jawaban "jelaskan" dengan kata kunci

### 6.3 Di Luar Lingkup
Chat, papan peringkat publik, iklan, pembayaran, serta data pribadi selain nama panggilan & kelas.

## 7. Alur Pengguna
```
Masuk dengan kode → Pretest (sekali) → Cek Bekal
  ├─ prasyarat lemah → Penguatan (himpunan / tanda bilangan bulat)
  └─ siap → Peta Modul
Sub-materi: Analogi nyata → Kartu konsep → Simulasi / 3D → Contoh lengkap
          → Contoh rumpang → Latihan (hint, umpan balik, Cek Balik)
          → Jelaskan ke Temanmu → Rating beban → Ringkasan
Semua modul MVP selesai → Posttest → Lihat perkembangan
```

## 8. Kebutuhan Non-Fungsional
| Aspek | Target |
|---|---|
| Perangkat | Android 9+, Chrome 90+, layar ≥ 360×640 px. HP siswa **campuran** (RAM 2 GB s.d. ≥ 4 GB), jadi target minimum RAM 2 GB dengan mode 3D ringan otomatis |
| Performa | First load < 3 dtk (4G); Three.js di-*lazy load*; adegan 3D ≥ 30 fps |
| Bahasa | Bahasa Indonesia baku, ramah anak, kalimat ≤ 20 kata |
| Visual | Maksimal 4 warna semantik; tidak ada animasi otomatis/dekoratif (EL03) |
| Aksesibilitas | Kontras WCAG AA, target sentuh ≥ 48 px, huruf ≥ 16 px |
| Privasi | Tanpa email/no. HP; RLS Supabase; tanpa nama asli di log |
| Ketersediaan | Hosting gratis ±2 bulan |

## 9. Evaluasi (tahap Implementation & Evaluation ADDIE)
**Peserta uji coba: 3 siswa kelas VIII** (ketentuan tugas, hasil interview pemilik proyek). Implikasinya:
- Uji coba bersifat **kelompok kecil** (*small group*, evaluasi formatif). Hasilnya dipakai untuk merevisi aplikasi, bukan untuk menggeneralisasi.
- N-Gain dilaporkan **per siswa** (P01–P03) dan dianalisis **secara deskriptif**, tanpa uji statistik inferensial.
- Data kualitatif menjadi lebih penting:
  - pengamatan *think-aloud* saat siswa memakai aplikasi,
  - wawancara singkat setelah pemakaian,
  - log aplikasi (jenis kesalahan, hint, waktu).
- Kode siswa cukup 3 buah, ditambah 1–2 kode cadangan untuk uji coba oleh pengembang dan dosen.

| Variabel | Instrumen | Analisis |
|---|---|---|
| Literasi matematis | Pretest–posttest paralel 5 soal uraian (Reasoning ×2, Formulating, Employing, Interpreting), skor per tahap, maks 30 (lihat docs/kisi-kisi-soal-literasi.md) | N-Gain total & per indikator |
| Cognitive load | Skala Paas 1–9 per sub-materi; opsional kuesioner Klepsch dkk. (2017) untuk IL/EL/GL | Deskriptif per sub-materi |
| Indikator fitur (matriks H wawancara) | Log aplikasi: ketepatan fungsi/bukan + alasan, rumus tanpa hint, jumlah kesalahan tanda, bantuan yang dipakai | Bandingkan awal vs akhir |
| Kegunaan | SUS + wawancara kejelasan tampilan | Skor SUS |

## 10. Risiko
| Risiko | Mitigasi |
|---|---|
| Temuan hanya dari 1 informan | Uji keterbacaan dengan 1–2 siswa lain; wawancara tambahan |
| Server gratis tidur (cold start) | Layar tunggu ramah; konten tercache di PWA |
| Supabase free di-*pause* bila 7 hari tidak aktif | Ping harian selama penelitian |
| Tarik garis sulit di layar kecil | Mode alternatif: ketuk anggota A, lalu ketuk anggota B |
| Ilustrasi 3D justru menambah beban | 3D hanya sebagai pelengkap, statis sampai diketuk, dapat dimatikan |
