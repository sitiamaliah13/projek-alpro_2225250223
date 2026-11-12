import { Link } from 'react-router-dom'
import Ikon from '../Ikon.jsx'

const Bintang = ({ n }) => (
  <span className="flex items-center gap-0.5" aria-label={`${n} dari 3 bintang`}>
    {[1, 2, 3].map((i) => (
      <Ikon key={i} nama="bintang" isi={i <= n} className={`h-5 w-5 ${i <= n ? 'text-hint' : 'text-slate-300'}`} />
    ))}
  </span>
)

/**
 * Kartu modul di grid Beranda/Materi.
 * Warna ikon bermakna (A3): biru = siap dipelajari, hijau = sudah selesai. Status juga ditulis dengan teks.
 */
export default function KartuModul({ nomor, modul, status, ke }) {
  const selesai = status.done
  return (
    <article className="surface-float flex flex-col rounded-3xl p-5">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            selesai ? 'bg-green-50 text-ok-ink' : 'bg-blue-50 text-domain'
          }`}
        >
          <Ikon nama={modul.ikon} className="h-7 w-7" />
        </span>
        <span className="text-xl font-bold text-slate-400">{String(nomor).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold">{modul.title}</h3>
      <p className="mt-1 flex-1 text-muted">{modul.desc}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className={`font-semibold ${selesai ? 'text-ok-ink' : 'text-muted'}`}>{selesai ? '✓ Selesai' : 'Belum selesai'}</span>
        {status.stars !== null && <Bintang n={selesai ? status.stars : 0} />}
      </div>

      <Link
        to={ke}
        className="mt-4 flex min-h-tap items-center justify-center rounded-2xl border-2 border-pink-200 font-semibold text-brand hover:bg-brand-pale"
      >
        {selesai ? 'Ulangi materi →' : 'Pelajari materi →'}
      </Link>
    </article>
  )
}
