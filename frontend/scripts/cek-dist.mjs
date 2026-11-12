// Memeriksa folder dist/ sebelum diunggah ke GitHub Pages atau Netlify Drop.
// Jalankan: npm run cek-dist   (atau npm run siap-deploy untuk tes + build + cek)
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist', import.meta.url))
const masalah = []
const ok = (pesan) => console.log(`  ✓ ${pesan}`)

if (!existsSync(dist)) {
  console.error('✗ Folder dist/ belum ada. Jalankan dulu: npm run build')
  process.exit(1)
}

// 1. File wajib
for (const f of ['index.html', 'manifest.webmanifest', 'sw.js', 'pwa-192.png', 'pwa-512.png', '.nojekyll', '_redirects']) {
  if (existsSync(join(dist, f))) ok(`${f} ada`)
  else masalah.push(`${f} tidak ditemukan di dist/`)
}

// 2. Alamat aset harus relatif (./assets/...), bukan absolut (/assets/...), agar jalan di subfolder GitHub Pages
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const absolut = [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1])
if (absolut.length) masalah.push(`index.html memakai alamat absolut: ${absolut.join(', ')}`)
else ok('semua alamat aset di index.html relatif')

const manifest = JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'))
if (manifest.start_url?.startsWith('/')) masalah.push(`manifest start_url absolut: ${manifest.start_url}`)
else ok(`manifest start_url = "${manifest.start_url}"`)

// 3. Ukuran total (target pra-unduh offline < 3 MB, architecture.md §7)
const ukuran = (dir) =>
  readdirSync(dir).reduce((n, f) => {
    const p = join(dir, f)
    return n + (statSync(p).isDirectory() ? ukuran(p) : statSync(p).size)
  }, 0)
const mb = ukuran(dist) / 1024 / 1024
if (mb > 3) masalah.push(`ukuran dist ${mb.toFixed(2)} MB melebihi target 3 MB`)
else ok(`ukuran dist ${mb.toFixed(2)} MB (target < 3 MB)`)

// 4. Tidak ada data rahasia/siswa yang ikut terunggah
const rahasia = readdirSync(dist).filter((f) => /^\.env|fungsiku-P0\d.*\.json$/.test(f))
if (rahasia.length) masalah.push(`file sensitif ikut di dist: ${rahasia.join(', ')}`)
else ok('tidak ada .env atau ekspor data siswa di dist/')

if (masalah.length) {
  console.error('\n✗ Belum siap diunggah:')
  for (const m of masalah) console.error(`  - ${m}`)
  process.exit(1)
}
console.log('\n✅ dist/ siap diunggah.')
console.log('   Netlify Drop : seret folder frontend/dist ke https://app.netlify.com/drop')
console.log('   GitHub Pages : lihat docs/DEPLOY.md (otomatis lewat GitHub Actions)')
