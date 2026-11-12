/**
 * Klien API Tahap 2 (api.md). Bila VITE_API_URL kosong (atau versi Artifact), aplikasi tetap
 * berjalan lokal seperti Tahap 1. Nama panggilan tidak pernah dikirim ke server (agents.md aturan 6).
 */
const ARTIFACT = typeof __ARTIFACT__ !== 'undefined' && __ARTIFACT__
export const API_URL = ARTIFACT ? '' : String(import.meta.env?.VITE_API_URL ?? '').replace(/\/+$/, '')

export const apiAktif = () => API_URL !== ''

const PESAN_UMUM = {
  INVALID_CODE: 'Kode siswa tidak ditemukan. Periksa lagi hurufnya.',
  INACTIVE: 'Kode siswa ini sudah tidak aktif. Tanyakan ke guru.',
  RATE_LIMITED: 'Terlalu banyak percobaan. Tunggu 1 menit, lalu coba lagi.',
  TOKEN_EXPIRED: 'Sesi habis. Masukkan kode siswa lagi.',
}

export class GalatApi extends Error {
  constructor(code, message, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

async function panggil(jalur, { method = 'GET', token, body, fetchFn = globalThis.fetch } = {}) {
  let r
  try {
    r = await fetchFn(`${API_URL}${jalur}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new GalatApi('OFFLINE', 'Tidak ada internet. Coba lagi nanti.', 0)
  }
  const isi = await r.json().catch(() => null)
  if (!r.ok) {
    const code = isi?.detail?.code ?? 'SERVER_ERROR'
    throw new GalatApi(code, PESAN_UMUM[code] ?? 'Server sedang bermasalah. Coba lagi nanti.', r.status)
  }
  return isi
}

/** POST /auth/login → { token, kode, student } */
export async function masukDenganKode(kode, opsi = {}) {
  const isi = await panggil('/auth/login', { method: 'POST', body: { code: String(kode).trim() }, ...opsi })
  return { token: isi.access_token, kode: isi.code, student: isi.student }
}

/** POST /auth/daftar → kode samaran baru untuk siapa pun yang belum punya kode. */
export async function daftarOtomatis(opsi = {}) {
  const isi = await panggil('/auth/daftar', { method: 'POST', ...opsi })
  return { token: isi.access_token, kode: isi.code, student: isi.student }
}

/** GET /progress → data progres tersimpan atau null */
export async function ambilProgresServer(token, opsi = {}) {
  const isi = await panggil('/progress', { token, ...opsi })
  return isi?.data ?? null
}

/** PUT /progress */
export function simpanProgresServer(token, data, opsi = {}) {
  return panggil('/progress', { method: 'PUT', token, body: { data }, ...opsi })
}
