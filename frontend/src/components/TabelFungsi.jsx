import Bilangan from './Bilangan.jsx'

/**
 * Tabel x | f(x) mendatar (design.md §4.2 tahap 3–5).
 * - x selalu biru (domain), f(x) teal (kodomain), negatif ungu.
 * - `selisih`: tampilkan perubahan antarkolom (+1 di x → +a di f(x)); tahap 4 "pola".
 * - `kosong`: daftar x yang nilai f(x)-nya ditampilkan "?".
 * - `sorot`: x yang kolomnya disorot (garis tebal, bukan warna baru).
 */
export default function TabelFungsi({ titik, selisih = false, kosong = [], sorot = [], namaF = 'f(x)' }) {
  const diSorot = (x) => sorot.includes(x)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white text-center text-lg">
        <tbody>
          <tr>
            <th scope="row" className="border border-slate-300 px-2 py-2 text-domain">x</th>
            {titik.map(([x]) => (
              <td key={`x${x}`} className={`border px-2 py-2 ${diSorot(x) ? 'border-2 border-ink' : 'border-slate-300'}`}>
                <Bilangan nilai={x} peran="x" />
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="border border-slate-300 px-2 py-2 text-codomain">{namaF}</th>
            {titik.map(([x, y]) => (
              <td key={`y${x}`} className={`border px-2 py-2 ${diSorot(x) ? 'border-2 border-ink' : 'border-slate-300'}`}>
                {kosong.includes(x) ? <span className="font-bold">?</span> : <Bilangan nilai={y} peran="fx" />}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {selisih && titik.length > 1 && (
        <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${titik.length - 1}, minmax(0, 1fr))` }}>
          {titik.slice(1).map(([x, y], i) => {
            const [x0, y0] = titik[i]
            const dx = x - x0
            const dy = y - y0
            return (
              <div key={x} className="rounded-lg bg-white px-1 py-1 text-center text-base">
                <span className="text-domain">x {dx >= 0 ? '+' : '−'}{Math.abs(dx)}</span>
                <br />
                <span className={dy < 0 ? 'text-negative' : 'text-codomain'}>f {dy >= 0 ? '+' : '−'}{Math.abs(dy)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
