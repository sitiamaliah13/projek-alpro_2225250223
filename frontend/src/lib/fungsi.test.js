// Kasus uji sama dengan python/tests/test_function_check.py (agents.md aturan 8).
import { describe, expect, it } from 'vitest'
import { cekFungsi, isKorespondensiSatuSatu, pesanIsu } from './fungsi.js'

const tags = (hasil) => hasil.issues.map((i) => i.tag)

describe('cekFungsi', () => {
  it('TC01 fungsi normal (dua anggota A ke anggota B yang sama tetap fungsi)', () => {
    const h = cekFungsi([1, 2, 3], [[1, 'a'], [2, 'a'], [3, 'b']])
    expect(h.isFunction).toBe(true)
    expect(h.issues).toEqual([])
    expect(h.range).toEqual(['a', 'b'])
  })

  it('TC02 MULTI_PAIR: satu anggota A punya dua pasangan', () => {
    const h = cekFungsi([1, 2, 3], [[1, 'a'], [2, 'b'], [2, 'c'], [3, 'd']])
    expect(h.isFunction).toBe(false)
    expect(h.issues).toEqual([{ tag: 'MULTI_PAIR', a: 2, targets: ['b', 'c'] }])
  })

  it('TC03 NO_PAIR: ada anggota A tanpa pasangan', () => {
    const h = cekFungsi([1, 2, 3, 4], [[1, 'p'], [2, 'q'], [4, 'r']])
    expect(h.isFunction).toBe(false)
    expect(h.issues).toEqual([{ tag: 'NO_PAIR', a: 3 }])
  })

  it('TC04 keduanya sekaligus', () => {
    const h = cekFungsi([1, 2, 3], [[1, 'a'], [1, 'b'], [3, 'c']])
    expect(tags(h)).toEqual(['MULTI_PAIR', 'NO_PAIR'])
  })

  it('TC05 domain kosong (batas)', () => {
    const h = cekFungsi([], [])
    expect(h.isFunction).toBe(false)
    expect(tags(h)).toEqual(['EMPTY_DOMAIN'])
  })

  it('TC06 pasangan dari luar domain (invalid)', () => {
    const h = cekFungsi([1, 2], [[1, 'a'], [2, 'b'], [5, 'c']])
    expect(h.isFunction).toBe(false)
    expect(tags(h)).toEqual(['OUT_OF_DOMAIN'])
  })

  it('TC07 panah ganda yang sama dihitung sekali', () => {
    const h = cekFungsi([1], [[1, 'a'], [1, 'a']])
    expect(h.isFunction).toBe(true)
  })

  it('TC08 angka dan teks dibandingkan sebagai teks ("1" sama dengan 1)', () => {
    expect(cekFungsi(['1', '2'], [[1, 'a'], [2, 'b']]).isFunction).toBe(true)
  })
})

describe('isKorespondensiSatuSatu', () => {
  it('TC09 korespondensi satu-satu', () => {
    expect(isKorespondensiSatuSatu([1, 2, 3], ['a', 'b', 'c'], [[1, 'c'], [2, 'a'], [3, 'b']])).toBe(true)
  })
  it('TC10 fungsi tetapi bukan korespondensi satu-satu', () => {
    expect(isKorespondensiSatuSatu([1, 2, 3], ['a', 'b', 'c'], [[1, 'a'], [2, 'a'], [3, 'b']])).toBe(false)
  })
  it('TC11 banyak anggota A dan B berbeda', () => {
    expect(isKorespondensiSatuSatu([1, 2], ['a', 'b', 'c'], [[1, 'a'], [2, 'b']])).toBe(false)
  })
})

describe('pesanIsu', () => {
  it('menjelaskan mengapa', () => {
    expect(pesanIsu({ tag: 'MULTI_PAIR', a: 2, targets: ['b', 'c'] })).toBe(
      '2 punya 2 pasangan (b dan c). Fungsi hanya boleh satu.',
    )
    expect(pesanIsu({ tag: 'NO_PAIR', a: 3 })).toBe('3 belum punya pasangan.')
  })
})
