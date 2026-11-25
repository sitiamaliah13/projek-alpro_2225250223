import { ambilProgresServer, daftarOtomatis, masukDenganKode } from './api.js'

/**
 * Token ditolak (401), misalnya setelah pindah database: masuk ulang memakai kode yang sama,
 * lalu pakai progres di HP. Hanya untuk sesi yang masih aktif, agar progres tidak tertukar di HP bersama.
 * Bila server sudah punya progres untuk kode ini (perangkat lain), tidak ada yang ditimpa.
 * @returns sesi baru { siswa } atau null bila tidak bisa dipulihkan dengan aman
 */
export async function pulihkanSesi(siswa, { masuk = masukDenganKode, daftar = daftarOtomatis, ambil = ambilProgresServer } = {}) {
  if (!siswa?.kodeServer) return null
  let hasil
  try {
    hasil = await masuk(siswa.kodeServer)
  } catch (e) {
    // Kode samaran otomatis tidak ada di database baru: buat kode baru. Kode dari guru tidak pernah diganti.
    if (e?.code !== 'INVALID_CODE' || !siswa.kodeServer.startsWith('FK-UM-')) return null
    try {
      hasil = await daftar()
    } catch {
      return null
    }
  }
  try {
    if ((await ambil(hasil.token)) !== null) return null
  } catch {
    return null
  }
  const id = `srv-${hasil.student.id}`
  return { ...siswa, peserta: id, kode: id, token: hasil.token, kodeServer: hasil.kode }
}
