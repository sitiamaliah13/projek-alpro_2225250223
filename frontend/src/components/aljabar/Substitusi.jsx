import { useState } from 'react'
import Bilangan from '../Bilangan.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import InputAngka from '../InputAngka.jsx'
import PanelHint from '../PanelHint.jsx'
import { bacaAngka, formatBilangan, periksaLangkahKali, periksaLangkahTambah } from '../../lib/aljabar.js'

/** Bagian "+ b" atau "− b" dari rumus; b = 0 tidak ditulis. */
function SukuB({ b }) {
  if (b === 0) return null
  return (
    <>
      {' '}
      {b < 0 ? '−' : '+'} <Bilangan nilai={Math.abs(b)} />
    </>
  )
}

/**
 * F8 Substitusi + Penanda Tanda (IL05, DS02).
 * Langkah 1: siswa mengetik nilai x → otomatis ditampilkan dalam kurung dan ungu bila negatif.
 * Langkah 2: a × x.  Langkah 3: hasil + b.  Setiap langkah dicek; umpan balik menunjuk langkah yang salah.
 */
export default function Substitusi({ a, b, x, petunjuk = [], onSelesai }) {
  const [langkah, setLangkah] = useState(0) // 0 ketik x, 1 kali, 2 tambah, 3 selesai
  const [isian, setIsian] = useState('')
  const [umpan, setUmpan] = useState(null)
  const [hint, setHint] = useState(0)
  const [catatan, setCatatan] = useState({ tries: 0, salah: 0, errorTag: null })

  const nilaiIsian = bacaAngka(isian)
  const xKetik = langkah === 0 ? nilaiIsian : x
  const xTampil = Number.isNaN(xKetik) ? null : xKetik
  const hasilKali = a * x

  const catat = (benar, errorTag) =>
    setCatatan((c) => ({ tries: c.tries + 1, salah: c.salah + (benar ? 0 : 1), errorTag: c.errorTag ?? errorTag ?? null }))

  const periksa = () => {
    if (langkah === 0) {
      if (nilaiIsian === x) {
        setUmpan(null)
        setLangkah(1)
        setIsian('')
      } else {
        setUmpan({ jenis: 'salah', teks: `Lihat soalnya lagi. Nilai x yang dimasukkan adalah ${formatBilangan(x)}.` })
      }
      return
    }
    const h = langkah === 1 ? periksaLangkahKali(a, x, nilaiIsian) : periksaLangkahTambah(hasilKali, b, nilaiIsian)
    catat(h.benar, h.errorTag)
    if (!h.benar) {
      setUmpan({ jenis: 'salah', teks: `Langkah ${langkah + 1}: ${h.pesan}` })
      return
    }
    setUmpan(null)
    setIsian('')
    const berikut = langkah + 1
    setLangkah(berikut)
    if (berikut === 3) {
      // tries = banyak percobaan untuk soal ini (1 = langsung benar), bukan banyak langkah.
      onSelesai?.({
        correct: catatan.salah === 0,
        tries: catatan.salah + 1,
        hints_used: hint,
        error_tag: catatan.errorTag,
      })
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4">
      {/* Baris substitusi: selalu terlihat, terisi bertahap */}
      <p className="text-xl" aria-live="polite">
        f({xTampil === null ? '□' : <Bilangan nilai={xTampil} />}) = <Bilangan nilai={a} /> ×{' '}
        {xTampil === null ? '□' : <Bilangan nilai={xTampil} kurung />}
        <SukuB b={b} />
      </p>

      <ol className="mt-3 space-y-2">
        {langkah >= 2 && (
          <li>
            ✓ <Bilangan nilai={a} /> × <Bilangan nilai={x} kurung /> = <Bilangan nilai={hasilKali} />
          </li>
        )}
        {langkah >= 3 && (
          <li>
            ✓ <Bilangan nilai={hasilKali} />
            <SukuB b={b} /> = <Bilangan nilai={hasilKali + b} />
          </li>
        )}
      </ol>

      {langkah < 3 && (
        <div className="mt-3">
          <p className="mb-2 font-semibold">
            {langkah === 0 && 'Langkah 1. Ketik nilai x yang dimasukkan.'}
            {langkah === 1 && (
              <>
                Langkah 2. <Bilangan nilai={a} /> × <Bilangan nilai={x} kurung /> = ?
              </>
            )}
            {langkah === 2 && (
              <>
                Langkah 3. <Bilangan nilai={hasilKali} />
                <SukuB b={b} /> = ?
              </>
            )}
          </p>
          <InputAngka nilai={isian} onUbah={setIsian} label={`Jawaban langkah ${langkah + 1}`} />
          <Tombol className="mt-3" disabled={Number.isNaN(nilaiIsian)} onClick={periksa}>
            Periksa
          </Tombol>
        </div>
      )}

      {umpan && <UmpanBalik jenis={umpan.jenis}>{umpan.teks}</UmpanBalik>}
      {langkah === 3 && (
        <UmpanBalik jenis="benar">
          {`Jadi f(${formatBilangan(x)}) = ${formatBilangan(hasilKali + b)}.`}
        </UmpanBalik>
      )}
      {langkah > 0 && langkah < 3 && <PanelHint petunjuk={petunjuk} terbuka={hint} onBuka={() => setHint(hint + 1)} />}
    </div>
  )
}
