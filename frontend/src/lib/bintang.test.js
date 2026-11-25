import { describe, expect, it } from 'vitest'
import { hitungBintang } from './bintang.js'

const K = ['a', 'b', 'c'].map((id) => ({ id, type: 'soal' }))
const ok = { correct: true, tries: 1, hints_used: 0 }
const salah = { correct: false, tries: 2, hints_used: 0 }

describe('hitungBintang', () => {
  it('3 bila semua mulus, 2 bila minimal separuh, 1 bila kurang', () => {
    expect(hitungBintang(K, { a: ok, b: ok, c: ok })).toBe(3)
    expect(hitungBintang(K, { a: ok, b: ok, c: salah })).toBe(2)
    expect(hitungBintang(K, { a: ok, b: salah, c: salah })).toBe(1)
  })
  it('memakai petunjuk tidak dihitung mulus', () => {
    expect(hitungBintang([K[0]], { a: { ...ok, hints_used: 1 } })).toBe(1)
  })
  it('soal yang dilewati tidak dianggap salah', () => {
    expect(hitungBintang(K, { b: ok, c: ok })).toBe(3)
  })
  it('soal yang dilewati memakai hasil terakhir yang tersimpan', () => {
    const lama = [{ item_id: 'a', ...ok }, { item_id: 'a', ...salah }]
    expect(hitungBintang(K, { b: ok, c: ok }, lama)).toBe(2)
  })
  it('tanpa latihan sama sekali tidak mendapat 3 bintang', () => {
    expect(hitungBintang(K, {})).toBe(1)
  })
})
