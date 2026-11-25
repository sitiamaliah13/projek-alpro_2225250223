/**
 * Perkembangan belajar per modul (prd F18): dikuasai / perlu diulang / belum dipelajari.
 * Aturan sederhana dan transparan agar bisa dijelaskan ke siswa:
 * - "Dikuasai": pelajaran selesai, bintang ≥ 2, dan ≥ 70% latihan benar pada percobaan pertama.
 * - "Perlu diulang": pelajaran selesai tetapi syarat di atas belum terpenuhi.
 * - "Belum dipelajari": pelajaran belum selesai.
 * Untuk setiap soal dipakai hasil TERAKHIR (siswa yang mengulang dan berhasil tidak dihukum).
 */
export const BATAS_KUASAI = 0.7
export const SKOR_MAKS_TES = 30

export function ketepatanModul(modulId, attempts = []) {
  const terakhir = new Map()
  for (const a of attempts) {
    if (String(a.item_id ?? '').split('-')[0] === modulId) terakhir.set(a.item_id, a)
  }
  const daftar = [...terakhir.values()]
  if (daftar.length === 0) return null
  const mulus = daftar.filter((a) => a.correct && a.tries === 1).length
  return { benar: mulus, total: daftar.length, persen: Math.round((mulus / daftar.length) * 100) }
}

export function statusPenguasaan(modulId, progres) {
  const les = progres.lessons?.[modulId]
  const tepat = ketepatanModul(modulId, progres.attempts)
  if (!les?.done) return { status: 'belum', tepat, bintang: 0 }
  const cukupTepat = tepat === null || tepat.persen / 100 >= BATAS_KUASAI
  const status = (les.stars ?? 0) >= 2 && cukupTepat ? 'dikuasai' : 'ulang'
  return { status, tepat, bintang: les.stars ?? 0 }
}

/** N-Gain (Hake): (post − pre) / (maks − pre). null bila data belum lengkap. */
export function nGain(pre, post, maks = SKOR_MAKS_TES) {
  if (pre === null || pre === undefined || post === null || post === undefined) return null
  if (maks - pre <= 0) return null
  const g = (post - pre) / (maks - pre)
  return { nilai: Math.round(g * 100) / 100, kategori: g >= 0.7 ? 'tinggi' : g >= 0.3 ? 'sedang' : 'rendah' }
}
