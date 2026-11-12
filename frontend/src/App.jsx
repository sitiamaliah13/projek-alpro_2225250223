import { HashRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'

// Di viewer Artifact, alamat "#/peta" tidak boleh dipakai; navigasi disimpan di memori.
// Sesi & progres tetap di localStorage, jadi muat ulang kembali ke Beranda.
const Router = typeof __ARTIFACT__ !== 'undefined' && __ARTIFACT__ ? MemoryRouter : HashRouter
import { ProgresProvider, useProgres } from './data/ProgresContext.jsx'
import Masuk from './pages/Masuk.jsx'
import Pretest from './pages/Pretest.jsx'
import CekBekal from './pages/CekBekal.jsx'
import PetaModul from './pages/PetaModul.jsx'
import Pelajaran from './pages/Pelajaran.jsx'
import Posttest from './pages/Posttest.jsx'
import Materi from './pages/Materi.jsx'
import Latihan from './pages/Latihan.jsx'
import Tes from './pages/Tes.jsx'
import Ekspor from './pages/Ekspor.jsx'

/** Halaman selain Masuk hanya bisa dibuka setelah masuk. */
function Wajib({ children }) {
  const { siswa } = useProgres()
  return siswa ? children : <Navigate to="/" replace />
}

/**
 * Alur: Masuk → Pretest → Cek Bekal → Peta Modul → Pelajaran → Posttest.
 * HashRouter dipakai agar aman di GitHub Pages (tanpa pengaturan server).
 */
export default function App() {
  return (
    <ProgresProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Masuk />} />
          <Route path="/pretest" element={<Wajib><Pretest /></Wajib>} />
          <Route path="/cek-bekal" element={<Wajib><CekBekal /></Wajib>} />
          <Route path="/peta" element={<Wajib><PetaModul /></Wajib>} />
          <Route path="/pelajaran/:id" element={<Wajib><Pelajaran /></Wajib>} />
          <Route path="/posttest" element={<Wajib><Posttest /></Wajib>} />
          <Route path="/materi" element={<Wajib><Materi /></Wajib>} />
          <Route path="/latihan" element={<Wajib><Latihan /></Wajib>} />
          <Route path="/tes" element={<Wajib><Tes /></Wajib>} />
          <Route path="/ekspor" element={<Wajib><Ekspor /></Wajib>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ProgresProvider>
  )
}
