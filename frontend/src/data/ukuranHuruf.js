import { baca, tulis } from './storage.js'

/** Ukuran huruf pilihan siswa; disimpan di HP. Semua ukuran memakai rem sehingga ikut membesar. */
export const UKURAN = [
  { id: 'normal', label: 'Normal', persen: 100 },
  { id: 'besar', label: 'Besar', persen: 112.5 },
  { id: 'sangat', label: 'Lebih besar', persen: 125 },
]

export const bacaUkuran = () => (UKURAN.find((u) => u.id === baca('ukuran-huruf', 'normal')) ?? UKURAN[0]).id

export function terapkanUkuran(id = bacaUkuran()) {
  const u = UKURAN.find((x) => x.id === id) ?? UKURAN[0]
  document.documentElement.style.fontSize = `${u.persen}%`
}

export function simpanUkuran(id) {
  tulis('ukuran-huruf', id)
  terapkanUkuran(id)
}
