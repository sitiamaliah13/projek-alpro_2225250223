import { useEffect, useState } from 'react'
import Ikon from './Ikon.jsx'
import { jedaMusik, musikBerjalan, pantauMusik, putarMusik } from '../lib/musikTenang.js'

/** Bar kecil "Study Time" (opsional). Mati secara bawaan; hanya berbunyi bila siswa menekan Putar. */
export default function StudyTime() {
  const [main, setMain] = useState(musikBerjalan)
  useEffect(() => pantauMusik(setMain), [])

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-muted">
        <Ikon nama="musik" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">Study Time</p>
        <p className="text-base text-muted">{main ? 'Musik fokus sedang diputar' : 'Musik fokus · mati'}</p>
      </div>
      <button
        type="button"
        onClick={() => (main ? jedaMusik() : putarMusik())}
        aria-pressed={main}
        aria-label={main ? 'Jeda musik' : 'Putar musik fokus'}
        className={`flex min-h-tap min-w-tap items-center justify-center rounded-full border-2 ${
          main ? 'border-domain bg-domain text-white' : 'border-slate-300 bg-white text-ink'
        }`}
      >
        <Ikon nama={main ? 'jeda' : 'putar'} isi />
      </button>
    </div>
  )
}
