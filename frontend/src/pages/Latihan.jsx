import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Ikon from '../components/Ikon.jsx'
import { ambilPelajaran, modulTersedia } from '../data/konten.js'
import { useProgres } from '../data/ProgresContext.jsx'

/** Indeks layar latihan pertama dalam sebuah pelajaran. */
export function indeksLatihan(pelajaran) {
  const i = pelajaran.cards.findIndex((k) => k.tahap === 'Latihan')
  return i < 0 ? 0 : i
}

/**
 * Menu "Latihan Interaktif": langsung ke bagian latihan setiap modul.
 * Untuk siswa yang sudah paham materi (expertise reversal); contoh tetap bisa dibuka dengan "Sebelumnya".
 */
export default function Latihan() {
  const { progres } = useProgres()
  const sudahDikerjakan = new Set(progres.attempts.filter((a) => a.correct).map((a) => a.item_id))

  return (
    <AppShell judul="Latihan Interaktif">
      <h2 className="text-xl font-bold">Latihan Interaktif</h2>
      <p className="mb-4 mt-1 text-muted">Langsung berlatih. Petunjuk tersedia bila kamu memintanya.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {modulTersedia.map((m) => {
          const p = ambilPelajaran(m.lesson)
          const soal = p.cards.filter((k) => k.id && k.tahap === 'Latihan')
          const benar = soal.filter((k) => sudahDikerjakan.has(k.id)).length
          return (
            <li key={m.id} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-domain">
                <Ikon nama={m.ikon} className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{m.title}</p>
                <p className="text-muted">
                  {benar} dari {soal.length} soal benar
                </p>
              </div>
              <Link
                to={`/pelajaran/${m.lesson}?mulai=${indeksLatihan(p)}`}
                className="flex min-h-tap shrink-0 items-center rounded-xl border-2 border-domain px-3 font-semibold text-domain"
                aria-label={`Mulai latihan ${m.title}`}
              >
                Mulai →
              </Link>
            </li>
          )
        })}
      </ul>
    </AppShell>
  )
}
