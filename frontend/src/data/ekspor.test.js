import { describe, expect, it } from 'vitest'
import { teksEkspor } from './ekspor.js'

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
