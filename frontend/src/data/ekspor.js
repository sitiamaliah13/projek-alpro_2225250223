/** Versi Artifact: unduhan file diblokir viewer, jadi data disalin sebagai teks. */
export const MODE_ARTIFACT = typeof __ARTIFACT__ !== 'undefined' && __ARTIFACT__

/** Isi ekspor anonim: nama panggilan dan identitas perangkat tidak disertakan. */
export function teksEkspor(siswa, progres) {
  return JSON.stringify({ diekspor: new Date().toISOString(), progres }, null, 2)
}

/** Ekspor data untuk peneliti (Tahap 1: data hanya ada di HP ini). */
export function unduhData(siswa, progres) {
  const isi = teksEkspor(siswa, progres)
  const url = URL.createObjectURL(new Blob([isi], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'fungsiku-progres.json'
  a.click()
  URL.revokeObjectURL(url)
}
