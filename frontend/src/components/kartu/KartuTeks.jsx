import Teks from '../Teks.jsx'
import DiagramPanah from '../diagram/DiagramPanah.jsx'

/** Kartu analogi/konsep: ≤ 3 kalimat + satu visual utama (A1, A2). */
export default function KartuTeks({ kartu }) {
  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-3">
          {t}
        </Teks>
      ))}
      {kartu.diagram && (
        <div className="mt-4 rounded-2xl bg-white p-3">
          <DiagramPanah
            A={kartu.diagram.A}
            B={kartu.diagram.B}
            pairs={kartu.diagram.pairs}
            tandai={kartu.diagram.tandai}
            sorotB={kartu.diagram.sorotB}
          />
        </div>
      )}
    </div>
  )
}
