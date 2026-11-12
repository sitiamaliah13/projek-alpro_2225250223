import { useState } from 'react'
import Teks from './Teks.jsx'
import Tombol from './Tombol.jsx'
import UmpanBalik from './UmpanBalik.jsx'
import PanelHint from './PanelHint.jsx'
import InputAngka from './InputAngka.jsx'
import { bacaAngka } from '../lib/aljabar.js'

/**
 * Satu pertanyaan pendek (pilihan atau angka) dengan petunjuk 3 tingkat dan umpan balik "mengapa".
 * tanya = { teks, tipe: 'pilihan'|'angka', pilihan?, kunci, benar, salah, salahKhusus?: {jawaban: pesan}, petunjuk? }
 * onSelesai({ correct, tries, hints_used }) dipanggil sekali: saat benar, atau saat siswa memilih "Lihat pembahasan".
 */
export default function PertanyaanSingkat({ tanya, onSelesai }) {
  const [pilih, setPilih] = useState(null)
  const [isian, setIsian] = useState('')
  const [coba, setCoba] = useState(0)
  const [hint, setHint] = useState(0)
  const [status, setStatus] = useState('belum') // belum | salah | benar | dibahas
  const [pesanSalah, setPesanSalah] = useState('')
  const terkunci = status === 'benar' || status === 'dibahas'
  const angka = tanya.tipe === 'angka'

  const jawaban = angka ? bacaAngka(isian) : pilih
  const bisaPeriksa = angka ? !Number.isNaN(jawaban) : pilih !== null

  const periksa = () => {
    const n = coba + 1
    setCoba(n)
    if (jawaban === tanya.kunci) {
      setStatus('benar')
      onSelesai?.({ correct: true, tries: n, hints_used: hint })
      return
    }
    setStatus('salah')
    setPesanSalah(tanya.salahKhusus?.[String(jawaban)] ?? tanya.salah)
  }

  const bahas = () => {
    setStatus('dibahas')
    if (angka) setIsian(String(tanya.kunci))
    else setPilih(tanya.kunci)
    onSelesai?.({ correct: false, tries: coba, hints_used: hint })
  }

  return (
    <div className="mt-4">
      <Teks className="font-semibold">{tanya.teks}</Teks>
      <div className="mt-2">
        {angka ? (
          <InputAngka
            nilai={isian}
            disabled={terkunci}
            label={tanya.teks}
            onUbah={(v) => {
              setIsian(v)
              if (status === 'salah') setStatus('belum')
            }}
          />
        ) : (
          <div className="space-y-2">
            {tanya.pilihan.map((p, i) => (
              <button
                key={i}
                type="button"
                disabled={terkunci}
                aria-pressed={pilih === i}
                onClick={() => {
                  setPilih(i)
                  if (status === 'salah') setStatus('belum')
                }}
                className={`min-h-tap w-full rounded-xl border-2 bg-white px-4 py-2 text-left ${
                  pilih === i ? 'border-domain' : 'border-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      {!terkunci && (
        <Tombol className="mt-3" disabled={!bisaPeriksa} onClick={periksa}>
          Periksa
        </Tombol>
      )}
      {status === 'benar' && <UmpanBalik jenis="benar">{tanya.benar}</UmpanBalik>}
      {status === 'salah' && <UmpanBalik jenis="salah">{pesanSalah}</UmpanBalik>}
      {status === 'dibahas' && <UmpanBalik jenis="info">{tanya.benar}</UmpanBalik>}
      {!terkunci && <PanelHint petunjuk={tanya.petunjuk ?? []} terbuka={hint} onBuka={() => setHint(hint + 1)} />}
      {status === 'salah' && coba >= 2 && (
        <Tombol jenis="kedua" className="mt-3" onClick={bahas}>
          Lihat pembahasan
        </Tombol>
      )}
    </div>
  )
}
