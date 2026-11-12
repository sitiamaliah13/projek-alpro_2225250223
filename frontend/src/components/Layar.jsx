import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jedaMusik } from '../lib/musikTenang.js'

/**
 * Kerangka layar FOKUS untuk pelajaran, Cek Bekal, dan tes (mobile-first, satu kolom; design.md §5).
 * Sengaja tanpa sidebar/menu agar tidak ada distraksi (extraneous load). Musik Study Time dijeda.
 * Tombol utama diletakkan di `bawah` agar berada di zona jempol.
 */
export default function Layar({ judul, kembali, kanan, bawah, children }) {
  useEffect(() => {
    jedaMusik()
  }, [])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-bg">
      <header className="flex min-h-tap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
        {kembali && (
          <Link
            to={kembali}
            className="-ml-2 flex min-h-tap min-w-tap items-center justify-center rounded-lg text-xl"
            aria-label="Kembali"
          >
            ←
          </Link>
        )}
        <h1 className="flex-1 text-xl font-bold">{judul}</h1>
        {kanan}
      </header>
      <main className="flex-1 px-4 py-5">{children}</main>
      {bawah && (
        <footer
          className="sticky bottom-0 border-t border-slate-200 bg-white px-4 pt-3"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
        >
          {bawah}
        </footer>
      )}
    </div>
  )
}
