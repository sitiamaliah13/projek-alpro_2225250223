import AppShell from '../components/AppShell.jsx'
import MediatorRmt from '../components/MediatorRmt.jsx'
import { useProgres } from '../data/ProgresContext.jsx'

const KONTEKS = {
  judul: 'Tanya bebas tentang materi',
  isi: ['Siswa bertanya bebas tentang materi Relasi dan Fungsi (pemetaan) kelas VIII. Ini bukan soal latihan.'],
}

const SARAN = [
  'Apa bedanya relasi dan fungsi?',
  'Apa itu domain, kodomain, dan range?',
  'Bagaimana cara menyusun rumus fungsi dari tabel?',
]

/**
 * Menu "Tanya AI": siswa bertanya bebas tentang materi kepada Mediator RMT (RMT-3).
 * Halaman terpisah dari pelajaran agar layar soal tetap fokus (A2). Dibatasi 50 pertanyaan per kunjungan.
 */
export default function TanyaMateri() {
  const { siswa, ubah } = useProgres()
  const catat = () =>
    ubah((p) => {
      ;(p.mediator ??= []).push({ lesson_id: 'tanya', card: null, ts: new Date().toISOString() })
    })

  return (
    <AppShell judul="Tanya AI">
      <h2 className="text-xl font-bold">Tanya AI tentang Materi</h2>
      <p className="mt-1 text-muted">
        Tanyakan apa saja tentang relasi dan fungsi. Mediator akan menjelaskan singkat, lalu mengajakmu berpikir.
      </p>
      <MediatorRmt
        kartu={KONTEKS}
        rmt={{ fase: { nama: 'Tanya bebas tentang materi' }, fungsi: { nama: 'Mendefinisikan masalah' } }}
        token={siswa?.token}
        onPakai={catat}
        selaluBuka
        batas={50}
        saran={SARAN}
      />
      <p className="mt-3 text-base text-muted">Jangan menulis nama lengkap atau data pribadi di sini.</p>
    </AppShell>
  )
}
