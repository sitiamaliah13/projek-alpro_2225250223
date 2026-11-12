import { useState } from 'react'
import Bilangan from '../Bilangan.jsx'
import { bacaRumusLinear, formatBilangan, nilaiFungsi } from '../../lib/aljabar.js'

/**
 * F12 Cek Balik (GL02): siswa menguji rumusnya sendiri pada titik yang diketahui.
 * Mandiri: bisa dipakai kapan saja, tidak dinilai, hanya dicatat pemakaiannya (api.md POST /check-back).
 * `rumus`: teks rumus siswa. `titik`: [[x, y], ...] dari soal.
 */
export default function CekBalik({ rumus, titik, onDipakai }) {
  const [hasil, setHasil] = useState(null) // { x, y, nilai } | { galat }

  const uji = (x, y) => {
    onDipakai?.()
    try {
      const { a, b } = bacaRumusLinear(rumus)
      setHasil({ x, y, nilai: nilaiFungsi(a, b, x), a, b })
    } catch (e) {
      setHasil({ galat: e.message })
    }
  }

  return (
    <section className="mt-4 rounded-2xl border-2 border-slate-300 bg-white p-3" aria-label="Cek Balik">
      <p className="font-semibold">🔁 Cek Balik</p>
      <p className="text-base text-muted">Ketuk satu titik. Rumusmu akan diuji dengan nilai x itu.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {titik.map(([x, y]) => (
          <button
            key={x}
            type="button"
            onClick={() => uji(x, y)}
            disabled={!rumus.trim()}
            className="min-h-tap rounded-xl border-2 border-domain bg-white px-3 font-semibold disabled:border-slate-300 disabled:text-slate-400"
          >
            x = {formatBilangan(x)}
          </button>
        ))}
      </div>
      {!rumus.trim() && <p className="mt-2 text-base text-muted">Tulis rumusmu dulu di atas.</p>}
      {hasil?.galat && <p className="mt-2" role="status">⚠️ {hasil.galat} Contoh penulisan: 3x − 1.</p>}
      {hasil && !hasil.galat && (
        <p className="mt-2" role="status">
          f(<Bilangan nilai={hasil.x} kurung peran="x" />) = <Bilangan nilai={hasil.a} /> × <Bilangan nilai={hasil.x} kurung peran="x" />{' '}
          {hasil.b < 0 ? '−' : '+'} <Bilangan nilai={Math.abs(hasil.b)} /> = <Bilangan nilai={hasil.nilai} peran="fx" />
          <br />
          {Math.abs(hasil.nilai - hasil.y) < 1e-9 ? (
            <strong className="text-ok-ink">✓ Cocok dengan tabel ({formatBilangan(hasil.y)}).</strong>
          ) : (
            <strong>⚠️ Belum cocok. Seharusnya {formatBilangan(hasil.y)}.</strong>
          )}
        </p>
      )}
    </section>
  )
}
