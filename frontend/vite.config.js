import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

// Konten materi/soal disimpan di ../content (agents.md: tidak di-hardcode).
const contentDir = fileURLToPath(new URL('../content', import.meta.url))

// Build khusus untuk diterbitkan sebagai Artifact claude.ai (FUNGSIKU_ARTIFACT=1):
// tanpa service worker, navigasi di memori, ekspor lewat salin teks. Hasil ke dist-artifact/.
const ARTIFACT = process.env.FUNGSIKU_ARTIFACT === '1'

// Alamat saat `npm run dev`: http://localhost:<port>/aplikasi-pembelajaran-fungsiku-2225250223/
const DEV_BASE = '/aplikasi-pembelajaran-fungsiku-2225250223/'

export default defineConfig(({ command }) => ({
  // base './' = semua alamat aset relatif. Satu hasil build yang sama bisa dibuka di
  // GitHub Pages (https://<akun>.github.io/<repo>/), Netlify Drop (root domain), atau subfolder lain.
  // Routing memakai HashRouter (#/peta), jadi server tidak perlu aturan rewrite dan tidak ada 404 saat refresh.
  // Saat dev memakai DEV_BASE; hasil build tetap './' agar bisa di-deploy di mana saja.
  base: process.env.FUNGSIKU_BASE ?? (command === 'serve' ? DEV_BASE : './'),
  plugins: [
    react(),
    // PWA offline: semua aset (termasuk Three.js) disimpan di HP setelah dibuka pertama kali,
    // sehingga belajar di rumah bisa tanpa kuota (architecture.md §7).
    VitePWA({
      disable: ARTIFACT,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'FungsiKu — Belajar Pemetaan Fungsi',
        short_name: 'FungsiKu',
        description: 'Belajar pemetaan fungsi kelas VIII, langkah demi langkah.',
        lang: 'id',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF7FB',
        theme_color: '#DB2777',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  define: { __ARTIFACT__: JSON.stringify(ARTIFACT) },
  resolve: { alias: { '@content': contentDir } },
  server: { fs: { allow: ['..'] } },
  build: {
    // Three.js (±1 MB) otomatis terpisah karena di-import secara dinamis di KartuMesin.jsx;
    // berkas itu tidak dimuat saat aplikasi dibuka. (manualChunks sengaja tidak dipakai:
    // itu menarik React ke berkas three dan membuatnya dimuat di awal.)
    chunkSizeWarningLimit: 1100,
    outDir: ARTIFACT ? 'dist-artifact' : 'dist',
  },
  test: { environment: 'node' },
}))
