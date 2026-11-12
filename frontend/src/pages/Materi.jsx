import AppShell from '../components/AppShell.jsx'
import GridModul from '../components/dashboard/GridModul.jsx'
import { useProgres } from '../data/ProgresContext.jsx'

/** Menu "Materi Belajar": semua modul dari awal (analogi → konsep → contoh → latihan). */
export default function Materi() {
  const { progres } = useProgres()
  return (
    <AppShell judul="Materi Belajar">
      <h2 className="text-xl font-bold">Materi Belajar</h2>
      <p className="mb-4 mt-1 text-muted">Kerjakan berurutan dari 01. Setiap materi berisi 8–17 layar pendek.</p>
      <GridModul progres={progres} />
    </AppShell>
  )
}
