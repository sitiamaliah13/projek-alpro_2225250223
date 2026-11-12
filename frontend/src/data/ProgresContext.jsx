import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { baca, hapus, tulis } from './storage.js'
import { progresKosong } from './progres.js'
import { buatIdSamaran } from './kodeSiswa.js'
import { buatPenyinkron } from './sinkron.js'

const ProgresCtx = createContext(null)

function muatProgres(kode) {
  if (!kode) return progresKosong()
  return { ...progresKosong(), ...baca(`progres:${kode}`, {}) }
}

function muatSesi() {
  const lama = baca('sesi', null)
  if (!lama) return null
  if (lama.nama && lama.kode) return lama

  const demoLama = lama.peserta === 'Demo' || lama.peserta === 'Dosen'
  const kode = demoLama ? buatIdSamaran() : lama.kode || buatIdSamaran()
  const sesi = {
    nama: 'Teman Fungsi',
    peserta: demoLama ? kode : lama.peserta || kode,
    kode,
  }
  const progresLama = lama.kode ? baca(`progres:${lama.kode}`, null) : null
  if (progresLama && lama.kode !== kode) tulis(`progres:${kode}`, progresLama)
  tulis('sesi', sesi)
  return sesi
}

/**
 * Menyediakan sesi siswa dan progres belajar untuk semua halaman.
 * Bila siswa masuk dengan kode (Tahap 2), progres juga dikirim ke server lewat antrian sinkron.
 */
export function ProgresProvider({ children }) {
  const [siswa, setSiswa] = useState(muatSesi)
  const [progres, setProgres] = useState(() => muatProgres(muatSesi()?.kode))
  const [statusSinkron, setStatusSinkron] = useState('lokal')
  const penyinkron = useRef(null)
  if (!penyinkron.current) penyinkron.current = buatPenyinkron({ onStatus: setStatusSinkron })

  // Kirim sisa antrian saat aplikasi dibuka dan setiap kali internet kembali.
  useEffect(() => {
    const coba = () => penyinkron.current.kirimSekarang()
    coba()
    window.addEventListener('online', coba)
    return () => window.removeEventListener('online', coba)
  }, [])

  useEffect(() => {
    setStatusSinkron(siswa?.token ? (penyinkron.current.adaTertunda() ? 'tertunda' : 'tersimpan') : 'lokal')
  }, [siswa])

  /** masuk(dataSiswa, progresServer?): progres dari server dipakai bila ada (pindah perangkat). */
  const masuk = useCallback((dataSiswa, progresServer = null) => {
    tulis('sesi', dataSiswa)
    if (progresServer) tulis(`progres:${dataSiswa.kode}`, progresServer)
    setSiswa(dataSiswa)
    const p = muatProgres(dataSiswa.kode)
    setProgres(p)
    return p
  }, [])

  const keluar = useCallback(() => {
    penyinkron.current.kirimSekarang()
    hapus('sesi')
    setSiswa(null)
    setProgres(progresKosong())
  }, [])

  /** ubah(fn): fn menerima salinan progres dan boleh mengubahnya langsung. */
  const ubah = useCallback(
    (fn) => {
      setProgres((lama) => {
        const baru = structuredClone(lama)
        fn(baru)
        if (siswa) tulis(`progres:${siswa.kode}`, baru)
        if (siswa?.token) penyinkron.current.jadwalkan(siswa.token, baru)
        return baru
      })
    },
    [siswa],
  )

  const nilai = useMemo(
    () => ({ siswa, progres, masuk, keluar, ubah, statusSinkron }),
    [siswa, progres, masuk, keluar, ubah, statusSinkron],
  )
  return <ProgresCtx.Provider value={nilai}>{children}</ProgresCtx.Provider>
}

export function useProgres() {
  const ctx = useContext(ProgresCtx)
  if (!ctx) throw new Error('useProgres harus dipakai di dalam ProgresProvider')
  return ctx
}
