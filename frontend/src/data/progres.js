// Bentuk data progres satu siswa + aturan alur halaman.
import { modulTersedia } from './konten.js'

export function progresKosong() {
  return {
    pretest: { done: false, answers: {}, submittedAt: null },
    posttest: { done: false, answers: {}, submittedAt: null },
    diagnostic: { done: false, scores: {}, penguatanTanda: false },
    lessons: {}, // { m1: { done, stars, completedAt } }
    attempts: [], // { item_id, correct, hints_used, tries, error_tag, ts }
    explanations: [], // { item_id, reason_choice, reason_correct, text, ts }
    loads: [], // { lesson_id, rating, ts }
  }
}

/** Alur utama: Masuk → Pretest → Cek Bekal → Beranda. */
export function ruteBerikutnya(progres, siswa) {
  if (!progres.pretest.done) return '/pretest'
  if (!progres.diagnostic.done) return '/cek-bekal'
  return '/peta'
}

/** Status selesai satu kartu modul di Beranda (M0 = Cek Bekal). */
export function statusModul(modul, progres) {
  if (modul.route === '/cek-bekal') return { done: progres.diagnostic.done, stars: null }
  const p = progres.lessons[modul.lesson]
  return { done: Boolean(p?.done), stars: p?.stars ?? 0 }
}

/** Posttest terbuka setelah semua modul yang tersedia selesai (api.md: 403 LOCKED sebelumnya). */
export function posttestTerbuka(progres, siswa) {
  return modulTersedia.length > 0 && modulTersedia.every((m) => progres.lessons[m.lesson]?.done)
}
