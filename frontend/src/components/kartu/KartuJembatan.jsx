import { useState } from 'react'
import Teks from '../Teks.jsx'
import Bilangan from '../Bilangan.jsx'
import TabelFungsi from '../TabelFungsi.jsx'
import GrafikTitik from '../GrafikTitik.jsx'
import PertanyaanSingkat from '../PertanyaanSingkat.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'
import { formatBilangan } from '../../lib/aljabar.js'

/**
 * F7 Jembatan Representasi (IL04, EL04, A6): SATU data yang sama ditampilkan dalam 6 tahap,
 * satu tahap per layar. x selalu biru dan f(x) selalu teal di setiap tahap (design.md §4.2).
 */
export const TAHAP_JEMBATAN = ['Diagram panah', 'Pasangan berurutan', 'Tabel', 'Pola', 'Rumus', 'Grafik']

function PenandaTahap({ tahap }) {
  return (
    <ol className="mb-4 grid grid-cols-3 gap-1" aria-label={`Tahap ${tahap} dari 6`}>
      {TAHAP_JEMBATAN.map((nama, i) => {
        const ke = i + 1
        const kini = ke === tahap
        return (
          <li
            key={nama}
            aria-current={kini ? 'step' : undefined}
            className={`rounded-lg border-2 px-1 py-1 text-center text-base ${
              kini ? 'border-domain bg-white font-bold' : ke < tahap ? 'border-slate-300 bg-white' : 'border-dashed border-slate-300'
            }`}
          >
            {ke < tahap ? '✓ ' : `${ke}. `}
            {nama}
          </li>
        )
      })}
    </ol>
  )
}

export default function KartuJembatan({ kartu, onSelesai }) {
  const { a, b } = kartu.fungsi
  const titik = kartu.domain.map((x) => [x, a * x + b])
  const [terpilih, setTerpilih] = useState(null)

  let visual
  switch (kartu.ke) {
    case 1:
      visual = (
        <div className="rounded-2xl bg-white p-3">
          <DiagramPanah A={kartu.domain} B={titik.map(([, y]) => y)} pairs={titik} judulA="x" judulB="f(x)" />
        </div>
      )
      break
    case 2:
      visual = (
        <p className="rounded-2xl bg-white p-4 text-xl" aria-label="Himpunan pasangan berurutan">
          {'{ '}
          {titik.map(([x, y], i) => (
            <span key={x}>
              {i > 0 && ', '}(<Bilangan nilai={x} peran="x" />, {kartu.kosong?.includes(x) ? <strong>?</strong> : <Bilangan nilai={y} peran="fx" />})
            </span>
          ))}
          {' }'}
        </p>
      )
      break
    case 3:
      visual = <TabelFungsi titik={titik} kosong={kartu.kosong ?? []} sorot={kartu.sorot ?? []} />
      break
    case 4:
      visual = <TabelFungsi titik={titik} selisih />
      break
    case 5:
      visual = (
        <div>
          <TabelFungsi titik={[[0, b], ...titik]} kosong={[0]} sorot={[0]} />
          <p className="mt-3 rounded-2xl bg-white p-3 text-center text-xl">
            f(<span className="font-bold text-domain">x</span>) = <strong>{formatBilangan(a)}</strong>
            <span className="font-bold text-domain">x</span> + <strong>?</strong>
          </p>
        </div>
      )
      break
    default:
      visual = (
        <div>
          <GrafikTitik titik={titik} terpilih={terpilih} onPilih={setTerpilih} />
          <p className="mt-1 text-base text-muted">Ketuk titik untuk melihat koordinatnya.</p>
        </div>
      )
  }

  return (
    <div>
      <PenandaTahap tahap={kartu.ke} />
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-2">{visual}</div>
      <PertanyaanSingkat tanya={kartu.tanya} onSelesai={onSelesai} />
    </div>
  )
}
