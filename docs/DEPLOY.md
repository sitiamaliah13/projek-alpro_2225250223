# Panduan Unggah (Deploy) FungsiKu — Gratis

Aplikasi Tahap 1 hanya berupa file statis di folder `frontend/dist`. Tidak perlu server atau database.

**Mengapa tidak ada error routing?**
- **Alamat halaman memakai tanda `#`**, misalnya `.../#/peta`. Bagian setelah `#` tidak pernah dikirim ke server. Jadi halaman tidak akan 404 walaupun di-*refresh* atau dibuka dari tautan.
- **Alamat file memakai `base: './'`** (alamat relatif). Karena itu hasil build yang sama bisa jalan di root domain (Netlify) maupun di subfolder (GitHub Pages `/<nama-repo>/`).

## Langkah 0 — Siapkan hasil build (wajib untuk kedua cara)
Buka terminal VS Code:
```powershell
cd frontend
npm.cmd run siap-deploy
```
Perintah ini menjalankan tiga hal:
1. tes Vitest;
2. build;
3. pemeriksaan `dist/`: alamat relatif, file PWA lengkap, ukuran < 3 MB, dan tidak ada data siswa.

Lanjutkan hanya bila muncul **"✅ dist/ siap diunggah."**

---

## Cara A — Netlify Drop (paling cepat, ± 2 menit, tanpa Git)
1. Buka **https://app.netlify.com/drop** dan masuk dengan akun gratis. Hosting memerlukan akun pemilik; tanpa akun, tautan lokal tidak bisa menjadi tautan publik permanen.
2. Buka File Explorer ke `projek alpro_2225250223\frontend\`.
3. Seret **folder `dist`** (foldernya, bukan isinya) ke kotak di halaman Netlify.
4. Tunggu sampai muncul alamat, misalnya `https://nama-acak.netlify.app`.
5. Opsional: *Site configuration → Change site name* menjadi `fungsiku-kelas8`, misalnya.

**Memperbarui aplikasi:** jalankan Langkah 0 lagi. Lalu buka situsnya di Netlify → *Deploys* → seret folder `dist` yang baru.

## Cara B — GitHub Pages (otomatis setiap kali push)
Cara ini memerlukan Git dan akun GitHub.
1. Buat repositori baru di GitHub, misalnya `fungsiku`. Pilih **Public**, karena Pages gratis untuk repo publik.
2. Di folder proyek, jalankan:
   ```powershell
   git init
   git add .
   git commit -m "feat: draf aplikasi FungsiKu"
   git branch -M main
   git remote add origin https://github.com/<akun-anda>/fungsiku.git
   git push -u origin main
   ```
   `.gitignore` sudah mengecualikan `node_modules`, `dist`, `.venv`, `.env`, dan file ekspor data siswa.
3. Di GitHub, buka **Settings → Pages → Build and deployment → Source**, lalu pilih **GitHub Actions**.
4. Workflow `.github/workflows/deploy-pages.yml` berjalan otomatis: install → tes → build → cek → unggah. Kemajuannya bisa dilihat di tab **Actions**.
5. Setelah selesai, aplikasi ada di `https://<akun-anda>.github.io/fungsiku/`.

**Cara manual tanpa Actions:** unggah isi `frontend/dist` ke branch `gh-pages`, lalu pilih *Source: Deploy from a branch → gh-pages*. File `.nojekyll` sudah disertakan agar GitHub tidak memproses ulang folder itu.

## Cara C — Vercel (gratis, perlu akun GitHub)
File [frontend/vercel.json](../frontend/vercel.json) sudah berisi tiga pengaturan:
- perintah build (`npm run build`);
- folder hasil (`dist`);
- aturan *rewrite* SPA: `"source": "/(.*)", "destination": "/index.html"`.

Vercel selalu mendahulukan file yang benar-benar ada, seperti `sw.js` dan `assets/…`. Aturan rewrite baru dipakai untuk alamat lain, jadi PWA tetap aman. `sw.js` juga diberi header `no-cache` agar versi baru cepat terpasang.

1. Unggah proyek ke GitHub (Cara B langkah 1–2).
2. Buka **https://vercel.com/new**, lalu **Import** repositori `fungsiku`.
3. Pada **Root Directory**, pilih `frontend`. Biarkan opsi *Include files outside the root directory* **aktif**, karena materi ada di folder `content/`.
4. Klik **Deploy**. Alamatnya akan berbentuk `https://fungsiku.vercel.app`.

---

## Setelah Diunggah: Cek di HP Android
1. Buka alamatnya di **Chrome**, lalu masukkan nama panggilan samaran.
2. Di Peta Belajar, tunggu sampai tertulis **"✓ Siap dipakai offline"**.
3. Pilih menu ⋮ → **Tambahkan ke layar utama** / **Instal aplikasi**.
4. Uji offline: nyalakan mode pesawat, lalu buka FungsiKu dari layar utama.

## Catatan Penting
- **Data siswa** tersimpan di HP masing-masing, bukan di server. Ekspor lewat tombol **Ekspor data** di setiap HP sebelum cache browser dibersihkan.
- **Versi baru** otomatis terpasang saat siswa membuka aplikasi dalam keadaan online.
- **Masuk:** gunakan nama panggilan samaran. Jangan gunakan nama lengkap siswa.
- **Jangan** mengunggah file ekspor data siswa (`fungsiku-P01.json`, dst.) ke GitHub (agents.md aturan 6).
