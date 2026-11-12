import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Layar from '../components/Layar.jsx'
import Tombol from '../components/Tombol.jsx'
import UmpanBalik from '../components/UmpanBalik.jsx'
import KartuTeks from '../components/kartu/KartuTeks.jsx'
import KartuSimulasi from '../components/kartu/KartuSimulasi.jsx'
import KartuSoal from '../components/kartu/KartuSoal.jsx'
import KartuBuat from '../components/kartu/KartuBuat.jsx'
import KartuContoh from '../components/kartu/KartuContoh.jsx'
import KartuRumpang from '../components/kartu/KartuRumpang.jsx'
import KartuJelaskan from '../components/kartu/KartuJelaskan.jsx'
import KartuRefleksi from '../components/kartu/KartuRefleksi.jsx'
import KartuRingkasan from '../components/kartu/KartuRingkasan.jsx'
import KartuJembatan from '../components/kartu/KartuJembatan.jsx'
import KartuIsian from '../components/kartu/KartuIsian.jsx'
import KartuSubstitusi from '../components/kartu/KartuSubstitusi.jsx'
import KartuRumus from '../components/kartu/KartuRumus.jsx'
import KartuMesin from '../components/kartu/KartuMesin.jsx'
import KartuSorot from '../components/kartu/KartuSorot.jsx'
import KartuLiterasi from '../components/kartu/KartuLiterasi.jsx'
import { ambilPelajaran } from '../data/konten.js'
import { useProgres } from '../data/ProgresContext.jsx'

const KARTU = {
  teks: KartuTeks,
  simulasi: KartuSimulasi,
  soal: KartuSoal,
  buat: KartuBuat,
  contoh: KartuContoh,
  rumpang: KartuRumpang,
  jelaskan: KartuJelaskan,
  refleksi: KartuRefleksi,
  ringkasan: KartuRingkasan,
  jembatan: KartuJembatan, // M4 (F7)
  isian: KartuIsian,
  substitusi: KartuSubstitusi, // M5 (F8)
  rumus: KartuRumus, // M6 (F12 Cek Balik)
  mesin: KartuMesin, // Mesin Fungsi 3D (F17)
  sorot: KartuSorot, // M2 sorot range (IL02)
  literasi: KartuLiterasi, // M7 soal 4 langkah (F13)
}
const TANPA_INTERAKSI = new Set(['teks', 'ringkasan'])
/** Latihan yang dihitung untuk bintang dan dicatat sebagai attempts. */
const termasukLatihan = (k) =>
  ((k.type === 'soal' || k.type === 'buat') && k.latihan !== false) || k.latihan === true

/** Bintang 1–3: latihan benar pada percobaan pertama tanpa petunjuk (design.md §7). */
function hitungBintang(kartu, hasil) {
  const latihan = kartu.filter(termasukLatihan)
  if (latihan.length === 0) return 3
  const mulus = latihan.filter((k) => {
    const h = hasil[k.id]
    return h?.correct && h.tries === 1 && h.hints_used === 0
  }).length
  if (mulus === latihan.length) return 3
  if (mulus >= latihan.length / 2) return 2
  return 1
}

/**
 * Pelajaran berpola 8 langkah tetap (design.md §3). Siswa mengatur tempo sendiri:
 * tidak ada perpindahan otomatis (A5). Tombol Lanjut aktif setelah aktivitas layar selesai.
 */
export default function Pelajaran() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { ubah } = useProgres()
  const pelajaran = ambilPelajaran(id)
  const [cari] = useSearchParams()
  // ?mulai=n dari menu Latihan Interaktif: langsung ke layar latihan pertama
  const [ke, setKe] = useState(() => {
    const n = Number(cari.get('mulai') ?? 0)
    return pelajaran && Number.isInteger(n) && n >= 0 && n < pelajaran.cards.length ? n : 0
  })
  const [selesai, setSelesai] = useState({}) // indeks kartu → true
  const [hasil, setHasil] = useState({}) // item_id → hasil latihan pertama

  if (!pelajaran) {
    return (
      <Layar judul="Pelajaran" kembali="/peta">
        <UmpanBalik jenis="info">Materi ini belum tersedia.</UmpanBalik>
      </Layar>
    )
  }

  const kartu = pelajaran.cards[ke]
  const Komponen = KARTU[kartu.type]
  const terakhir = ke === pelajaran.cards.length - 1
  const bolehLanjut = TANPA_INTERAKSI.has(kartu.type) || selesai[ke]

  const onSelesai = (h) => {
    if (selesai[ke]) return // hanya catat penyelesaian pertama
    setSelesai((s) => ({ ...s, [ke]: true }))
    const ts = new Date().toISOString()
    if (termasukLatihan(kartu) && h) {
      setHasil((lama) => ({ ...lama, [kartu.id]: h }))
      ubah((p) => {
        p.attempts.push({ item_id: kartu.id, error_tag: null, ...h, ts })
      })
    } else if (kartu.type === 'jelaskan' && h) {
      ubah((p) => {
        p.explanations.push({ item_id: kartu.id, ...h, ts })
      })
    } else if (kartu.type === 'refleksi' && h) {
      ubah((p) => {
        p.loads.push({ lesson_id: pelajaran.id, rating: h.rating, ts })
      })
    }
  }

  const tamat = () => {
    const stars = hitungBintang(pelajaran.cards, hasil)
    ubah((p) => {
      const lama = p.lessons[pelajaran.id]
      p.lessons[pelajaran.id] = {
        done: true,
        stars: Math.max(stars, lama?.stars ?? 0),
        completedAt: new Date().toISOString(),
      }
    })
    navigate('/peta')
  }

  return (
    <Layar
      judul={pelajaran.title}
      kembali="/peta"
      bawah={
        <div className="flex gap-2">
          {ke > 0 && (
            <Tombol jenis="kedua" onClick={() => setKe(ke - 1)}>
              Sebelumnya
            </Tombol>
          )}
          <Tombol disabled={!bolehLanjut} onClick={terakhir ? tamat : () => setKe(ke + 1)}>
            {terakhir ? 'Selesai' : 'Lanjut'}
          </Tombol>
        </div>
      }
    >
      {/* Posisi ditulis dengan teks, tidak hanya titik warna (design.md §8) */}
      <p className="text-base text-muted">
        {kartu.tahap} · Layar {ke + 1} dari {pelajaran.cards.length}
      </p>
      <h2 className="mb-3 text-xl font-bold">{kartu.judul}</h2>
      {/* key memastikan setiap layar mulai dari keadaan bersih */}
      <Komponen key={ke} kartu={kartu} onSelesai={onSelesai} lencana={pelajaran.lencana} />
    </Layar>
  )
}
