# Ringkasan Model RMT untuk FungsiKu

Sumber: Kinard, J. T., & Kozulin, A. (2008). *Rigorous Mathematical Thinking: Conceptual Formation in the Mathematics Classroom*. Cambridge University Press.
Ringkasan ini ditulis ulang dengan kata-kata sendiri untuk tugas mata kuliah; buku aslinya tidak disimpan di repositori karena dilindungi hak cipta.

## 1. Gagasan pokok
- **Pemikiran matematis yang rigor** adalah kebiasaan berpikir yang fokus, tepat, lengkap, dan tidak cepat menyerah. Siswa ingin benar-benar paham, bukan sekadar mendapat jawaban.
- Kesulitan matematika sering berasal dari **fungsi kognitif** yang belum berkembang, misalnya membandingkan, mencari secara sistematis, atau memberi bukti. Penyebabnya belum tentu kurangnya pengetahuan rumus.
- RMT memadukan dua teori:
  - **Alat psikologis (Vygotsky):** simbol, tabel, garis bilangan, bidang koordinat, rumus, dan bahasa matematika adalah *alat berpikir*, bukan hafalan. Alat ini harus dipahami lewat hubungan **struktur–fungsi**, lalu diinternalisasi.
  - **Pengalaman Belajar Termediasi/MLE (Feuerstein):** guru berperan sebagai mediator. Tiga kriteria intinya adalah **intensionalitas-resiprositas**, **transendensi** (mengaitkan ke hal di luar soal), dan **makna** (alasan "mengapa"). Kriteria tambahannya adalah **rasa mampu**.

## 2. Tiga fase proses RMT
| Fase | Isi |
|---|---|
| I. Pengembangan Kognitif | Siswa memakai alat berpikir umum untuk mengerjakan tugas kognitif dan melatih fungsi kognitif. |
| II. Konten sebagai Proses | Siswa membangun konsep dasar dari pengalaman dan bahasa sehari-hari, menemukan pola, lalu mengenal alat khusus matematika (tabel, garis bilangan, bidang koordinat, bahasa matematika). |
| III. Praktik Konstruksi Konsep | Siswa memakai alat matematika untuk mengatur fungsi kognitif dan membangun pemahaman konsep. |

Ketiga fase tidak harus urut kaku. Sepanjang proses, guru menjaga keterlibatan yang rigor, dan siswa merefleksikan cara berpikirnya.

## 3. Fungsi kognitif (tiga tingkat)
- **Tingkat 1, kualitatif umum:** memberi label dan membayangkan, membandingkan, mencari secara sistematis, memakai lebih dari satu sumber informasi, mengode dan membaca kode.
- **Tingkat 2, kuantitatif dan teliti:** mempertahankan keajekan, mengukur ruang dan waktu, mengurai dan menyatukan, menggeneralisasi, bersikap teliti.
- **Tingkat 3, logis dan abstrak:** mengaktifkan pengetahuan awal, memberi bukti logis, mendefinisikan masalah, berpikir hipotetis, membentuk hubungan proporsional dan **fungsional**, berpikir induktif-deduktif, analogis, silogistis, transitif, serta merefleksikan kegiatan matematika.

## 4. Konsep fungsi menurut RMT
Unsur konsep fungsi menurut buku (bab 5) mencakup:
- perubahan di tengah keajekan;
- variabel dan saling ketergantungan;
- hubungan sebab-akibat dan masukan-keluaran;
- variabel bebas dan terikat;
- korespondensi;
- pasangan berurutan;
- kemiringan;
- penyajian lewat rumus, tabel, dan grafik.

Tabel dan bidang koordinat dipakai sebagai alat untuk membentuk hubungan antardata.

## 5. Penerapan di FungsiKu
| Kode | Fitur | Unsur RMT |
|---|---|---|
| RMT-1 | Penanda **fase RMT** di setiap layar pelajaran | Tiga fase proses (bab 5) |
| RMT-2 | Penanda **fungsi kognitif sasaran** beserta artinya (dibuka bila diketuk) | Fungsi kognitif dan bahasa kognitif (bab 4) |
| RMT-3 | **Mediator AI** (DeepSeek) yang tidak memberi jawaban. Mediator memberi satu pertanyaan pemandu, meminta bukti logis, menyebut bagian yang sudah tepat, dan mengaitkan ke alat matematika. | MLE: intensionalitas, makna, transendensi, rasa mampu |

Pemetaan tahap pelajaran ke fase dan fungsi kognitif ada di `content/rmt.json`. Aturan *cognitive load* tetap berlaku:
- Mediator hanya muncul bila diminta.
- Jawaban mediator maksimal 3 kalimat (dijaga oleh server).
- Di soal cerita, mediator menuntun literasi matematis lewat 4 langkah: Pahami, Rumuskan, Hitung, Tafsirkan.
- Mediator bisa ditanya sampai 50 kali per layar.
- Tidak ada animasi.
