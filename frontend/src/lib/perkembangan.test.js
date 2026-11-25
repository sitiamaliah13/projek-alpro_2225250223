import { describe, expect, it } from 'vitest'
import { ketepatanModul, nGain, statusPenguasaan } from './perkembangan.js'

const coba = (item_id, correct, tries = 1) => ({ item_id, correct, tries })

describe('statusPenguasaan', () => {
  it('belum dipelajari bila pelajaran belum selesai', () => {
    expect(statusPenguasaan('m1', { lessons: {}, attempts: [] }).status).toBe('belum')
  })
  it('dikuasai: selesai, bintang ≥ 2, latihan ≥ 70% mulus', () => {
    const p = { lessons: { m1: { done: true, stars: 3 } }, attempts: [coba('m1-a', true), coba('m1-b', true), coba('m1-c', true)] }
    expect(statusPenguasaan('m1', p).status).toBe('dikuasai')
  })
  it('perlu diulang bila bintang 1 atau ketepatan rendah', () => {
    expect(statusPenguasaan('m1', { lessons: { m1: { done: true, stars: 1 } }, attempts: [] }).status).toBe('ulang')
    const p = { lessons: { m1: { done: true, stars: 2 } }, attempts: [coba('m1-a', false, 2), coba('m1-b', true)] }
    expect(statusPenguasaan('m1', p).status).toBe('ulang')
  })
  it('memakai hasil terakhir per soal (mengulang lalu berhasil dihitung)', () => {
    const t = ketepatanModul('m5', [coba('m5-s1', false, 3), coba('m5-s1', true, 1), coba('m1-x', false)])
    expect(t).toEqual({ benar: 1, total: 1, persen: 100 })
  })
})

describe('nGain', () => {
  it('menghitung N-Gain dan kategorinya', () => {
    expect(nGain(10, 24)).toEqual({ nilai: 0.7, kategori: 'tinggi' })
    expect(nGain(12, 18)).toEqual({ nilai: 0.33, kategori: 'sedang' })
    expect(nGain(20, 21)).toEqual({ nilai: 0.1, kategori: 'rendah' })
  })
  it('null bila data belum lengkap atau pretest sudah maksimal', () => {
    expect(nGain(null, 20)).toBeNull()
    expect(nGain(30, 30)).toBeNull()
  })
})
