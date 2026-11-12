import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buatPenyinkron } from './sinkron.js'
import { GalatApi, masukDenganKode, simpanProgresServer } from './api.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('penyinkron progres', () => {
  it('hanya mengirim salinan terakhir setelah jeda', async () => {
    const kirim = vi.fn().mockResolvedValue({ saved: true })
    const s = buatPenyinkron({ kirim, jeda: 100 })
    s.jadwalkan('t', { v: 1 })
    s.jadwalkan('t', { v: 2 })
    await vi.advanceTimersByTimeAsync(150)
    expect(kirim).toHaveBeenCalledTimes(1)
    expect(kirim).toHaveBeenCalledWith('t', { v: 2 })
    expect(s.adaTertunda()).toBe(false)
  })

  it('menyimpan antrian saat offline dan mencoba lagi', async () => {
    const kirim = vi.fn().mockRejectedValueOnce(new GalatApi('OFFLINE', 'x', 0)).mockResolvedValue({})
    const status = []
    const s = buatPenyinkron({ kirim, jeda: 100, onStatus: (v) => status.push(v) })
    s.jadwalkan('t', { v: 1 })
    await vi.advanceTimersByTimeAsync(150)
    expect(s.adaTertunda()).toBe(true)
    await vi.advanceTimersByTimeAsync(600)
    expect(kirim).toHaveBeenCalledTimes(2)
    expect(status.at(-1)).toBe('tersimpan')
  })

  it('berhenti mencoba bila token ditolak', async () => {
    const kirim = vi.fn().mockRejectedValue(new GalatApi('TOKEN_EXPIRED', 'x', 401))
    const status = []
    const s = buatPenyinkron({ kirim, jeda: 100, onStatus: (v) => status.push(v) })
    s.jadwalkan('t', { v: 1 })
    await vi.advanceTimersByTimeAsync(2000)
    expect(kirim).toHaveBeenCalledTimes(1)
    expect(status.at(-1)).toBe('perlu-masuk')
  })
})

describe('klien api', () => {
  it('mengirim token dan data progres', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ saved: true }) })
    await simpanProgresServer('abc', { lessons: {} }, { fetchFn })
    const [, init] = fetchFn.mock.calls[0]
    expect(init.method).toBe('PUT')
    expect(init.headers.Authorization).toBe('Bearer abc')
    expect(JSON.parse(init.body)).toEqual({ data: { lessons: {} } })
  })

  it('menerjemahkan galat kode salah', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: { code: 'INVALID_CODE', message: '...' } }),
    })
    await expect(masukDenganKode('FK-8A-XXXX', { fetchFn })).rejects.toMatchObject({ code: 'INVALID_CODE' })
  })

  it('galat jaringan menjadi OFFLINE', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(masukDenganKode('FK', { fetchFn })).rejects.toMatchObject({ code: 'OFFLINE' })
  })
})

describe('daftar otomatis', () => {
  it('mengembalikan kode baru dari server', async () => {
    const { daftarOtomatis } = await import('./api.js')
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'tok', code: 'FK-UM-ABC234', student: { id: 'u1' } }),
    })
    const hasil = await daftarOtomatis({ fetchFn })
    expect(fetchFn.mock.calls[0][0]).toMatch(/\/auth\/daftar$/)
    expect(fetchFn.mock.calls[0][1].method).toBe('POST')
    expect(hasil).toEqual({ token: 'tok', kode: 'FK-UM-ABC234', student: { id: 'u1' } })
  })
})
