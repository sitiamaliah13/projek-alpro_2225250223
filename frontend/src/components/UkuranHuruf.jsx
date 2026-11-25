import { useState } from 'react'
import { UKURAN, bacaUkuran, simpanUkuran } from '../data/ukuranHuruf.js'

/** F28 pengatur ukuran huruf; siswa mengatur sendiri kenyamanan membaca. */
export default function UkuranHuruf() {
  const [pilih, setPilih] = useState(bacaUkuran)
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white px-4 py-2">
      <legend className="px-1 font-semibold">Ukuran huruf</legend>
      <div className="flex flex-wrap gap-2">
        {UKURAN.map((u) => (
          <button
            key={u.id}
            type="button"
            aria-pressed={pilih === u.id}
            onClick={() => {
              setPilih(u.id)
              simpanUkuran(u.id)
            }}
            className={`min-h-tap rounded-xl border-2 px-3 font-semibold ${
              pilih === u.id ? 'border-brand bg-brand-pale text-brand' : 'border-slate-300 bg-white'
            }`}
          >
            {pilih === u.id ? '✓ ' : ''}
            {u.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
