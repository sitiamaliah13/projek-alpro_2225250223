import { describe, expect, it } from 'vitest'
import { ringkasanEvaluasi, teksEkspor } from './ekspor.js'

describe('teksEkspor', () => {
  it('tidak memasukkan nama panggilan atau id sesi', () => {
    const data = JSON.parse(teksEkspor({ nama: 'Bintang', kode: 'anon-rahasia', peserta: 'anon-rahasia' }, {}))

    expect(data).not.toHaveProperty('nama')
    expect(data).not.toHaveProperty('kode')
    expect(data).not.toHaveProperty('peserta')
    expect(JSON.stringify(data)).not.toContain('Bintang')
    expect(JSON.stringify(data)).not.toContain('anon-rahasia')
  })
})

describe('ringkasanEvaluasi', () => {
  it('menghitung beban kognitif, ketepatan latihan, dan pemakaian Tanya AI per modul', () => {
    const r = ringkasanEvaluasi({
      attempts: [
        { item_id: 'm1-l1', correct: true, tries: 1, hints_used: 0 },
        { item_id: 'm1-l2', correct: false, tries: 2, hints_used: 2 },
        { item_id: 'm5-s1', correct: true, tries: 2, hints_used: 1 },
      ],
      loads: [{ lesson_id: 'm1', rating: 4 }, { lesson_id: 'm5', rating: 7 }],
      mediator: [{ lesson_id: 'm1' }, { lesson_id: 'm1' }, { lesson_id: 'tanya' }],
      pretest: { done: true },
    })
    expect(r.total_tanya_ai).toBe(3)
    expect(r.rata_beban_kognitif).toBe(5.5)
    expect(r.persen_benar_latihan).toBe(67)
    expect(r.pretest_selesai).toBe(true)
    expect(r.per_modul.m1).toEqual({ latihan: 2, benar_percobaan_pertama: 1, petunjuk_dipakai: 2, rata_beban_kognitif: 4, tanya_ai: 2 })
    expect(r.per_modul.tanya.tanya_ai).toBe(1)
  })

  it('aman untuk progres kosong', () => {
    expect(ringkasanEvaluasi({})).toMatchObject({ total_tanya_ai: 0, rata_beban_kognitif: null, persen_benar_latihan: null })
  })
})
