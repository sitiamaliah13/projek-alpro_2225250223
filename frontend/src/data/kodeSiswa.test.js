import { describe, expect, it } from 'vitest'
import { buatSiswa } from './kodeSiswa.js'

describe('buatSiswa', () => {
  it('menerima dan merapikan nama panggilan', () => {
    const hasil = buatSiswa('  Bintang   Kecil  ')

    expect(hasil.ok).toBe(true)
    expect(hasil.siswa.nama).toBe('Bintang Kecil')
    expect(hasil.siswa.kode).toMatch(/^anon-/)
  })

  it('menolak isian kosong dan nama terlalu panjang', () => {
    expect(buatSiswa(' ').ok).toBe(false)
    expect(buatSiswa('a'.repeat(25)).ok).toBe(false)
  })

  it('membuat id anonim yang berbeda untuk setiap sesi baru', () => {
    const pertama = buatSiswa('Bintang')
    const kedua = buatSiswa('Bintang')

    expect(pertama.siswa.kode).not.toBe(kedua.siswa.kode)
  })
})
