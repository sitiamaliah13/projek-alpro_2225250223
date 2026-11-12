// Semua konten dibaca dari ../content/*.json (agents.md: konten tidak di-hardcode).
import modules from '@content/modules.json'
import assessments from '@content/assessments.json'
import diagnostic from '@content/diagnostic.json'
import m1 from '@content/lessons/m1.json'
import m2 from '@content/lessons/m2.json'
import m4 from '@content/lessons/m4.json'
import m5 from '@content/lessons/m5.json'
import m6 from '@content/lessons/m6.json'
import m7 from '@content/lessons/m7.json'

const PELAJARAN = { m1, m2, m4, m5, m6, m7 }

export const daftarModul = [...modules].sort((p, q) => p.order - q.order)
export const tes = assessments
export const cekBekal = diagnostic

export function ambilPelajaran(id) {
  return PELAJARAN[id] ?? null
}

/** Modul yang kontennya sudah tersedia di Tahap 1 (syarat membuka posttest). */
export const modulTersedia = daftarModul.filter((m) => m.lesson && PELAJARAN[m.lesson])

/** Kartu di Beranda: Cek Bekal (M0) + modul yang tersedia, bernomor 01, 02, ... M3 (pasca-MVP) disembunyikan. */
export const modulBeranda = daftarModul.filter((m) => m.route || (m.lesson && PELAJARAN[m.lesson]))

export const tautanModul = (m) => m.route ?? `/pelajaran/${m.lesson}`
