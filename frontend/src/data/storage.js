/**
 * Penyimpanan lokal di HP (Tahap 1 Frontend-First, task.md).
 * localStorage bisa gagal (mode privat, penyimpanan penuh), jadi semua akses dibungkus try/catch.
 * Tahap 2: ganti isi file ini dengan pemanggilan API, tanpa mengubah halaman.
 */
const PREFIX = 'fungsiku:'

export function baca(kunci, cadangan) {
  try {
    const teks = localStorage.getItem(PREFIX + kunci)
    return teks ? JSON.parse(teks) : cadangan
  } catch {
    return cadangan
  }
}

export function tulis(kunci, nilai) {
  try {
    localStorage.setItem(PREFIX + kunci, JSON.stringify(nilai))
    return true
  } catch {
    return false
  }
}

export function hapus(kunci) {
  try {
    localStorage.removeItem(PREFIX + kunci)
  } catch {
    /* abaikan */
  }
}
