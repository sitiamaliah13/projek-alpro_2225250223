import { useState } from 'react'
import SkalaBeban from '../SkalaBeban.jsx'
import UmpanBalik from '../UmpanBalik.jsx'

/** F16 Refleksi beban kognitif + saran adaptif sederhana (architecture.md §5). */
export default function KartuRefleksi({ onSelesai }) {
  const [nilai, setNilai] = useState(null)

  const pilih = (n) => {
    setNilai(n)
    onSelesai({ rating: n })
  }

  return (
    <div>
      <p className="mb-4 font-semibold">Seberapa berat usahamu belajar bagian ini?</p>
      <SkalaBeban nilai={nilai} onPilih={pilih} />
      {nilai !== null && nilai >= 7 && (
        <UmpanBalik jenis="info">Bagian ini terasa berat. Kamu boleh kembali ke contoh lengkap dan mengulanginya.</UmpanBalik>
      )}
      {nilai !== null && nilai <= 3 && <UmpanBalik jenis="benar">Bagus! Kamu siap lanjut ke modul berikutnya.</UmpanBalik>}
      {nilai !== null && nilai > 3 && nilai < 7 && <UmpanBalik jenis="info">Terima kasih. Jawabanmu sudah dicatat.</UmpanBalik>}
    </div>
  )
}
