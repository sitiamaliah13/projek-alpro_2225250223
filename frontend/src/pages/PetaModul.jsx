import AppShell from '../components/AppShell.jsx'
import UmpanBalik from '../components/UmpanBalik.jsx'
import StudyTime from '../components/StudyTime.jsx'
import HeroBanner from '../components/dashboard/HeroBanner.jsx'
import GridModul from '../components/dashboard/GridModul.jsx'
import KartuEvaluasi from '../components/dashboard/KartuEvaluasi.jsx'
import { modulBeranda, tautanModul } from '../data/konten.js'
import { statusModul } from '../data/progres.js'
import { useProgres } from '../data/ProgresContext.jsx'

/** Beranda (dashboard): Study Time, Hero Banner, grid modul 01–07, kartu tes literasi. */
export default function PetaModul() {
  const { siswa, progres } = useProgres()
  const selesai = modulBeranda.filter((m) => statusModul(m, progres).done).length
  const berikut = modulBeranda.find((m) => !statusModul(m, progres).done)
  const persen = Math.round((selesai / modulBeranda.length) * 100)

  return (
    <AppShell judul={`Halo, ${siswa.nama ?? 'Teman'}!`}>
      <div className="space-y-6">
        <StudyTime />

        <HeroBanner
          ke={berikut ? tautanModul(berikut) : '/tes'}
          labelLanjut={selesai === 0 ? 'Mulai Belajar' : berikut ? `Lanjut: ${berikut.title}` : 'Ke Tes Literasi'}
        />

        {progres.diagnostic.penguatanTanda && (
          <UmpanBalik jenis="info">Saran: perhatikan tanda bilangan negatif (warna ungu) di modul Nilai Fungsi.</UmpanBalik>
        )}

        <section aria-labelledby="judul-modul">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 id="judul-modul" className="text-xl font-bold">
              Materi Belajar
            </h2>
            <p className="text-muted">
              {selesai} dari {modulBeranda.length} bagian selesai
            </p>
          </div>
          {/* Progres ditulis dengan angka dan batang diam (tanpa animasi) */}
          <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={persen} aria-valuemin={0} aria-valuemax={100} aria-label="Progres belajar">
            <div className="h-full rounded-full bg-codomain" style={{ width: `${persen}%` }} />
          </div>
          <GridModul progres={progres} />
        </section>

        <KartuEvaluasi progres={progres} siswa={siswa} />
      </div>
    </AppShell>
  )
}
