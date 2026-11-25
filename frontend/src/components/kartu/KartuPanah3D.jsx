import { lazy, Suspense, useEffect, useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import BatasGalat from '../BatasGalat.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'
import { usePengaturan3D } from '../../data/usePengaturan3D.js'
import { cekFungsi, pesanIsu } from '../../lib/fungsi.js'

// Three.js hanya diunduh saat kartu ini dibuka dan 3D menyala (agents.md aturan 5).
const DiagramPanah3D = lazy(() => import('../../three/DiagramPanah3D.jsx'))

/**
 * Jelajah diagram panah 3D (IL01, IL02, GL01, RMT Fase I: alat berpikir).
 * Siswa memilih contoh (fungsi / bukan fungsi), memutar diagram, dan menelusuri panah satu per satu.
 * Status fungsi dihitung dengan cekFungsi (logika yang sama dengan latihan), bukan ditulis manual.
 * Sakelar "Matikan 3D" selalu tersedia; versi 2D memuat isi yang sama.
 */
export default function KartuPanah3D({ kartu, onSelesai }) {
  const { aktif, setAktif, kualitas } = usePengaturan3D()
  const [pilih, setPilih] = useState(0)
  const [telusur, setTelusur] = useState(null)
  const [ulang, setUlang] = useState(0)
  const [dilihat, setDilihat] = useState(() => new Set([0]))

  // Satu contoh saja: langsung dianggap selesai dilihat.
  useEffect(() => {
    if (kartu.contoh.length <= 1) onSelesai?.()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const contoh = kartu.contoh[pilih]
  const hasil = cekFungsi(contoh.A, contoh.pairs)
  const masalah = hasil.issues.filter((x) => x.a !== undefined).map((x) => x.a)
  const sorotRange = Boolean(kartu.sorotRange)

  const gantiContoh = (i) => {
    setPilih(i)
    setTelusur(null)
    const baru = new Set(dilihat).add(i)
    setDilihat(baru)
    if (baru.size === kartu.contoh.length) onSelesai?.()
  }

  const telusuri = () => {
    const n = contoh.pairs.length
    setTelusur((t) => (t === null ? 0 : (t + 1) % n))
    setUlang((u) => u + 1)
  }

  const duaD = (
    <div className="rounded-2xl bg-white p-3">
      <DiagramPanah A={contoh.A} B={contoh.B} pairs={contoh.pairs} tandai sorotB={sorotRange ? hasil.range : []} />
    </div>
  )

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}

      <div className="mb-2 flex flex-wrap gap-2" role="tablist" aria-label="Pilih contoh">
        {kartu.contoh.map((c, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === pilih}
            onClick={() => gantiContoh(i)}
            className={`min-h-tap rounded-xl border-2 px-3 font-semibold ${i === pilih ? 'border-brand bg-brand-pale text-brand' : 'border-slate-300 bg-white'}`}
          >
            {dilihat.has(i) && i !== pilih ? '✓ ' : ''}
            {c.label}
          </button>
        ))}
      </div>

      {aktif ? (
        <>
          <BatasGalat cadangan={duaD}>
            <Suspense fallback={duaD}>
              <DiagramPanah3D
                A={contoh.A}
                B={contoh.B}
                pairs={contoh.pairs}
                sorotRange={sorotRange}
                masalah={masalah}
                telusur={telusur}
                ulang={ulang}
                kualitas={kualitas}
              />
            </Suspense>
          </BatasGalat>
          <p className="mt-1 text-base text-muted">Geser gambar untuk memutar. Cubit untuk memperbesar.</p>
        </>
      ) : (
        duaD
      )}

      <div className="mt-2 flex gap-2">
        <Tombol jenis="kedua" onClick={telusuri}>
          {telusur === null ? '▶ Telusuri panah' : '▶ Panah berikutnya'}
        </Tombol>
        <button
          type="button"
          onClick={() => setAktif(!aktif)}
          aria-pressed={!aktif}
          className="min-h-tap shrink-0 rounded-xl border-2 border-slate-300 bg-white px-3 font-semibold"
        >
          {aktif ? 'Matikan 3D' : 'Nyalakan 3D'}
        </button>
      </div>
      {telusur !== null && (
        <p className="mt-2 font-semibold" role="status">
          Panah {telusur + 1} dari {contoh.pairs.length}: {String(contoh.pairs[telusur][0])} → {String(contoh.pairs[telusur][1])}
        </p>
      )}

      <UmpanBalik jenis={hasil.isFunction ? 'benar' : 'info'}>
        {hasil.isFunction
          ? 'Ini fungsi. Setiap anggota A punya tepat satu pasangan.'
          : `Ini bukan fungsi. ${hasil.issues.map(pesanIsu).join(' ')}`}
        {sorotRange && ` Range (★) = {${hasil.range.join(', ')}}.`}
      </UmpanBalik>

      {dilihat.size < kartu.contoh.length && (
        <p className="mt-2 text-muted">Buka semua contoh untuk lanjut ({dilihat.size} dari {kartu.contoh.length}).</p>
      )}
    </div>
  )
}
