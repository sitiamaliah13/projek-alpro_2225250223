import Teks from '../Teks.jsx'
import Substitusi from '../aljabar/Substitusi.jsx'

/** M5: menghitung nilai fungsi dengan Penanda Tanda (F8). */
export default function KartuSubstitusi({ kartu, onSelesai }) {
  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      <div className="mt-3">
        <Substitusi a={kartu.a} b={kartu.b} x={kartu.x} petunjuk={kartu.petunjuk} onSelesai={onSelesai} />
      </div>
    </div>
  )
}
