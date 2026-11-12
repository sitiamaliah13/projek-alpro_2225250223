import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import Bilangan from '../Bilangan.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import TabelFungsi from '../TabelFungsi.jsx'
import PertanyaanSingkat from '../PertanyaanSingkat.jsx'
import CekBalik from '../aljabar/CekBalik.jsx'
import { formatBilangan, formatRumus, periksaRumus, rumusDariDuaNilai } from '../../lib/aljabar.js'

/**
 * M6 Menyusun Rumus Fungsi dari tabel atau dua nilai (temuan F-2, design.md §4.3).
 * Strategi tabel/perubahan: perubahan x → perubahan f(x) → a → b → tulis rumus.
 * Cek Balik (F12, GL02) tersedia mandiri pada langkah menulis rumus.
 */
export default function KartuRumus({ kartu, onSelesai }) {
  const [[x1, y1], [x2, y2]] = kartu.titik
  const { a, b } = rumusDariDuaNilai(x1, y1, x2, y2)
  const dx = x2 - x1
  const dy = y2 - y1
  const f = (n) => formatBilangan(n, true)

  const langkah = [
    {
      teks: `Perubahan x: ${f(x2)} − ${f(x1)} = ?`,
      tipe: 'angka', kunci: dx,
      benar: `Perubahan x = ${formatBilangan(dx)}.`,
      salah: 'Kurangkan x kedua dengan x pertama. Perhatikan tanda negatifnya.',
      petunjuk: ['Ambil x kedua, lalu kurangi x pertama.', 'Mengurangi bilangan negatif sama dengan menambah.'],
    },
    {
      teks: `Perubahan f(x): ${f(y2)} − ${f(y1)} = ?`,
      tipe: 'angka', kunci: dy,
      benar: `Perubahan f(x) = ${formatBilangan(dy)}.`,
      salah: 'Kurangkan f(x) kedua dengan f(x) pertama, dengan urutan yang sama seperti x.',
      petunjuk: ['Urutannya harus sama dengan perubahan x.', 'Mengurangi bilangan negatif sama dengan menambah.'],
    },
    {
      teks: `a = perubahan f(x) : perubahan x = ${formatBilangan(dy)} : ${formatBilangan(dx)} = ?`,
      tipe: 'angka', kunci: a,
      benar: `a = ${formatBilangan(a)}. Setiap x naik 1, f(x) berubah ${formatBilangan(a)}.`,
      salah: 'Bagi perubahan f(x) dengan perubahan x.',
      petunjuk: ['a menunjukkan perubahan f(x) setiap x naik 1.', 'Hasil bagi dua bilangan bertanda sama adalah positif.'],
    },
    {
      teks: `Substitusi titik (${formatBilangan(x1)}, ${formatBilangan(y1)}): ${formatBilangan(a)} × ${f(x1)} + b = ${formatBilangan(y1)}. b = ?`,
      tipe: 'angka', kunci: b,
      benar: `b = ${formatBilangan(b)}.`,
      salah: `Hitung dulu ${formatBilangan(a)} × ${f(x1)}. Lalu cari bilangan yang ditambahkan agar hasilnya ${formatBilangan(y1)}.`,
      petunjuk: [`${formatBilangan(a)} × ${f(x1)} = ${formatBilangan(a * x1)}.`, `${formatBilangan(a * x1)} + b = ${formatBilangan(y1)}, jadi b = ${formatBilangan(y1)} − ${f(a * x1)}.`],
    },
  ]

  const [ke, setKe] = useState(0) // 0–3 langkah angka, 4 tulis rumus, 5 selesai
  const [catatan, setCatatan] = useState({ tries: 0, hints: 0, semuaBenar: true })
  const [rumus, setRumus] = useState('')
  const [hasilRumus, setHasilRumus] = useState(null)
  const [pakaiCekBalik, setPakaiCekBalik] = useState(false)
  const [tagPertama, setTagPertama] = useState(null) // jenis kesalahan rumus pertama, untuk tren error_tag

  const selesaiLangkah = (h) => {
    setCatatan((c) => ({ tries: c.tries + h.tries, hints: c.hints + h.hints_used, semuaBenar: c.semuaBenar && h.correct && h.tries === 1 }))
    setKe(ke + 1)
  }

  const periksa = () => {
    const h = periksaRumus(rumus, a, b)
    setHasilRumus(h)
    const tries = catatan.tries + 1
    setCatatan((c) => ({ ...c, tries, semuaBenar: c.semuaBenar && h.benar }))
    if (!h.benar && !tagPertama && h.errorTag) setTagPertama(h.errorTag)
    if (h.benar) {
      setKe(5)
      onSelesai?.({
        correct: catatan.semuaBenar,
        tries: catatan.semuaBenar ? 1 : tries,
        hints_used: catatan.hints,
        error_tag: tagPertama,
        used_check_back: pakaiCekBalik,
      })
    }
  }

  return (
    <div>
      {kartu.isi.map((t, i) => (
        <Teks key={i} className="mb-2">
          {t}
        </Teks>
      ))}
      {kartu.mode === 'dua_nilai' && (
        <p className="mb-2 rounded-2xl bg-white p-3 text-xl">
          f(<Bilangan nilai={x1} peran="x" />) = <Bilangan nilai={y1} peran="fx" /> dan f(<Bilangan nilai={x2} peran="x" />) ={' '}
          <Bilangan nilai={y2} peran="fx" />
        </p>
      )}
      <TabelFungsi titik={kartu.titik} />

      <ol className="mt-3 space-y-2">
        {langkah.slice(0, ke).map((l, i) => (
          <li key={i} className="rounded-xl bg-white px-4 py-2">
            ✓ {l.benar}
          </li>
        ))}
      </ol>

      {ke < 4 && <PertanyaanSingkat key={ke} tanya={langkah[ke]} onSelesai={selesaiLangkah} />}

      {ke >= 4 && (
        <div className="mt-4">
          <label className="block font-semibold" htmlFor={`rumus-${kartu.id}`}>
            Tulis rumusnya: f(x) =
          </label>
          <input
            id={`rumus-${kartu.id}`}
            value={rumus}
            disabled={ke === 5}
            onChange={(e) => {
              setRumus(e.target.value)
              setHasilRumus(null)
            }}
            placeholder="contoh: 3x − 1"
            autoComplete="off"
            className="mt-2 min-h-tap w-full rounded-xl border-2 border-slate-300 px-4 text-xl font-semibold"
          />
          <CekBalik rumus={rumus} titik={kartu.titik} onDipakai={() => setPakaiCekBalik(true)} />
          {ke === 4 && (
            <Tombol className="mt-3" disabled={!rumus.trim()} onClick={periksa}>
              Periksa rumus
            </Tombol>
          )}
          {hasilRumus && !hasilRumus.benar && <UmpanBalik jenis="salah">{hasilRumus.pesan}</UmpanBalik>}
          {ke === 5 && <UmpanBalik jenis="benar">{`Tepat! f(x) = ${formatRumus(a, b)}.`}</UmpanBalik>}
        </div>
      )}
    </div>
  )
}
