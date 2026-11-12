import { Link } from 'react-router-dom'
import LembarTes from '../components/LembarTes.jsx'
import Layar from '../components/Layar.jsx'
import UmpanBalik from '../components/UmpanBalik.jsx'
import { posttestTerbuka } from '../data/progres.js'
import { useProgres } from '../data/ProgresContext.jsx'

/** Posttest paralel. Terkunci sampai semua modul yang tersedia selesai (api.md §6). */
export default function Posttest() {
  const { progres, siswa } = useProgres()
  if (!posttestTerbuka(progres, siswa)) {
    return (
      <Layar judul="Posttest" kembali="/peta">
        <UmpanBalik jenis="info">🔒 Posttest terbuka setelah semua modul selesai.</UmpanBalik>
        <Link to="/peta" className="mt-4 inline-flex min-h-tap items-center font-semibold text-domain underline">
          Kembali ke Peta Belajar
        </Link>
      </Layar>
    )
  }
  return <LembarTes jenis="post" ruteSelesai="/peta" />
}
