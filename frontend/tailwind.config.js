/** Token warna semantik design.md §2. Warna hanya untuk makna (A3, EL03). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Skala huruf diganti total: tidak ada ukuran di bawah 16px (text-xs/text-sm tidak tersedia).
    fontSize: {
      base: ['1rem', { lineHeight: '1.5' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.5' }], // 18px, ukuran isi utama
      xl: ['1.375rem', { lineHeight: '1.35' }], // 22px, judul layar
      '2xl': ['1.75rem', { lineHeight: '1.25' }], // 28px, judul halaman
    },
    extend: {
      colors: {
        brand: '#DB2777', // warna aksi utama dan identitas visual (tema pink)
        'brand-soft': '#FCE7F3',
        'brand-pale': '#FFF7FB',
        domain: '#2563EB', // himpunan asal / nilai x
        codomain: '#0D9488', // himpunan kawan
        range: '#CCFBF1', // latar anggota kawan yang terpasang
        arrow: '#475569', // panah / aturan
        negative: '#9333EA', // bilangan negatif (IL05)
        ok: '#16A34A', // benar (garis/ikon)
        'ok-ink': '#15803D', // benar (teks, kontras AA)
        hint: '#CA8A04', // petunjuk (garis/ikon)
        'hint-ink': '#854D0E', // petunjuk (teks, kontras AA)
        bg: '#FFF7FB',
        ink: '#0F172A',
        muted: '#475569',
      },
      minHeight: { tap: '48px' },
      minWidth: { tap: '48px' },
    },
  },
  plugins: [],
}
