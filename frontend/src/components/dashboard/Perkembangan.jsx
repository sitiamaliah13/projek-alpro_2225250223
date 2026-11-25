import { Link } from 'react-router-dom'
import { modulTersedia, tautanModul } from '../../data/konten.js'
import { statusPenguasaan } from '../../lib/perkembangan.js'

const LABEL = {
  dikuasai: { teks: '✓ Dikuasai', kelas: 'text-ok-ink' },
  ulang: { teks: '↻ Perlu diulang', kelas: 'text-hint-ink' },
  belum: { teks: '○ Belum dipelajari', kelas: 'text-muted' },
}

/**
 * Perkembangan Belajarku: materi yang dikuasai dan yang perlu diulang (prd F18, item E).
 * Status ditulis dengan teks + ikon, bukan hanya warna (design.md §8). Tanpa animasi.
 */
export default function Perkembangan({ progres }) {
  const daftar = modulTersedia.map((m) => ({ m, ...statusPenguasaan(m.lesson, progres) }))
  const hitung = (s) => daftar.filter((d) => d.status === s).length

  return (
    <section aria-labelledby="judul-perkembangan" className="surface-float rounded-3xl p-5">
      <h2 id="judul-perkembangan" className="text-xl font-bold">
        Perkembangan Belajarku
      </h2>
      <p className="mt-1 text-muted">
        {hitung('dikuasai')} dikuasai · {hitung('ulang')} perlu diulang · {hitung('belum')} belum dipelajari
      </p>
      <ul className="mt-3 divide-y divide-slate-100">
        {daftar.map(({ m, status, tepat, bintang }) => (
          <li key={m.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
            <span className="min-w-0 flex-1 font-semibold">{m.title}</span>
            <span className={`font-semibold ${LABEL[status].kelas}`}>{LABEL[status].teks}</span>
            <span className="w-full text-base text-muted sm:w-auto">
              {status === 'belum'
                ? 'Mulai dari contoh, lalu latihan.'
                : `${bintang}/3 bintang${tepat ? ` · ${tepat.persen}% latihan benar sekali coba` : ''}`}
            </span>
            {status === 'ulang' && (
              <Link to={tautanModul(m)} className="min-h-tap font-semibold text-brand underline">
                Ulangi →
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-base text-muted">Dikuasai = bintang minimal 2 dan minimal 70% latihan benar sekali coba.</p>
    </section>
  )
}
