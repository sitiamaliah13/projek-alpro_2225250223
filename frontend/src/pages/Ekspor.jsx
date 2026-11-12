import AppShell from '../components/AppShell.jsx'
import Ikon from '../components/Ikon.jsx'
import StatusOffline from '../components/StatusOffline.jsx'
import { useState } from 'react'
import { MODE_ARTIFACT, teksEkspor, unduhData } from '../data/ekspor.js'
import { usePengaturan3D } from '../data/usePengaturan3D.js'
import { useProgres } from '../data/ProgresContext.jsx'

// Status salinan di server (Tahap 2). Tanpa kode siswa, data hanya ada di HP.
const STATUS_SINKRON = {
  lokal: 'Belum memakai kode siswa. Data hanya ada di perangkat ini.',
  tertunda: '⏳ Menunggu internet untuk mengirim ke server.',
  mengirim: '⏳ Mengirim ke server…',
  tersimpan: '✓ Sudah tersimpan di server.',
  'perlu-masuk': 'Sesi kode siswa habis. Keluar, lalu masuk lagi dengan kode.',
}

/** Menu "Ekspor Data": unduh data untuk peneliti + pengaturan perangkat. */
export default function Ekspor() {
  const { siswa, progres, keluar, statusSinkron } = useProgres()
  const { aktif: aktif3D, setAktif: setAktif3D } = usePengaturan3D()
  const [teks, setTeks] = useState('')
  const [pesan, setPesan] = useState('')
  const ringkas = [
    ['Pelajaran selesai', Object.values(progres.lessons).filter((l) => l.done).length],
    ['Jawaban latihan', progres.attempts.length],
    ['Penjelasan ditulis', progres.explanations.length],
    ['Rating beban', progres.loads.length],
  ]

  return (
    <AppShell judul="Ekspor Data & Pengaturan">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Ekspor data (untuk peneliti)</h2>
          <p className="mt-1 text-muted">Data tersimpan di perangkat ini. Ekspor tidak menyertakan nama panggilan.</p>
          <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-base" role="status">
            {STATUS_SINKRON[statusSinkron] ?? STATUS_SINKRON.lokal}
          </p>
          {siswa?.kodeServer && (
            <p className="mt-2 rounded-xl bg-brand-pale px-3 py-2 text-base">
              Kode siswamu: <strong className="tracking-wider">{siswa.kodeServer}</strong>. Pakai kode ini untuk lanjut di HP lain.
            </p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-2">
            {ringkas.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-base text-muted">{k}</dt>
                <dd className="text-xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          {MODE_ARTIFACT ? (
            <>
              <button
                type="button"
                onClick={() => {
                  const isi = teksEkspor(siswa, progres)
                  setTeks(isi)
                  navigator.clipboard
                    ?.writeText(isi)
                    .then(() => setPesan('✓ Data tersalin. Tempel di Notepad atau WhatsApp, lalu simpan.'))
                    .catch(() => setPesan('Salin otomatis tidak tersedia. Pilih semua teks di bawah, lalu salin.'))
                }}
                className="mt-4 flex min-h-tap w-full items-center justify-center gap-2 rounded-xl bg-domain font-semibold text-white"
              >
                <Ikon nama="ekspor" /> Salin data (JSON)
              </button>
              {pesan && (
                <p className="mt-2" role="status">
                  {pesan}
                </p>
              )}
              {teks && (
                <textarea
                  id="teks-ekspor"
                  readOnly
                  value={teks}
                  onFocus={(e) => e.target.select()}
                  rows={6}
                  aria-label="Data ekspor dalam format JSON"
                  className="mt-2 w-full rounded-xl border-2 border-slate-300 p-3 font-mono text-base"
                />
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => unduhData(siswa, progres)}
              className="mt-4 flex min-h-tap w-full items-center justify-center gap-2 rounded-xl bg-domain font-semibold text-white"
            >
              <Ikon nama="ekspor" /> Unduh data (JSON)
            </button>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Pengaturan</h2>
          <div className="mt-2">
            <StatusOffline />
          </div>
          <label className="mt-3 flex min-h-tap items-center gap-3">
            <input type="checkbox" checked={!aktif3D} onChange={(e) => setAktif3D(!e.target.checked)} className="h-6 w-6" />
            <span>Matikan 3D (pakai gambar datar, lebih ringan)</span>
          </label>
          <button
            type="button"
            onClick={keluar}
            className="mt-4 flex min-h-tap w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 font-semibold"
          >
            <Ikon nama="keluar" /> Keluar
          </button>
        </section>
      </div>
    </AppShell>
  )
}
