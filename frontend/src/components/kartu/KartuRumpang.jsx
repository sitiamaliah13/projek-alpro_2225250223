import { useState } from 'react'
import Teks from '../Teks.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'

/** Contoh rumpang: siswa melengkapi langkah satu per satu (faded example). */
export default function KartuRumpang({ kartu, onSelesai }) {
  const [ke, setKe] = useState(0) // isian yang sedang dikerjakan
  const [salah, setSalah] = useState(null)

  const jawab = (i) => {
    const isian = kartu.isian[ke]
    if (i !== isian.kunci) {
      setSalah(isian.salah)
      return
    }
    setSalah(null)
    const n = ke + 1
    setKe(n)
    if (n >= kartu.isian.length) onSelesai()
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-3 rounded-2xl bg-white p-3">
        <DiagramPanah A={kartu.diagram.A} B={kartu.diagram.B} pairs={kartu.diagram.pairs} />
      </div>

      <ol className="mt-4 space-y-3">
        {kartu.isian.slice(0, ke).map((s, i) => (
          <li key={i} className="rounded-xl bg-white px-4 py-2">
            {s.tanya} <strong className="text-ok-ink">✓ {s.pilihan[s.kunci]}</strong>
          </li>
        ))}
      </ol>

      {ke < kartu.isian.length && (
        <div className="mt-3">
          <p className="mb-2 font-semibold">{kartu.isian[ke].tanya}</p>
          <div className="space-y-2">
            {kartu.isian[ke].pilihan.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jawab(i)}
                className="min-h-tap w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-left"
              >
                {p}
              </button>
            ))}
          </div>
          {salah && <UmpanBalik jenis="salah">{salah}</UmpanBalik>}
        </div>
      )}
    </div>
  )
}
