import Teks from './Teks.jsx'

const JENIS = {
  benar: { ikon: '✓', kelas: 'border-ok text-ok-ink', label: 'Benar' },
  salah: { ikon: '⚠️', kelas: 'border-hint text-ink', label: 'Belum tepat' },
  info: { ikon: 'ℹ️', kelas: 'border-slate-300 text-ink', label: 'Info' },
}

/**
 * Umpan balik yang menjelaskan mengapa (A9). Status selalu memakai ikon + teks,
 * tidak hanya warna, dan tanpa blok merah besar (design.md §2, §8).
 */
export default function UmpanBalik({ jenis = 'info', children }) {
  const j = JENIS[jenis]
  return (
    <div role="status" className={`mt-4 rounded-xl border-l-4 bg-white px-4 py-3 ${j.kelas}`}>
      <span className="font-bold">
        {j.ikon} {j.label}.{' '}
      </span>
      <Teks as="span">{children}</Teks>
    </div>
  )
}
