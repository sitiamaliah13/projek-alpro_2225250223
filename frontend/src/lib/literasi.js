/**
 * Penilaian PROSES berpikir pada soal literasi 4 langkah (Pahami, Rumuskan, Hitung, Tafsirkan).
 * Per langkah: 2 = tepat tanpa salah dan tanpa petunjuk, 1 = tepat setelah salah atau dibantu petunjuk,
 * null = tidak dinilai (siswa memilih "Kerjakan langsung" sehingga langkah Pahami dilewati).
 */
export const LANGKAH_LITERASI = ['Pahami', 'Rumuskan', 'Hitung', 'Tafsirkan']

export function skorProses(langkah, lewatiPahami = false) {
  const rinci = LANGKAH_LITERASI.map((_, i) => {
    if (i === 0 && lewatiPahami) return null
    const l = langkah[i] ?? { salah: 0, hint: 0 }
    return l.salah === 0 && l.hint === 0 ? 2 : 1
  })
  const dinilai = rinci.filter((x) => x !== null)
  return { rinci, skor: dinilai.reduce((a, b) => a + b, 0), maks: dinilai.length * 2 }
}
