// Lapisan Rigorous Mathematical Thinking (Kinard & Kozulin, 2008). Data di content/rmt.json.
import rmt from '@content/rmt.json'

/** Kunci yang berisi jawaban atau umpan balik: tidak dikirim ke Mediator AI agar AI tidak membocorkannya. */
const KUNCI_RAHASIA = new Set([
  'kunci', 'salah', 'benar', 'umpan', 'salahKhusus', 'model', 'penting', 'petunjuk',
  'structure_tag', 'target', 'id', 'latihan', 'tafsir',
])
const BATAS_KONTEKS = 1800

/**
 * Fase RMT dan fungsi kognitif sasaran untuk satu layar.
 * Urutan prioritas: kartu.rmt → petaModul[modul][tahap] → petaTahap[tahap].
 */
export function rmtUntuk(modulId, kartu) {
  const dasar = rmt.petaTahap[kartu?.tahap] ?? null
  const kodeFase = kartu?.rmt?.fase ?? dasar?.fase
  const kodeFungsi = kartu?.rmt?.fungsi ?? rmt.petaModul[modulId]?.[kartu?.tahap] ?? dasar?.fungsi
  const fase = rmt.fase[kodeFase]
  const fungsi = rmt.fungsiKognitif[kodeFungsi]
  if (!fase || !fungsi) return null
  return { fase: { kode: kodeFase, ...fase }, fungsi: { kode: kodeFungsi, ...fungsi } }
}

function bersihkan(nilai) {
  if (Array.isArray(nilai)) return nilai.map(bersihkan)
  if (nilai && typeof nilai === 'object') {
    const hasil = {}
    for (const [k, v] of Object.entries(nilai)) if (!KUNCI_RAHASIA.has(k)) hasil[k] = bersihkan(v)
    return hasil
  }
  return nilai
}

/** Isi layar untuk Mediator AI, tanpa kunci jawaban dan umpan balik. */
export function konteksKartu(kartu) {
  const awalan = kartu?.type === 'literasi' ? 'SOAL LITERASI 4 LANGKAH (Pahami, Rumuskan, Hitung, Tafsirkan). ' : ''
  const teks = awalan + JSON.stringify(bersihkan(kartu ?? {})).replace(/\*\*/g, '')
  return teks.length > BATAS_KONTEKS ? teks.slice(0, BATAS_KONTEKS) : teks
}

export const sumberRmt = rmt.sumber
