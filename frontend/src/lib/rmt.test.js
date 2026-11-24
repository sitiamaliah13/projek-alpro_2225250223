import { describe, expect, it } from 'vitest'
import { konteksKartu, rmtUntuk } from './rmt.js'
import { ambilPelajaran } from '../data/konten.js'

describe('rmtUntuk', () => {
  it('memetakan tahap ke fase dan fungsi kognitif', () => {
    const r = rmtUntuk('m1', { tahap: 'Jelaskan' })
    expect(r.fase.kode).toBe('III')
    expect(r.fungsi.nama).toBe('Memberi bukti logis')
  })

  it('peta modul mengalahkan peta tahap, kartu.rmt mengalahkan keduanya', () => {
    expect(rmtUntuk('m5', { tahap: 'Latihan' }).fungsi.kode).toBe('teliti')
    expect(rmtUntuk('m1', { tahap: 'Latihan' }).fungsi.kode).toBe('definisi-masalah')
    expect(rmtUntuk('m5', { tahap: 'Latihan', rmt: { fase: 'I', fungsi: 'keajekan' } }).fase.kode).toBe('I')
  })

  it('tahap tak dikenal menghasilkan null', () => {
    expect(rmtUntuk('m1', { tahap: 'Entah' })).toBeNull()
  })

  it('semua layar di semua pelajaran punya pemetaan RMT', () => {
    for (const id of ['m1', 'm2', 'm4', 'm5', 'm6', 'm7']) {
      for (const k of ambilPelajaran(id).cards) expect(rmtUntuk(id, k), `${id} ${k.tahap}`).not.toBeNull()
    }
  })
})

describe('konteksKartu', () => {
  it('tidak mengirim kunci jawaban, umpan balik, atau petunjuk', () => {
    const kartu = {
      id: 'm1-x', judul: 'Soal', isi: ['Apakah **fungsi**?'], pilihan: ['Ya', 'Tidak'], kunci: 1,
      petunjuk: ['p'], tanya: { teks: 'f(4)?', kunci: 11, benar: 'Tepat', salah: 'Coba lagi' },
      info: [{ teks: '6 km', penting: true }],
    }
    const k = konteksKartu(kartu)
    expect(k).toContain('Apakah fungsi?')
    expect(k).toContain('f(4)?')
    for (const terlarang of ['kunci', 'Tepat', 'Coba lagi', 'penting', 'petunjuk', 'm1-x']) expect(k).not.toContain(terlarang)
  })

  it('menandai soal literasi agar AI menuntun 4 langkah', () => {
    expect(konteksKartu({ type: 'literasi', stem: ['Tarif ojek'] })).toMatch(/^SOAL LITERASI 4 LANGKAH/)
    expect(konteksKartu({ type: 'soal' })).not.toContain('LITERASI')
  })

  it('dibatasi panjangnya', () => {
    expect(konteksKartu({ isi: ['x'.repeat(5000)] }).length).toBeLessThanOrEqual(1800)
  })
})
