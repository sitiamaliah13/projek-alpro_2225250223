import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import PanelHint from '../PanelHint.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'
import { cekFungsi } from '../../lib/fungsi.js'

const sama = (p, q) => String(p) === String(q)

/**
 * M2 "Ketuk untuk menyorot" (IL02, IL03): siswa memilih anggota B yang termasuk range.
 * Pilihan langsung tampak berlatar range (#CCFBF1) di diagram. Kesalahan khas: memasukkan
 * anggota kodomain tanpa panah (TERM_SWAP, api.md).
 */
export default function KartuSorot({ kartu, onSelesai }) {
  const { A, B, pairs } = kartu.diagram
  const range = cekFungsi(A, pairs).range
  const [pilih, setPilih] = useState([])
  const [coba, setCoba] = useState(0)
  const [hint, setHint] = useState(0)
  const [hasil, setHasil] = useState(null)
  const [tagPertama, setTagPertama] = useState(null)
  const selesai = hasil?.benar

  const toggle = (b) => {
    setHasil(null)
    setPilih((p) => (p.some((x) => sama(x, b)) ? p.filter((x) => !sama(x, b)) : [...p, b]))
  }

  const periksa = () => {
    const n = coba + 1
    setCoba(n)
    const lebih = pilih.filter((b) => !range.some((r) => sama(r, b)))
    const kurang = range.filter((r) => !pilih.some((b) => sama(b, r)))
    if (lebih.length === 0 && kurang.length === 0) {
      setHasil({ benar: true })
      onSelesai({ correct: n === 1 && !tagPertama, tries: n, hints_used: hint, error_tag: tagPertama })
      return
    }
    if (lebih.length > 0) {
      if (!tagPertama) setTagPertama('TERM_SWAP')
      setHasil({ benar: false, pesan: `${lebih.join(' dan ')} tidak terkena panah. Range hanya anggota B yang **terkena panah**.` })
    } else {
      setHasil({ benar: false, pesan: `Masih ada anggota B yang terkena panah, yaitu ${kurang.join(' dan ')}.` })
    }
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-3 rounded-2xl bg-white p-3">
        <DiagramPanah A={A} B={B} pairs={pairs} sorotB={pilih} />
      </div>
      <fieldset className="mt-3" disabled={selesai}>
        <legend className="font-semibold">Ketuk anggota range:</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {B.map((b) => {
            const dipilih = pilih.some((x) => sama(x, b))
            return (
              <button
                key={b}
                type="button"
                aria-pressed={dipilih}
                onClick={() => toggle(b)}
                className={`min-h-tap min-w-tap rounded-xl border-2 px-3 text-lg font-bold ${
                  dipilih ? 'border-codomain bg-range' : 'border-slate-300 bg-white'
                }`}
              >
                {dipilih ? '✓ ' : ''}
                {b}
              </button>
            )
          })}
        </div>
      </fieldset>
      {!selesai && (
        <Tombol className="mt-3" disabled={pilih.length === 0} onClick={periksa}>
          Periksa
        </Tombol>
      )}
      {hasil &&
        (hasil.benar ? (
          <UmpanBalik jenis="benar">{`Tepat! Range = {${range.join(', ')}}.`}</UmpanBalik>
        ) : (
          <UmpanBalik jenis="salah">{hasil.pesan}</UmpanBalik>
        ))}
      {!selesai && <PanelHint petunjuk={kartu.petunjuk ?? []} terbuka={hint} onBuka={() => setHint(hint + 1)} />}
    </div>
  )
}
