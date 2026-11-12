import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'

const MAKS = 200

/** F14 Jelaskan ke Temanmu: pilih alasan (wajib) + kalimat sendiri (opsional) (GL04). */
export default function KartuJelaskan({ kartu, onSelesai }) {
  const [pilih, setPilih] = useState(null)
  const [teks, setTeks] = useState('')
  const [terkirim, setTerkirim] = useState(false)

  const kirim = () => {
    setTerkirim(true)
    onSelesai({ reason_choice: pilih, reason_correct: pilih === kartu.kunci, text: teks.trim() || null })
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <fieldset className="mt-3 space-y-2" disabled={terkirim}>
        <legend className="sr-only">Pilih penjelasan</legend>
        {kartu.pilihan.map((p, i) => (
          <label
            key={i}
            className={`flex min-h-tap cursor-pointer items-center gap-3 rounded-xl border-2 bg-white px-4 py-2 ${
              pilih === i ? 'border-domain' : 'border-slate-300'
            }`}
          >
            <input type="radio" name={kartu.id} checked={pilih === i} onChange={() => setPilih(i)} className="h-5 w-5 shrink-0" />
            <span>{p}</span>
          </label>
        ))}
      </fieldset>

      <label className="mt-4 block">
        <span className="font-semibold">✏️ Tambahkan kalimatmu sendiri (boleh kosong)</span>
        <textarea
          value={teks}
          maxLength={MAKS}
          disabled={terkirim}
          onChange={(e) => setTeks(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border-2 border-slate-300 p-3 text-lg"
        />
        <span className="text-base text-muted">
          {teks.length}/{MAKS} huruf
        </span>
      </label>

      {!terkirim && (
        <Tombol className="mt-3" disabled={pilih === null} onClick={kirim}>
          Kirim penjelasan
        </Tombol>
      )}
      {terkirim && (
        <UmpanBalik jenis={pilih === kartu.kunci ? 'benar' : 'info'}>
          {(pilih === kartu.kunci ? 'Penjelasanmu tepat. ' : 'Bandingkan dengan penjelasan ini. ') + kartu.model}
        </UmpanBalik>
      )}
    </div>
  )
}
