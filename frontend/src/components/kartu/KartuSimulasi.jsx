import { useState } from 'react'
import Teks from '../Teks.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'
import { cekFungsi, pesanIsu } from '../../lib/fungsi.js'

/** F5 Simulasi Tarik Garis: penanda berubah langsung saat panah dibuat (IL01, GL01). */
export default function KartuSimulasi({ kartu, onSelesai }) {
  const [pairs, setPairs] = useState([])
  const hasil = cekFungsi(kartu.A, pairs)

  const ubah = (baru) => {
    setPairs(baru)
    if (cekFungsi(kartu.A, baru).isFunction) onSelesai()
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-3 rounded-2xl bg-white p-3">
        <DiagramPanah A={kartu.A} B={kartu.B} pairs={pairs} onUbah={ubah} tandai={pairs.length > 0} />
      </div>
      {pairs.length > 0 &&
        (hasil.isFunction ? (
          <UmpanBalik jenis="benar">Fungsi! Setiap anggota A punya tepat satu pasangan.</UmpanBalik>
        ) : (
          <UmpanBalik jenis="salah">
            {(hasil.issues.some((i) => i.tag === 'MULTI_PAIR') ? 'Bukan fungsi. ' : 'Belum lengkap. ') +
              hasil.issues.map(pesanIsu).join(' ')}
          </UmpanBalik>
        ))}
    </div>
  )
}
