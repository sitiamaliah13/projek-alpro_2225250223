import { NavLink } from 'react-router-dom'
import Ikon from './Ikon.jsx'
import Logo from './Logo.jsx'
import { useProgres } from '../data/ProgresContext.jsx'

/** Menu utama: sama di sidebar (laptop) dan bilah bawah (HP), agar siswa cukup belajar satu navigasi (design.md §3). */
export const MENU = [
  { ke: '/peta', label: 'Beranda', pendek: 'Beranda', ikon: 'beranda' },
  { ke: '/materi', label: 'Materi Belajar', pendek: 'Materi', ikon: 'materi' },
  { ke: '/latihan', label: 'Latihan Interaktif', pendek: 'Latihan', ikon: 'latihan' },
  { ke: '/tes', label: 'Pretest & Posttest', pendek: 'Tes', ikon: 'tes' },
  { ke: '/ekspor', label: 'Ekspor Data', pendek: 'Ekspor', ikon: 'ekspor' },
]


/**
 * Tata letak dashboard untuk halaman menu (Beranda, Materi, Latihan, Tes, Ekspor).
 * - Laptop (≥ 1024 px): sidebar kiri tetap.
 * - HP: bilah menu bawah di zona jempol, target sentuh ≥ 48 px.
 * Halaman pelajaran dan tes TIDAK memakai shell ini (lihat Layar.jsx) agar siswa fokus.
 */
export default function AppShell({ judul, children }) {
  const { siswa } = useProgres()

  const kelasMenu = ({ isActive }) =>
    `flex min-h-tap items-center gap-3 rounded-xl px-3 font-semibold ${
      isActive ? 'bg-blue-50 text-domain' : 'text-muted hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Sidebar laptop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-pink-100 bg-white px-4 py-6 shadow-[4px_0_24px_rgba(157,23,77,0.04)] lg:flex lg:fixed lg:inset-y-0">
        <Logo />
        <nav className="mt-8 flex flex-col gap-1" aria-label="Menu utama">
          {MENU.map((m) => (
            <NavLink key={m.ke} to={m.ke} className={kelasMenu}>
              <Ikon nama={m.ikon} />
              {m.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto text-base text-muted">Pemetaan Fungsi · Kelas VIII</p>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        {/* Header atas */}
        <header className="sticky top-0 z-10 border-b border-pink-100 bg-white/95 shadow-[0_4px_18px_rgba(157,23,77,0.04)]">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 lg:px-8">
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold leading-tight">Selamat Datang!</p>
              {judul && <p className="text-base text-muted">{judul}</p>}
            </div>
            {siswa && (
              <span
                className="flex items-center gap-2 rounded-full border-2 border-pink-200 bg-brand-pale px-3 py-1 font-semibold"
                title="Nama panggilan tersimpan di perangkat ini"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" />
                <span>{siswa.nama ?? 'Teman'}</span>
              </span>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* Bilah menu bawah HP */}
      <nav
        className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-pink-100 bg-white shadow-[0_-5px_20px_rgba(157,23,77,0.08)] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Menu utama"
      >
        {MENU.map((m) => (
          <NavLink
            key={m.ke}
            to={m.ke}
            className={({ isActive }) =>
              `flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-base font-semibold ${
                isActive ? 'text-brand' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-8 w-12 items-center justify-center rounded-full ${isActive ? 'bg-brand-soft' : ''}`}>
                  <Ikon nama={m.ikon} />
                </span>
                {m.pendek}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
