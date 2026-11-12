// Kasus uji sama dengan python/tests/test_penilaian_rumus.py.
import { describe, expect, it } from 'vitest'
import {
  bacaAngka,
  bacaRumusLinear,
  formatBilangan,
  formatRumus,
  nilaiFungsi,
  periksaLangkahKali,
  periksaLangkahTambah,
  periksaRumus,
  periksaSubstitusi,
  rumusDariDuaNilai,
} from './aljabar.js'

describe('nilaiFungsi & rumusDariDuaNilai', () => {
  it('nilai fungsi dengan x negatif', () => {
    expect(nilaiFungsi(2, -3, -2)).toBe(-7)
  })
  it('contoh design.md: f(2)=5, f(-1)=-4 menghasilkan a=3, b=-1', () => {
    expect(rumusDariDuaNilai(2, 5, -1, -4)).toEqual({ a: 3, b: -1 })
  })
  it('soal pretest 3: f(20)=50.000, f(50)=95.000', () => {
    expect(rumusDariDuaNilai(20, 50000, 50, 95000)).toEqual({ a: 1500, b: 20000 })
  })
  it('x sama menimbulkan galat (invalid)', () => {
    expect(() => rumusDariDuaNilai(3, 1, 3, 2)).toThrow()
  })
})

describe('bacaRumusLinear', () => {
  it.each([
    ['3x-1', 3, -1],
    ['-1 + 3x', 3, -1],
    ['f(x) = 3x − 1', 3, -1],
    ['y = 1.500x + 20.000', 1500, 20000],
    ['2,5x', 2.5, 0],
    ['-x + 4', -1, 4],
    ['7', 0, 7],
  ])('%s', (teks, a, b) => {
    expect(bacaRumusLinear(teks)).toEqual({ a, b })
  })
  it.each(['', 'abc', 'x2', '3x+'])('format tidak valid: "%s"', (teks) => {
    expect(() => bacaRumusLinear(teks)).toThrow()
  })
})

describe('periksaRumus', () => {
  it('bentuk setara diterima', () => {
    expect(periksaRumus('-3 + 2x', 2, -3).benar).toBe(true)
  })
  it('SIGN_ERROR', () => {
    expect(periksaRumus('3x + 1', 3, -1).errorTag).toBe('SIGN_ERROR')
  })
  it('SLOPE_ERROR', () => {
    expect(periksaRumus('2x - 1', 3, -1).errorTag).toBe('SLOPE_ERROR')
  })
  it('OFFSET_ERROR', () => {
    expect(periksaRumus('3x + 5', 3, -1).errorTag).toBe('OFFSET_ERROR')
  })
  it('format tidak dikenali tidak membuat program error', () => {
    const h = periksaRumus('abc', 3, -1)
    expect(h.benar).toBe(false)
    expect(h.errorTag).toBe(null)
  })
})

describe('periksaSubstitusi', () => {
  it('benar', () => {
    expect(periksaSubstitusi(2, -3, -2, -7).benar).toBe(true)
  })
  it('salah tanda terdeteksi', () => {
    expect(periksaSubstitusi(2, -3, -2, 1).errorTag).toBe('SIGN_ERROR')
    expect(periksaSubstitusi(2, -3, -2, 7).errorTag).toBe('SIGN_ERROR')
  })
  it('salah hitung biasa', () => {
    expect(periksaSubstitusi(2, -3, -2, 10).errorTag).toBe(null)
  })
})

describe('periksaLangkahKali & periksaLangkahTambah (Penanda Tanda)', () => {
  it('TC38 langkah kali benar dan salah tanda', () => {
    expect(periksaLangkahKali(2, -2, -4).benar).toBe(true)
    expect(periksaLangkahKali(2, -2, 4).errorTag).toBe('SIGN_ERROR')
    expect(periksaLangkahKali(-3, -5, -15).pesan).toContain('Negatif × negatif')
    expect(periksaLangkahKali(2, -2, 5).errorTag).toBe(null)
  })
  it('TC39 langkah tambah benar dan salah tanda', () => {
    expect(periksaLangkahTambah(-4, -3, -7).benar).toBe(true)
    expect(periksaLangkahTambah(-4, -3, -1).errorTag).toBe('SIGN_ERROR')
    expect(periksaLangkahTambah(-4, -3, 7).errorTag).toBe('SIGN_ERROR')
    expect(periksaLangkahTambah(-4, -3, 0).errorTag).toBe(null)
  })
})

describe('formatBilangan & formatRumus', () => {
  it('TC40 penulisan bilangan negatif dan rumus', () => {
    expect(formatBilangan(-2, true)).toBe('(−2)')
    expect(formatBilangan(2.5)).toBe('2,5')
    expect(formatRumus(3, -1)).toBe('3x − 1')
    expect(formatRumus(-1, 4)).toBe('−x + 4')
    expect(formatRumus(2, 0)).toBe('2x')
  })
})

describe('bacaAngka', () => {
  it('menerima tanda minus unicode dan koma desimal', () => {
    expect(bacaAngka('−7')).toBe(-7)
    expect(bacaAngka('2,5')).toBe(2.5)
    expect(Number.isNaN(bacaAngka('tujuh'))).toBe(true)
  })
})
