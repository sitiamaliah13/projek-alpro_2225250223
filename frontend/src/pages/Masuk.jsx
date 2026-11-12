import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Tombol from '../components/Tombol.jsx'
import Logo from '../components/Logo.jsx'
import { buatSiswa } from '../data/kodeSiswa.js'
import { ambilProgresServer, apiAktif, daftarOtomatis, masukDenganKode } from '../data/api.js'
import { ruteBerikutnya } from '../data/progres.js'
import { useProgres } from '../data/ProgresContext.jsx'

/**
 * Onboarding singkat (IL03), dengan pengantar fungsi (IL01, DS03) tanpa mengumpulkan nama asli.
 * Tahap 2: kode siswa dari guru (opsional) menyimpan progres ke server. Nama panggilan tetap di HP.
 */
export default function Masuk() {
  const { siswa, progres, masuk } = useProgres()
  const navigate = useNavigate()
  const [nama, setNama] = useState('')
  const [galat, setGalat] = useState('')
  const [kodeSiswa, setKodeSiswa] = useState('')
  const [galatKode, setGalatKode] = useState('')
  const [memuat, setMemuat] = useState(false)

  if (siswa) return <Navigate to={ruteBerikutnya(progres, siswa)} replace />

  const mulaiBelajar = async (teks) => {
    const hasil = buatSiswa(teks)
    if (!hasil.ok) {
      setGalat(hasil.pesan)
      return
    }
    let dataSiswa = hasil.siswa
    let progresServer = null
    if (apiAktif() && kodeSiswa.trim()) {
      setMemuat(true)
      try {
        const { token, kode, student } = await masukDenganKode(kodeSiswa)
        const id = `srv-${student.id}`
        dataSiswa = { ...dataSiswa, peserta: id, kode: id, token, kodeServer: kode }
        progresServer = await ambilProgresServer(token)
      } catch (e) {
        setGalatKode(e.message)
        setMemuat(false)
        return
      }
      setMemuat(false)
    } else if (apiAktif()) {
      // Tanpa kode: siapa pun dibuatkan kode samaran baru. Bila offline, tetap belajar di HP saja.
      setMemuat(true)
      try {
        const { token, kode, student } = await daftarOtomatis()
        const id = `srv-${student.id}`
        dataSiswa = { ...dataSiswa, peserta: id, kode: id, token, kodeServer: kode }
      } catch {
        /* lanjut tanpa server */
      }
      setMemuat(false)
    }
    const p = masuk(dataSiswa, progresServer)
    navigate(ruteBerikutnya(p, dataSiswa), { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-8">
      <div className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full bg-pink-200/50" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-rose-100" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo besar />
        </div>

        <section className="surface-float rounded-[2rem] p-6 sm:p-8">
          <div className="mb-5 rounded-2xl bg-brand-pale px-4 py-3 text-center">
            <p className="font-bold text-brand">Belajar santai, paham fungsi!</p>
            <p className="mt-1 text-base text-muted">Pemetaan Fungsi · Kelas VIII</p>
          </div>
          <h1 className="text-xl font-bold">Selamat Datang!</h1>
          <p className="mt-1 text-muted">Belajar pemetaan fungsi, langkah demi langkah.</p>
          <div className="mt-4 rounded-2xl border border-pink-100 bg-brand-pale p-4">
            <h2 className="font-bold text-brand">Materi Singkat</h2>
            <p className="mt-1 text-muted">
              Fungsi memasangkan setiap anggota domain dengan tepat satu anggota kodomain. Contoh: aturan tambah 1
              memasangkan 2 dengan 3.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              mulaiBelajar(nama)
            }}
            className="mt-6"
            noValidate
          >
            <label htmlFor="nama" className="block font-semibold">
              Nama panggilan
            </label>
            <input
              id="nama"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value)
                setGalat('')
              }}
              placeholder="Contoh: Bintang"
              maxLength={24}
              autoCapitalize="words"
              autoComplete="off"
              aria-invalid={Boolean(galat)}
              aria-describedby={galat ? 'galat-nama' : 'petunjuk-nama'}
              className="mt-2 min-h-tap w-full rounded-2xl border-2 border-pink-200 bg-brand-pale px-4 text-xl font-semibold focus:border-brand"
            />
            <p id="petunjuk-nama" className="mt-2 text-base text-muted">Pakai nama panggilan. Jangan tulis nama lengkap.</p>
            {galat && (
              <p id="galat-nama" role="alert" className="mt-2">
                ⚠️ {galat}
              </p>
            )}
            {apiAktif() && (
              <>
                <label htmlFor="kode-siswa" className="mt-4 block font-semibold">
                  Kode siswa <span className="font-normal text-muted">(boleh dikosongkan)</span>
                </label>
                <input
                  id="kode-siswa"
                  value={kodeSiswa}
                  onChange={(e) => {
                    setKodeSiswa(e.target.value.toUpperCase())
                    setGalatKode('')
                  }}
                  placeholder="Contoh: FK-8A-K3P9"
                  maxLength={32}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(galatKode)}
                  aria-describedby={galatKode ? 'galat-kode' : 'petunjuk-kode'}
                  className="mt-2 min-h-tap w-full rounded-2xl border-2 border-pink-200 bg-brand-pale px-4 text-xl font-semibold tracking-wider focus:border-brand"
                />
                <p id="petunjuk-kode" className="mt-2 text-base text-muted">Belum punya kode? Kosongkan saja. Kode baru dibuat otomatis.</p>
                {galatKode && (
                  <p id="galat-kode" role="alert" className="mt-2">
                    ⚠️ {galatKode}
                  </p>
                )}
              </>
            )}
            <Tombol type="submit" className="mt-4" disabled={memuat}>
              {memuat ? 'Menyiapkan…' : 'Mulai Belajar'}
            </Tombol>
          </form>
        </section>
        <p className="mt-4 text-center text-base text-muted">Nama panggilan disimpan di perangkat ini saja.</p>
      </div>
    </div>
  )
}
