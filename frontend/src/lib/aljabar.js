/**
 * Penilaian rumus & tanda (IL05, F-2). Kembar dengan python/fungsiku_core/penilaian_rumus.py.
 * Fungsi linear f(x) = ax + b.
 */

const EPS = 1e-9
const sama = (p, q) => Math.abs(p - q) < EPS

/** f(x) = ax + b */
export function nilaiFungsi(a, b, x) {
  return a * x + b
}

/** Rumus dari dua nilai fungsi f(x1) = y1 dan f(x2) = y2 (design.md §4.3). */
export function rumusDariDuaNilai(x1, y1, x2, y2) {
  if (x1 === x2) throw new Error('Nilai x kedua titik harus berbeda.')
  const a = (y2 - y1) / (x2 - x1)
  const b = y1 - a * x1
  return { a, b }
}

/** Ubah angka gaya Indonesia: titik ribuan dibuang, koma jadi desimal ("1.500" → 1500, "2,5" → 2.5). */
function normalisasiAngka(s) {
  return s.replace(/\.(?=\d{3}(\D|$))/g, '').replace(/,/g, '.')
}

/**
 * Baca rumus linear dari teks siswa, mis. "3x-1", "-1 + 3x", "f(x) = 2,5x", "y = 1.500x + 20.000".
 * @returns {{a: number, b: number}}
 * @throws Error bila format tidak dikenali
 */
export function bacaRumusLinear(teks) {
  let s = String(teks ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[−–]/g, '-')
    .replace(/[×*·]/g, '')
  s = s.replace(/^(f\(x\)|y)=/, '')
  s = normalisasiAngka(s)
  if (s === '') throw new Error('Rumus masih kosong.')

  const suku = s.match(/[+-]?[^+-]+/g) ?? []
  if (suku.join('') !== s) throw new Error('Format rumus belum dikenali.')

  const angka = /^[+-]?\d+(\.\d+)?$/
  let a = 0
  let b = 0
  for (const t of suku) {
    if (t.endsWith('x')) {
      const k = t.slice(0, -1)
      if (k === '' || k === '+') a += 1
      else if (k === '-') a -= 1
      else if (angka.test(k)) a += Number(k)
      else throw new Error('Format rumus belum dikenali.')
    } else if (angka.test(t)) {
      b += Number(t)
    } else {
      throw new Error('Format rumus belum dikenali.')
    }
  }
  return { a, b }
}

/**
 * Bandingkan rumus siswa dengan kunci. Bentuk setara diterima ("2x-3" sama dengan "-3+2x").
 * @returns {{benar: boolean, errorTag: string|null, pesan: string}}
 */
export function periksaRumus(teks, aKunci, bKunci) {
  let r
  try {
    r = bacaRumusLinear(teks)
  } catch (e) {
    return { benar: false, errorTag: null, pesan: `${e.message} Contoh penulisan: 3x - 1.` }
  }
  const { a, b } = r
  if (sama(a, aKunci) && sama(b, bKunci)) return { benar: true, errorTag: null, pesan: 'Tepat!' }
  const tandaA = aKunci !== 0 && sama(a, -aKunci) && sama(b, bKunci)
  const tandaB = bKunci !== 0 && sama(b, -bKunci) && sama(a, aKunci)
  if (tandaA || tandaB) {
    return { benar: false, errorTag: 'SIGN_ERROR', pesan: 'Angkanya sudah benar, tetapi tandanya terbalik. Periksa + dan −.' }
  }
  if (!sama(a, aKunci)) {
    return { benar: false, errorTag: 'SLOPE_ERROR', pesan: 'Nilai a belum tepat. Bandingkan perubahan f(x) dengan perubahan x.' }
  }
  return { benar: false, errorTag: 'OFFSET_ERROR', pesan: 'Nilai a sudah tepat. Coba substitusi satu titik untuk mencari b.' }
}

/**
 * Periksa hasil substitusi f(x) = ax + b. Mendeteksi salah tanda (IL05).
 * @returns {{benar: boolean, nilai: number, errorTag: string|null, pesan: string}}
 */
export function periksaSubstitusi(a, b, x, jawaban) {
  const nilai = nilaiFungsi(a, b, x)
  if (sama(jawaban, nilai)) return { benar: true, nilai, errorTag: null, pesan: 'Tepat!' }
  const kandidatSalahTanda = [a * -x + b, -(a * x) + b, a * x - b, -nilai].filter((v) => !sama(v, nilai))
  if (kandidatSalahTanda.some((v) => sama(v, jawaban))) {
    const pesan =
      x < 0 || a < 0
        ? 'Periksa tanda. Positif × negatif hasilnya negatif.'
        : 'Periksa tanda + dan − pada setiap langkah.'
    return { benar: false, nilai, errorTag: 'SIGN_ERROR', pesan }
  }
  return { benar: false, nilai, errorTag: null, pesan: 'Hasilnya belum tepat. Hitung a × x dulu, lalu tambahkan b.' }
}

/**
 * Langkah 1 substitusi (F8 Penanda Tanda): a × x.
 * @returns {{benar: boolean, nilai: number, errorTag: string|null, pesan: string}}
 */
export function periksaLangkahKali(a, x, jawaban) {
  const nilai = a * x
  if (sama(jawaban, nilai)) return { benar: true, nilai, errorTag: null, pesan: 'Tepat!' }
  if (nilai !== 0 && sama(jawaban, -nilai)) {
    const pesan =
      a < 0 && x < 0
        ? 'Tandanya terbalik. Negatif × negatif hasilnya positif.'
        : 'Tandanya terbalik. Positif × negatif hasilnya negatif.'
    return { benar: false, nilai, errorTag: 'SIGN_ERROR', pesan }
  }
  return { benar: false, nilai, errorTag: null, pesan: `Hitung lagi perkalian ${formatBilangan(a)} × ${formatBilangan(x, true)}.` }
}

/**
 * Langkah 2 substitusi: hasil kali + b.
 * @returns {{benar: boolean, nilai: number, errorTag: string|null, pesan: string}}
 */
export function periksaLangkahTambah(hasilKali, b, jawaban) {
  const nilai = hasilKali + b
  if (sama(jawaban, nilai)) return { benar: true, nilai, errorTag: null, pesan: 'Tepat!' }
  const salahTanda = [hasilKali - b, -hasilKali + b, -nilai].filter((v) => !sama(v, nilai))
  if (salahTanda.some((v) => sama(v, jawaban))) {
    return {
      benar: false,
      nilai,
      errorTag: 'SIGN_ERROR',
      pesan: b < 0 ? `Mengurangi ${-b} berarti mundur ${-b} langkah pada garis bilangan.` : `Menambah ${b} berarti maju ${b} langkah pada garis bilangan.`,
    }
  }
  return { benar: false, nilai, errorTag: null, pesan: 'Hitung lagi penjumlahannya langkah demi langkah.' }
}

/** Tulis bilangan dengan tanda minus asli (−) dan koma desimal. `kurung`: bungkus negatif dengan kurung. */
export function formatBilangan(n, kurung = false) {
  const teks = String(Math.abs(n)).replace('.', ',')
  if (n < 0) return kurung ? `(−${teks})` : `−${teks}`
  return teks
}

/** Rumus f(x) = ax + b sebagai teks rapi, mis. "3x − 1", "−x + 4", "2x". */
export function formatRumus(a, b) {
  let s
  if (a === 0) return formatBilangan(b)
  if (a === 1) s = 'x'
  else if (a === -1) s = '−x'
  else s = `${formatBilangan(a)}x`
  if (b === 0) return s
  return `${s} ${b < 0 ? '−' : '+'} ${formatBilangan(Math.abs(b))}`
}

/** Baca angka dari isian siswa: menerima "−7", "-7", "2,5". Mengembalikan NaN bila tidak valid. */
export function bacaAngka(teks) {
  const s = normalisasiAngka(String(teks ?? '').trim().replace(/[−–]/g, '-').replace(/\s+/g, ''))
  return /^[+-]?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN
}
