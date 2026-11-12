import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Ikon from '../components/Ikon.jsx'
import { posttestTerbuka } from '../data/progres.js'
import { useProgres } from '../data/ProgresContext.jsx'

function KartuTes({ judul, ket, status, ke, aksi }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-domain">
        <Ikon nama="tes" className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{judul}</h3>
      <p className="mt-1 flex-1 text-muted">{ket}</p>
      {status === 'selesai' && (
        <span className="mt-4 flex min-h-tap items-center justify-center rounded-xl bg-green-50 font-semibold text-ok-ink">✓ Sudah dikirim</span>
      )}
      {status === 'terkunci' && (
        <span className="mt-4 flex min-h-tap items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-muted">
          🔒 Selesaikan semua modul dulu
        </span>
      )}
      {status === 'buka' && (
        <Link to={ke} className="mt-4 flex min-h-tap items-center justify-center rounded-xl bg-domain font-semibold text-white">
          {aksi} →
        </Link>
      )}
    </article>
  )
}

/** Menu "Pretest & Posttest" (+ Cek Bekal). Jawaban tes dinilai peneliti dengan rubrik, bukan otomatis. */
export default function Tes() {
  const { progres, siswa } = useProgres()
  const post = progres.posttest.done ? 'selesai' : posttestTerbuka(progres, siswa) ? 'buka' : 'terkunci'
  return (
    <AppShell judul="Pretest & Posttest">
      <h2 className="text-xl font-bold">Tes Literasi Matematis</h2>
      <p className="mb-4 mt-1 text-muted">Masing-masing 5 soal cerita, sekitar 60 menit. Dikerjakan di kelas.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <KartuTes judul="Pretest" ket="Dikerjakan sebelum belajar." status={progres.pretest.done ? 'selesai' : 'buka'} ke="/pretest" aksi="Kerjakan Pretest" />
        <KartuTes
          judul="Cek Bekal"
          ket="6 soal singkat himpunan dan bilangan bulat."
          status={progres.diagnostic.done ? 'selesai' : 'buka'}
          ke="/cek-bekal"
          aksi="Mulai Cek Bekal"
        />
        <KartuTes judul="Posttest" ket="Dikerjakan setelah semua modul selesai." status={post} ke="/posttest" aksi="Kerjakan Posttest" />
      </div>
    </AppShell>
  )
}
