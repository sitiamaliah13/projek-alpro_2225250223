import { describe, expect, it, vi } from 'vitest'
import { GalatApi } from './api.js'
import { pulihkanSesi } from './pulihkanSesi.js'

const lama = { nama: 'A', kode: 'srv-lama', token: 't0', kodeServer: 'FK-8A-TES1' }
const baru = { token: 't1', kode: 'FK-8A-TES1', student: { id: 'baru' } }
const ditolak = () => vi.fn().mockRejectedValue(new GalatApi('INVALID_CODE', 'x', 401))

describe('pulihkanSesi', () => {
  it('masuk ulang dengan kode yang sama', async () => {
    const s = await pulihkanSesi(lama, { masuk: async () => baru, ambil: async () => null })
    expect(s).toMatchObject({ nama: 'A', kode: 'srv-baru', token: 't1', kodeServer: 'FK-8A-TES1' })
  })
  it('tidak menimpa progres yang sudah ada di server', async () => {
    expect(await pulihkanSesi(lama, { masuk: async () => baru, ambil: async () => ({ lessons: {} }) })).toBeNull()
  })
  it('kode guru yang tidak dikenal tidak diganti kode baru', async () => {
    const daftar = vi.fn()
    expect(await pulihkanSesi(lama, { masuk: ditolak(), daftar, ambil: async () => null })).toBeNull()
    expect(daftar).not.toHaveBeenCalled()
  })
  it('kode samaran otomatis dibuatkan kode baru', async () => {
    const daftar = vi.fn().mockResolvedValue({ token: 't2', kode: 'FK-UM-BARU12', student: { id: 'z' } })
    const s = await pulihkanSesi({ ...lama, kodeServer: 'FK-UM-LAMA12' }, { masuk: ditolak(), daftar, ambil: async () => null })
    expect(s.kodeServer).toBe('FK-UM-BARU12')
  })
  it('gagal jaringan → tidak mengubah apa pun', async () => {
    const masuk = vi.fn().mockRejectedValue(new GalatApi('OFFLINE', 'x', 0))
    expect(await pulihkanSesi(lama, { masuk })).toBeNull()
  })
})
