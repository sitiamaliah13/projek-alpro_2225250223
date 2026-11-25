import { describe, expect, it } from 'vitest'
import { skorProses } from './literasi.js'

const L = (salah, hint = 0) => ({ salah, hint })

describe('skorProses', () => {
  it('semua langkah mulus → skor penuh', () => {
    expect(skorProses([L(0), L(0), L(0), L(0)])).toEqual({ rinci: [2, 2, 2, 2], skor: 8, maks: 8 })
  })
  it('salah atau memakai petunjuk → 1 untuk langkah itu', () => {
    expect(skorProses([L(0), L(2), L(0, 1), L(0)]).rinci).toEqual([2, 1, 1, 2])
  })
  it('Pahami dilewati → tidak dinilai, maks turun', () => {
    expect(skorProses([L(0), L(0), L(1), L(0)], true)).toEqual({ rinci: [null, 2, 1, 2], skor: 5, maks: 6 })
  })
})
