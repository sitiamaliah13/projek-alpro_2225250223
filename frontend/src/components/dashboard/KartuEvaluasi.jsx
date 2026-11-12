import { Link } from 'react-router-dom'
import Ikon from '../Ikon.jsx'
import { posttestTerbuka } from '../../data/progres.js'

/** Kartu ajakan tes literasi di bawah grid modul. */
export default function KartuEvaluasi({ progres, siswa }) {
  const postBuka = posttestTerbuka(progres, siswa)
  return (
    <section className="surface-float flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-hint-ink">
        <Ikon nama="piala" className="h-8 w-8" />
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-bold">Sudah siap mencoba tes literasi?</h3>
        <p className="text-muted">5 soal cerita. Tulis langkahmu, bukan hanya jawaban akhir.</p>
      </div>
      <div className="flex flex-col gap-2 sm:w-48">
        {progres.pretest.done ? (
          <span className="flex min-h-tap items-center justify-center rounded-xl bg-green-50 font-semibold text-ok-ink">✓ Pretest selesai</span>
        ) : (
          <Link to="/pretest" className="flex min-h-tap items-center justify-center rounded-2xl bg-brand font-semibold text-white shadow-sm">
            Kerjakan Pretest →
          </Link>
        )}
        {progres.posttest.done ? (
          <span className="flex min-h-tap items-center justify-center rounded-xl bg-green-50 font-semibold text-ok-ink">✓ Posttest selesai</span>
        ) : postBuka ? (
          <Link to="/posttest" className="flex min-h-tap items-center justify-center rounded-2xl border-2 border-pink-200 font-semibold text-brand">
            Kerjakan Posttest →
          </Link>
        ) : (
          <span className="flex min-h-tap items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-muted">
            🔒 Posttest setelah semua modul
          </span>
        )}
      </div>
    </section>
  )
}
