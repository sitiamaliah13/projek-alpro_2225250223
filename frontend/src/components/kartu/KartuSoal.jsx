import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import PanelHint from '../PanelHint.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'

/**
 * Soal pilihan dengan petunjuk 3 tingkat (A8, GL03) dan umpan balik penyebab salah (A9).
 * Setelah 2 kali salah, siswa boleh melihat pembahasan agar tidak buntu.
 */
export default function KartuSoal({ kartu, onSelesai }) {
  const [pilih, setPilih] = useState(null)
  const [coba, setCoba] = useState(0)
  const [hint, setHint] = useState(0)
  const [status, setStatus] = useState('belum') // belum | salah | benar | dibahas
  const terkunci = status === 'benar' || status === 'dibahas'

  const periksa = () => {
    const percobaan = coba + 1
    setCoba(percobaan)
    if (pilih === kartu.kunci) {
      setStatus('benar')
      onSelesai({ correct: true, tries: percobaan, hints_used: hint })
    } else {
      setStatus('salah')
    }
  }

  const bahas = () => {
    setStatus('dibahas')
    setPilih(kartu.kunci)
    onSelesai({ correct: false, tries: coba, hints_used: hint })
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      {kartu.diagram && (
        <div className="mt-3 rounded-2xl bg-white p-3">
          <DiagramPanah A={kartu.diagram.A} B={kartu.diagram.B} pairs={kartu.diagram.pairs} />
        </div>
      )}

      <fieldset className="mt-4 space-y-2" disabled={terkunci}>
        <legend className="sr-only">Pilih jawaban</legend>
        {kartu.pilihan.map((p, i) => (
          <label
            key={i}
            className={`flex min-h-tap cursor-pointer items-center gap-3 rounded-xl border-2 bg-white px-4 py-2 ${
              pilih === i ? 'border-domain' : 'border-slate-300'
            }`}
          >
            <input
              type="radio"
              name={kartu.id}
              checked={pilih === i}
              onChange={() => {
                setPilih(i)
                if (status === 'salah') setStatus('belum')
              }}
              className="h-5 w-5"
            />
            <span>{p}</span>
          </label>
        ))}
      </fieldset>

      {!terkunci && (
        <Tombol className="mt-4" disabled={pilih === null} onClick={periksa}>
          Periksa
        </Tombol>
      )}

      {status === 'benar' && <UmpanBalik jenis="benar">{kartu.umpan.benar}</UmpanBalik>}
      {status === 'salah' && <UmpanBalik jenis="salah">{kartu.umpan.salah}</UmpanBalik>}
      {status === 'dibahas' && <UmpanBalik jenis="info">{kartu.umpan.benar}</UmpanBalik>}

      {!terkunci && <PanelHint petunjuk={kartu.petunjuk} terbuka={hint} onBuka={() => setHint(hint + 1)} />}
      {status === 'salah' && coba >= 2 && (
        <Tombol jenis="kedua" className="mt-3" onClick={bahas}>
          Lihat pembahasan
        </Tombol>
      )}
    </div>
  )
}
