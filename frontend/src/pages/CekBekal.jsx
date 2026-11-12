import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layar from '../components/Layar.jsx'
import Tombol from '../components/Tombol.jsx'
import UmpanBalik from '../components/UmpanBalik.jsx'
import InputAngka from '../components/InputAngka.jsx'
import { cekBekal } from '../data/konten.js'
import { useProgres } from '../data/ProgresContext.jsx'
import { bacaAngka } from '../lib/aljabar.js'

/** M0 Cek Bekal: prasyarat himpunan & bilangan bulat (IL03, IL05). Skor bilangan bulat < 70% → penguatan tanda. */
export default function CekBekal() {
  const { progres, ubah } = useProgres()
  const navigate = useNavigate()
  const items = cekBekal.items
  const [ke, setKe] = useState(0)
  const [isian, setIsian] = useState('')
  const [pilih, setPilih] = useState(null)
  const [hasil, setHasil] = useState(null) // null | {benar}
  const [benarPer, setBenarPer] = useState({})

  if (progres.diagnostic.done) {
    const { scores, penguatanTanda } = progres.diagnostic
    return (
      <Layar judul="Cek Bekal" bawah={<Tombol onClick={() => navigate('/peta')}>Ke Peta Belajar</Tombol>}>
        <p>Hasil Cek Bekalmu:</p>
        <ul className="mt-3 space-y-2">
          <li className="rounded-xl bg-white px-4 py-2">Himpunan: {scores.himpunan}%</li>
          <li className="rounded-xl bg-white px-4 py-2">Bilangan bulat: {scores.bilangan_bulat}%</li>
        </ul>
        {penguatanTanda ? (
          <UmpanBalik jenis="info">Yuk, perkuat dulu tanda bilangan bulat. Perhatikan warna ungu untuk bilangan negatif.</UmpanBalik>
        ) : (
          <UmpanBalik jenis="benar">Bekalmu sudah cukup. Ayo mulai belajar!</UmpanBalik>
        )}
      </Layar>
    )
  }

  const item = items[ke]
  const sudahDijawab = hasil !== null

  const periksa = () => {
    const benar = item.tipe === 'angka' ? bacaAngka(isian) === item.kunci : pilih === item.kunci
    setHasil({ benar })
    setBenarPer((lama) => ({ ...lama, [item.id]: benar }))
    ubah((p) => {
      p.attempts.push({ item_id: item.id, correct: benar, hints_used: 0, tries: 1, error_tag: null, ts: new Date().toISOString() })
    })
  }

  const lanjut = () => {
    if (ke + 1 < items.length) {
      setKe(ke + 1)
      setIsian('')
      setPilih(null)
      setHasil(null)
      return
    }
    const persen = (kategori) => {
      const daftar = items.filter((i) => i.kategori === kategori)
      return Math.round((daftar.filter((i) => benarPer[i.id]).length / daftar.length) * 100)
    }
    const scores = { himpunan: persen('himpunan'), bilangan_bulat: persen('bilangan_bulat') }
    ubah((p) => {
      p.diagnostic = { done: true, scores, penguatanTanda: scores.bilangan_bulat < cekBekal.batas_penguatan }
    })
  }

  const bisaPeriksa = item.tipe === 'angka' ? !Number.isNaN(bacaAngka(isian)) : pilih !== null

  return (
    <Layar
      judul={`Cek Bekal · ${ke + 1}/${items.length}`}
      bawah={
        sudahDijawab ? (
          <Tombol onClick={lanjut}>{ke + 1 < items.length ? 'Lanjut' : 'Lihat hasil'}</Tombol>
        ) : (
          <Tombol disabled={!bisaPeriksa} onClick={periksa}>
            Periksa
          </Tombol>
        )
      }
    >
      <p className="text-xl font-semibold">{item.tanya}</p>
      <div className="mt-4">
        {item.tipe === 'angka' ? (
          <InputAngka nilai={isian} onUbah={setIsian} label="Jawaban" disabled={sudahDijawab} />
        ) : (
          <div className="space-y-2">
            {item.pilihan.map((p, i) => (
              <button
                key={i}
                type="button"
                disabled={sudahDijawab}
                onClick={() => setPilih(i)}
                aria-pressed={pilih === i}
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
      {hasil && <UmpanBalik jenis={hasil.benar ? 'benar' : 'salah'}>{item.penjelasan}</UmpanBalik>}
    </Layar>
  )
}
