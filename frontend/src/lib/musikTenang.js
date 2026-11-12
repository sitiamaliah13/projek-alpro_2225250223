/**
 * "Study Time": melodi instrumental ceria yang dibangkitkan dengan Web Audio API (tanpa file audio,
 * jadi tetap jalan offline dan tidak menambah ukuran aplikasi).
 *
 * Aturan cognitive load:
 * - MATI secara bawaan. AudioContext baru dibuat saat siswa menekan Putar (juga syarat autoplay browser).
 * - Volume rendah, nada pentatonis cerah, tempo sedang, tanpa lirik (mengurangi extraneous load).
 * - Dijeda otomatis saat siswa membuka pelajaran atau tes (lihat Layar.jsx), karena layar itu butuh fokus penuh.
 * - Pilihan tidak disimpan: setiap sesi selalu mulai dalam keadaan mati.
 */

// Melodi pentatonis G mayor dengan pola baru dan tempo sedang agar terasa lebih hidup.
const NADA = [392.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77]
const POLA = [0, 2, 4, 2, 1, 3, 5, 4, 2, 0, 2, 3, 4, 6, 5, 4]
const AKOR = [
  [98.0, 146.83, 196.0], // G2 + D3 + G3
  [82.41, 123.47, 164.81], // E2 + B2 + E3
  [65.41, 98.0, 130.81], // C2 + G2 + C3
  [73.42, 110.0, 146.83], // D2 + A2 + D3
]
const DETIK_PER_NADA = 0.6
const VOLUME = 0.05

let ctx = null
let master = null
let timer = null
let langkah = 0
let berjalan = false
const pendengar = new Set()

function kabari() {
  for (const fn of pendengar) fn(berjalan)
}

function mainkanNada(frekuensi, mulai, durasi, gain, jenis = 'sine') {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = jenis
  osc.frequency.value = frekuensi
  g.gain.setValueAtTime(0, mulai)
  g.gain.linearRampToValueAtTime(gain, mulai + Math.min(0.18, durasi / 4)) // naik pelan, tanpa hentakan
  g.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi)
  osc.connect(g).connect(master)
  osc.start(mulai)
  osc.stop(mulai + durasi + 0.05)
}

function jadwalkan() {
  const t = ctx.currentTime + 0.1
  mainkanNada(NADA[POLA[langkah % POLA.length]], t, DETIK_PER_NADA * 1.35, 0.42, 'triangle')
  if (langkah % 4 === 0) {
    const akor = AKOR[Math.floor(langkah / 4) % AKOR.length]
    for (const f of akor) mainkanNada(f, t, DETIK_PER_NADA * 4.1, 0.2, 'sine')
  }
  langkah += 1
}

export function putarMusik() {
  if (typeof window === 'undefined' || berjalan) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!ctx) {
    ctx = new AC()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1400 // meredam nada tinggi agar lembut
    master = ctx.createGain()
    master.gain.value = VOLUME
    master.connect(filter).connect(ctx.destination)
  }
  ctx.resume()
  jadwalkan()
  timer = window.setInterval(jadwalkan, DETIK_PER_NADA * 1000)
  berjalan = true
  kabari()
}

export function jedaMusik() {
  if (!berjalan) return
  window.clearInterval(timer)
  timer = null
  ctx?.suspend()
  berjalan = false
  kabari()
}

export function musikBerjalan() {
  return berjalan
}

/** Berlangganan perubahan status (untuk tombol Play/Pause). Mengembalikan fungsi berhenti. */
export function pantauMusik(fn) {
  pendengar.add(fn)
  return () => pendengar.delete(fn)
}
