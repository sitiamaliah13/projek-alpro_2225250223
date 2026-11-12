import { lazy, Suspense, useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import Bilangan from '../Bilangan.jsx'
import BatasGalat from '../BatasGalat.jsx'
import MesinFungsiStatis from '../three/MesinFungsiStatis.jsx'
import { usePengaturan3D } from '../../data/usePengaturan3D.js'
import { formatBilangan } from '../../lib/aljabar.js'

// Three.js hanya diunduh saat kartu ini dibuka dan 3D menyala (agents.md aturan 5).
const MesinFungsi3D = lazy(() => import('../../three/MesinFungsi3D.jsx'))

function teksAturan(a, b) {
  if (b === 0) return `× ${formatBilangan(a)}`
  return `× ${formatBilangan(a)}, lalu ${b < 0 ? '−' : '+'} ${formatBilangan(Math.abs(b))}`
}

/**
 * Mesin Fungsi (F17): siswa memilih x, lalu mengetuk untuk memprosesnya. Tidak ada gerak otomatis (EL03, A5).
 * Sakelar "Matikan 3D" selalu tersedia; versi statis punya isi dan interaksi yang sama.
 */
export default function KartuMesin({ kartu, onSelesai }) {
  const { a, b } = kartu
  const { aktif, setAktif, kualitas } = usePengaturan3D()
  const [x, setX] = useState(kartu.pilihanX[0])
  const [tahap, setTahap] = useState(0)
  const aturan = teksAturan(a, b)
  const kali = a * x
  const fx = kali + b

  const statis = <MesinFungsiStatis aturan={aturan} x={x} fx={fx} tahap={tahap} />

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}

      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setAktif(!aktif)}
          aria-pressed={!aktif}
          className="min-h-tap rounded-xl border-2 border-slate-300 bg-white px-3 font-semibold"
        >
          {aktif ? '🧊 Matikan 3D' : '🧊 Nyalakan 3D'}
        </button>
      </div>

      {aktif ? (
        <BatasGalat cadangan={statis}>
          <Suspense fallback={statis}>
            <MesinFungsi3D aturan={aturan} x={x} fx={fx} tahap={tahap} kualitas={kualitas} />
          </Suspense>
        </BatasGalat>
      ) : (
        statis
      )}

      {/* Penjelasan teks selalu ada, sama untuk 3D maupun statis */}
      <div className="mt-3 rounded-2xl bg-white p-3" aria-live="polite">
        {tahap === 0 && <p>Pilih x, lalu ketuk “Masukkan”.</p>}
        {tahap >= 1 && (
          <p>
            <Bilangan nilai={a} /> × <Bilangan nilai={x} kurung /> = <Bilangan nilai={kali} />
          </p>
        )}
        {tahap === 2 && (
          <p>
            <Bilangan nilai={kali} /> {b < 0 ? '−' : '+'} <Bilangan nilai={Math.abs(b)} /> = <Bilangan nilai={fx} />. Jadi f(
            <Bilangan nilai={x} />) = <Bilangan nilai={fx} />.
          </p>
        )}
      </div>

      <fieldset className="mt-3" disabled={tahap === 1}>
        <legend className="font-semibold">Pilih x:</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {kartu.pilihanX.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={x === n}
              onClick={() => {
                setX(n)
                setTahap(0)
              }}
              className={`min-h-tap min-w-tap rounded-xl border-2 bg-white px-3 text-lg ${x === n ? 'border-domain' : 'border-slate-300'}`}
            >
              <Bilangan nilai={n} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-3">
        {tahap === 0 && <Tombol onClick={() => setTahap(1)}>Masukkan</Tombol>}
        {tahap === 1 && (
          <Tombol
            onClick={() => {
              setTahap(2)
              onSelesai?.()
            }}
          >
            Proses
          </Tombol>
        )}
        {tahap === 2 && (
          <Tombol jenis="kedua" onClick={() => setTahap(0)}>
            Coba x lain
          </Tombol>
        )}
      </div>
    </div>
  )
}
