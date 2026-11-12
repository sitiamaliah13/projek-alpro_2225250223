import { useState } from 'react'
import Teks from '../Teks.jsx'
import Tombol from '../Tombol.jsx'
import UmpanBalik from '../UmpanBalik.jsx'
import PanelHint from '../PanelHint.jsx'
import InputAngka from '../InputAngka.jsx'
import { bacaAngka, formatBilangan, formatRumus, periksaRumus } from '../../lib/aljabar.js'

/**
 * F13 Soal literasi 4 langkah (EL01, EL05, GL05; design.md §4.5):
 * ① Pahami (tandai info penting, ada satu pengecoh) → ② Rumuskan → ③ Hitung → ④ Tafsirkan.
 * Langkah berikutnya terbuka setelah langkah sebelumnya selesai. "Kerjakan langsung" melewati ①.
 */
const LANGKAH = ['Pahami', 'Rumuskan', 'Hitung', 'Tafsirkan']
const ribuan = (teks) => teks.replace(/\d+/g, (d) => d.replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
const rp = (n) => `Rp${ribuan(formatBilangan(n))}`

export default function KartuLiterasi({ kartu, onSelesai }) {
  const { a, b } = kartu.rumus
  const nilai = a * kartu.hitung.x + b
  const [ke, setKe] = useState(0) // 0..3, 4 = selesai
  const [tanda, setTanda] = useState([])
  const [rumus, setRumus] = useState('')
  const [isian, setIsian] = useState('')
  const [pilih, setPilih] = useState(null)
  const [umpan, setUmpan] = useState(null)
  const [hint, setHint] = useState(0)
  const [catatan, setCatatan] = useState({ salah: 0, hints: 0, tag: null, langsung: false })

  const salah = (pesan, tag = null) => {
    setUmpan({ jenis: 'salah', teks: pesan })
    setCatatan((c) => ({ ...c, salah: c.salah + 1, tag: c.tag ?? tag }))
  }

  const maju = (catatanBaru = catatan) => {
    setUmpan(null)
    setCatatan((c) => ({ ...c, hints: c.hints + hint }))
    setHint(0)
    const n = ke + 1
    setKe(n)
    if (n === 4) {
      const c = catatanBaru
      onSelesai?.({ correct: c.salah === 0, tries: c.salah + 1, hints_used: c.hints + hint, error_tag: c.tag, skip_pahami: c.langsung })
    }
  }

  const periksa = () => {
    if (ke === 0) {
      const pengecoh = tanda.filter((i) => !kartu.info[i].penting)
      const kurang = kartu.info.filter((x, i) => x.penting && !tanda.includes(i))
      if (pengecoh.length) return salah(`“${kartu.info[pengecoh[0]].teks}” tidak diperlukan untuk menjawab pertanyaan.`)
      if (kurang.length) return salah('Masih ada informasi penting yang belum ditandai.')
      return maju()
    }
    if (ke === 1) {
      const h = periksaRumus(rumus, a, b)
      if (!h.benar) return salah(h.pesan, h.errorTag)
      return maju()
    }
    if (ke === 2) {
      const j = bacaAngka(isian)
      if (j === nilai) return maju()
      if (j === a * kartu.hitung.x) return salah(`Biaya awal ${rp(b)} belum ditambahkan.`)
      return salah(`Ganti x dengan ${kartu.hitung.x}, kalikan dulu, lalu tambahkan ${formatBilangan(b)}.`)
    }
    if (pilih === kartu.tafsir.kunci) {
      return maju()
    }
    // Catatan "salah" dihitung di sini juga agar onSelesai memakai nilai terbaru.
    salah(kartu.tafsir.salah, 'UNIT_ERROR')
  }

  const bisaPeriksa =
    (ke === 0 && tanda.length > 0) ||
    (ke === 1 && rumus.trim() !== '') ||
    (ke === 2 && !Number.isNaN(bacaAngka(isian))) ||
    (ke === 3 && pilih !== null)

  return (
    <div>
      <ol className="mb-3 grid grid-cols-4 gap-1" aria-label={`Langkah ${Math.min(ke + 1, 4)} dari 4`}>
        {LANGKAH.map((n, i) => (
          <li
            key={n}
            aria-current={i === ke ? 'step' : undefined}
            className={`rounded-lg border-2 px-1 py-1 text-center text-base ${
              i === ke ? 'border-domain bg-white font-bold' : i < ke ? 'border-slate-300 bg-white' : 'border-dashed border-slate-300'
            }`}
          >
            {i < ke ? '✓' : `${i + 1}.`} {n}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl bg-white p-3">
        {kartu.stem.map((t, i) => (
          <Teks key={i} className="mb-1">
            {t}
          </Teks>
        ))}
        <Teks className="mt-2 font-bold">{kartu.tanya}</Teks>
      </div>

      {/* Ringkasan langkah yang sudah selesai */}
      <ul className="mt-3 space-y-1">
        {ke > 0 && !catatan.langsung && (
          <li>✓ Info penting: {kartu.info.filter((x) => x.penting).map((x) => x.teks).join(', ')}</li>
        )}
        {ke > 1 && <li>✓ f(x) = {ribuan(formatRumus(a, b))} ({kartu.variabel})</li>}
        {ke > 2 && (
          <li>
            ✓ f({kartu.hitung.x}) = {rp(nilai)}
          </li>
        )}
      </ul>

      {ke === 0 && (
        <div className="mt-3">
          <p className="font-semibold">① Pahami: ketuk informasi yang penting.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {kartu.info.map((x, i) => {
              const dipilih = tanda.includes(i)
              return (
                <button
                  key={x.teks}
                  type="button"
                  aria-pressed={dipilih}
                  onClick={() => {
                    setUmpan(null)
                    setTanda((t) => (dipilih ? t.filter((k) => k !== i) : [...t, i]))
                  }}
                  className={`min-h-tap rounded-xl border-2 px-3 font-semibold ${dipilih ? 'border-domain bg-white' : 'border-slate-300 bg-white'}`}
                >
                  {dipilih ? '✓ ' : ''}
                  {x.teks}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              const c = { ...catatan, langsung: true }
              setCatatan(c)
              maju(c)
            }}
            className="mt-2 min-h-tap px-1 font-semibold text-muted underline"
          >
            Kerjakan langsung →
          </button>
        </div>
      )}

      {ke === 1 && (
        <label className="mt-3 block">
          <span className="font-semibold">② Rumuskan: {kartu.variabel}. f(x) =</span>
          <input
            value={rumus}
            onChange={(e) => {
              setRumus(e.target.value)
              setUmpan(null)
            }}
            placeholder="contoh: 3.000x + 4.000"
            autoComplete="off"
            className="mt-2 min-h-tap w-full rounded-xl border-2 border-slate-300 px-4 text-xl font-semibold"
          />
        </label>
      )}

      {ke === 2 && (
        <div className="mt-3">
          <p className="mb-2 font-semibold">
            ③ Hitung: f({kartu.hitung.x}) = ? ({kartu.hitung.satuan})
          </p>
          <InputAngka nilai={isian} onUbah={(v) => { setIsian(v); setUmpan(null) }} label={`f(${kartu.hitung.x})`} />
        </div>
      )}

      {ke === 3 && (
        <div className="mt-3">
          <p className="mb-2 font-semibold">④ Tafsirkan: pilih jawaban beserta alasannya.</p>
          <div className="space-y-2">
            {kartu.tafsir.pilihan.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-pressed={pilih === i}
                onClick={() => {
                  setPilih(i)
                  setUmpan(null)
                }}
                className={`min-h-tap w-full rounded-xl border-2 bg-white px-4 py-2 text-left ${pilih === i ? 'border-domain' : 'border-slate-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {ke < 4 && (
        <Tombol className="mt-3" disabled={!bisaPeriksa} onClick={periksa}>
          Periksa
        </Tombol>
      )}
      {umpan && <UmpanBalik jenis={umpan.jenis}>{umpan.teks}</UmpanBalik>}
      {ke === 4 && <UmpanBalik jenis="benar">{kartu.tafsir.benar}</UmpanBalik>}
      {ke < 4 && (
        <PanelHint petunjuk={kartu.petunjuk[LANGKAH[ke].toLowerCase()] ?? []} terbuka={hint} onBuka={() => setHint(hint + 1)} />
      )}
    </div>
  )
}
