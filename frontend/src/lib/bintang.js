/** Latihan yang dihitung untuk bintang dan dicatat sebagai attempts. */
export const termasukLatihan = (k) => ((k.type === 'soal' || k.type === 'buat') && k.latihan !== false) || k.latihan === true

/**
 * Bintang 1–3 (design.md §7): latihan benar pada percobaan pertama tanpa petunjuk.
 * Soal yang dilewati pada kunjungan ini (masuk lewat menu Latihan) memakai hasil terakhir yang tersimpan;
 * bila belum pernah dikerjakan, soal itu tidak dihitung salah.
 */
export function hitungBintang(kartu, hasil, attempts = []) {
  const dinilai = kartu
    .filter(termasukLatihan)
    .map((k) => hasil[k.id] ?? attempts.filter((a) => a.item_id === k.id).at(-1))
    .filter(Boolean)
  if (dinilai.length === 0) return 1
  const mulus = dinilai.filter((h) => h.correct && h.tries === 1 && !h.hints_used).length
  if (mulus === dinilai.length) return 3
  return mulus >= dinilai.length / 2 ? 2 : 1
}
