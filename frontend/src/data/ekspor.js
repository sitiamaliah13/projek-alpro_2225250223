/** Versi Artifact: unduhan file diblokir viewer, jadi data disalin sebagai teks. */
export const MODE_ARTIFACT = typeof __ARTIFACT__ !== 'undefined' && __ARTIFACT__

const modulDari = (itemId) => String(itemId ?? '').split('-')[0] || 'lain'
const rata = (xs) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null)

/**
 * Ringkasan untuk evaluasi tahap 2 (prd §9): literasi, beban kognitif, dan pemakaian Mediator RMT per modul.
 * Tidak berisi isi percakapan AI.
 */
export function ringkasanEvaluasi(progres = {}) {
  const attempts = progres.attempts ?? []
  const loads = progres.loads ?? []
  const mediator = progres.mediator ?? []
  const modul = new Set([
    ...attempts.map((a) => modulDari(a.item_id)),
    ...loads.map((l) => l.lesson_id),
    ...mediator.map((m) => m.lesson_id),
  ])
  const perModul = {}
  for (const m of [...modul].sort()) {
    const a = attempts.filter((x) => modulDari(x.item_id) === m)
    perModul[m] = {
      latihan: a.length,
      benar_percobaan_pertama: a.filter((x) => x.correct && x.tries === 1).length,
      petunjuk_dipakai: a.reduce((n, x) => n + (x.hints_used ?? 0), 0),
      rata_beban_kognitif: rata(loads.filter((l) => l.lesson_id === m).map((l) => l.rating)),
      tanya_ai: mediator.filter((x) => x.lesson_id === m).length,
      skor_proses_literasi: (() => {
        const p = a.filter((x) => x.proses)
        if (!p.length) return null
        const skor = p.reduce((n, x) => n + x.proses.skor, 0)
        const maks = p.reduce((n, x) => n + x.proses.maks, 0)
        return { skor, maks }
      })(),
    }
  }
  return {
    total_tanya_ai: mediator.length,
    rata_beban_kognitif: rata(loads.map((l) => l.rating)),
    persen_benar_latihan: attempts.length ? Math.round((attempts.filter((x) => x.correct).length / attempts.length) * 100) : null,
    pretest_selesai: Boolean(progres.pretest?.done),
    posttest_selesai: Boolean(progres.posttest?.done),
    per_modul: perModul,
  }
}

/** Isi ekspor anonim: nama panggilan dan identitas perangkat tidak disertakan. */
export function teksEkspor(siswa, progres) {
  return JSON.stringify({ diekspor: new Date().toISOString(), ringkasan: ringkasanEvaluasi(progres), progres }, null, 2)
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
