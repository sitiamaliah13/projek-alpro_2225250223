/**
 * Ikon garis sederhana (design.md §5: "ikon garis sederhana"), SVG inline tanpa pustaka.
 * Warna mengikuti `currentColor`, jadi makna warna diatur oleh pemanggil (A3).
 */
const PATH = {
  beranda: <path d="M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10" />,
  materi: <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7M8 11h7" />,
  latihan: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM15 16.5l2 2 3.5-4" />,
  tes: <path d="M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12l2 2 5-5M8 17h8" />,
  ekspor: <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />,
  cek: <path d="M12 21a9 9 0 110-18 9 9 0 010 18zM8 12l3 3 5-6" />,
  relasi: <path d="M5 6h3M5 12h3M5 18h3M16 6h3M16 12h3M16 18h3M8 6l8 6M8 12l8-6M8 18l8 0" />,
  himpunan: <path d="M9 12a5 5 0 1010 0 5 5 0 00-10 0zM5 12a5 5 0 1010 0 5 5 0 00-10 0" />,
  jembatan: <path d="M3 18h18M5 18v-6M19 18v-6M3 12c4-6 14-6 18 0M9 18v-4M15 18v-4" />,
  nilai: <path d="M5 3h14v18H5zM8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 18h8" />,
  rumus: <path d="M9 20c2 0 2-2 2.5-5l1.5-8c.5-3 1-4 3-4M8 10h7M15 14l4 5M19 14l-4 5" />,
  sekitar: <path d="M12 21s-7-6-7-11a7 7 0 1114 0c0 5-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5" />,
  piala: <path d="M8 4h8v5a4 4 0 01-8 0zM8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4M12 13v4M8 21h8M9 17h6v4H9z" />,
  putar: <path d="M8 5l11 7-11 7z" />,
  jeda: <path d="M8 5h3v14H8zM13 5h3v14h-3z" />,
  musik: <path d="M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM19 16a3 3 0 11-6 0 3 3 0 016 0z" />,
  keluar: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />,
  bintang: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
}

export default function Ikon({ nama, className = 'h-6 w-6', isi = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={isi ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATH[nama] ?? PATH.materi}
    </svg>
  )
}
