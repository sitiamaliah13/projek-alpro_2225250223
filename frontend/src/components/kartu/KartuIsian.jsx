import Teks from '../Teks.jsx'
import TabelFungsi from '../TabelFungsi.jsx'
import PertanyaanSingkat from '../PertanyaanSingkat.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'

/** Soal latihan pendek (angka/pilihan) dengan visual opsional: tabel atau diagram. */
export default function KartuIsian({ kartu, onSelesai }) {
  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      {kartu.tabel && <TabelFungsi titik={kartu.tabel} kosong={kartu.kosong ?? []} />}
      {kartu.diagram && (
        <div className="rounded-2xl bg-white p-3">
          <DiagramPanah A={kartu.diagram.A} B={kartu.diagram.B} pairs={kartu.diagram.pairs} judulA="x" judulB="f(x)" />
        </div>
      )}
      <PertanyaanSingkat tanya={kartu.tanya} onSelesai={onSelesai} />
    </div>
  )
}
