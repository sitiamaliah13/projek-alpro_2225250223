import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import PanelHint from '../PanelHint.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'
import { cekFungsi } from '../../lib/fungsi.js'

/** Target "satu_dua_pasangan": tepat satu anggota A punya dua pasangan, tidak ada yang tanpa pasangan. */
function nilaiTarget(target, A, pairs) {
  const h = cekFungsi(A, pairs)
  const multi = h.issues.filter((i) => i.tag === 'MULTI_PAIR')
  const kosong = h.issues.filter((i) => i.tag === 'NO_PAIR')
  if (target === 'satu_dua_pasangan') {
    if (multi.length === 1 && kosong.length === 0) return { benar: true }
    if (h.isFunction) return { benar: false, pesan: 'Relasimu masih fungsi. Beri **satu** anggota A dua panah.' }
    if (kosong.length > 0) {
      return { benar: false, pesan: `${kosong.map((i) => i.a).join(' dan ')} belum punya pasangan. Anggota lain harus punya satu pasangan.` }
    }
    return { benar: false, pesan: 'Ada lebih dari satu anggota A yang punya dua pasangan. Cukup **satu** saja.' }
  }
  if (target === 'fungsi') return h.isFunction ? { benar: true } : { benar: false, pesan: 'Relasimu belum fungsi.' }
  return { benar: false, pesan: 'Target soal tidak dikenal.' }
}

/** F6 Buat Diagramku: siswa mengonstruksi sendiri (GL01). */
export default function KartuBuat({ kartu, onSelesai }) {
  const [pairs, setPairs] = useState([])
  const [coba, setCoba] = useState(0)
  const [hint, setHint] = useState(0)
  const [hasil, setHasil] = useState(null)
  const selesai = hasil?.benar

  const periksa = () => {
    const percobaan = coba + 1
    setCoba(percobaan)
    const h = nilaiTarget(kartu.target, kartu.A, pairs)
    setHasil(h)
    if (h.benar) onSelesai({ correct: true, tries: percobaan, hints_used: hint })
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-3 rounded-2xl bg-white p-3">
        <DiagramPanah
          A={kartu.A}
          B={kartu.B}
          pairs={pairs}
          onUbah={
            selesai
              ? undefined
              : (p) => {
                  setPairs(p)
                  setHasil(null)
                }
          }
        />
      </div>
      {!selesai && (
        <Tombol className="mt-4" disabled={pairs.length === 0} onClick={periksa}>
          Periksa
        </Tombol>
      )}
      {hasil && (hasil.benar ? <UmpanBalik jenis="benar">{kartu.umpan.benar}</UmpanBalik> : <UmpanBalik jenis="salah">{hasil.pesan}</UmpanBalik>)}
      {!selesai && <PanelHint petunjuk={kartu.petunjuk} terbuka={hint} onBuka={() => setHint(hint + 1)} />}
      {!selesai && coba >= 2 && (
        <Tombol
          jenis="kedua"
          className="mt-3"
          onClick={() => {
            const contoh = [[kartu.A[0], kartu.B[0]], [kartu.A[0], kartu.B[1]], ...kartu.A.slice(1).map((a, i) => [a, kartu.B[i % kartu.B.length]])]
            setPairs(contoh)
            setHasil({ benar: true })
            onSelesai({ correct: false, tries: coba, hints_used: hint })
          }}
        >
          Lihat contoh jawaban
        </Tombol>
      )}
    </div>
  )
}
