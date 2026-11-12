import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'

/** Contoh lengkap: langkah muncul satu per satu saat diketuk (worked example, A5). */
export default function KartuContoh({ kartu, onSelesai }) {
  const [tampil, setTampil] = useState(0)
  const semua = tampil >= kartu.langkah.length

  const berikut = () => {
    const n = tampil + 1
    setTampil(n)
    if (n >= kartu.langkah.length) onSelesai()
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      {kartu.diagram && (
        <div className="mt-3 rounded-2xl bg-white p-3">
          <DiagramPanah A={kartu.diagram.A} B={kartu.diagram.B} pairs={kartu.diagram.pairs} />
        </div>
      )}
      <ol className="mt-4 space-y-2">
        {kartu.langkah.slice(0, tampil).map((l, i) => (
          <li key={i} className="rounded-xl bg-white px-4 py-2">
            <Teks as="span">{l}</Teks>
          </li>
        ))}
      </ol>
      {!semua && (
        <Tombol jenis="kedua" className="mt-3" onClick={berikut}>
          Tampilkan langkah {tampil + 1} dari {kartu.langkah.length}
        </Tombol>
      )}
    </div>
  )
}
