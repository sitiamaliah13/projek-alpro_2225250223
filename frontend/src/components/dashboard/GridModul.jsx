import KartuModul from './KartuModul.jsx'
import { modulBeranda, tautanModul } from '../../data/konten.js'
import { statusModul } from '../../data/progres.js'

/** Grid kartu modul 01–07: 1 kolom di HP, 2 di tablet, 3 di laptop. */
export default function GridModul({ progres, tautan = tautanModul }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modulBeranda.map((m, i) => (
        <KartuModul key={m.id} nomor={i + 1} modul={m} status={statusModul(m, progres)} ke={tautan(m)} />
      ))}
    </div>
  )
}
