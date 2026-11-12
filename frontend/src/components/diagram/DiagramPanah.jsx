import { useId, useState } from 'react'
import { cekFungsi } from '../../lib/fungsi.js'

/**
 * Diagram panah SVG (F5 Simulasi Tarik Garis; IL01, GL01, DS01, EL02).
 * - Mode baca: tanpa `onUbah`.
 * - Mode sunting: ketuk anggota A, lalu ketuk anggota B. Ketuk pasangan yang sama lagi, atau ketuk panahnya, untuk menghapus.
 * - `tandai`: anggota A yang bermasalah diberi ⚠️ dan cincin putus-putus tepat di sampingnya (A10).
 * Tanpa animasi (EL03). Warna: domain biru, kodomain teal, panah abu tua.
 */
const W = 320
const XA = 80
const XB = 240
const NW = 72
const NH = 44
const STEP = 60
const TOP = 60

const sama = (p, q) => String(p) === String(q)

/** `sorotB`: anggota B yang diberi latar range (#CCFBF1), dipakai di M2. */
export default function DiagramPanah({ A, B, pairs, onUbah, tandai = false, judulA = 'A', judulB = 'B', sorotB = [] }) {
  const idPanah = useId().replace(/:/g, '')
  const [pilihA, setPilihA] = useState(null)
  const bisaSunting = typeof onUbah === 'function'

  const baris = Math.max(A.length, B.length)
  const H = TOP + baris * STEP + 12
  const yA = (i) => TOP + (baris - A.length) * (STEP / 2) + i * STEP + NH / 2
  const yB = (i) => TOP + (baris - B.length) * (STEP / 2) + i * STEP + NH / 2

  const isu = tandai ? cekFungsi(A, pairs).issues : []
  const bermasalah = (a) => isu.some((x) => x.a !== undefined && sama(x.a, a))

  const togglePasangan = (a, b) => {
    const ada = pairs.some(([p, q]) => sama(p, a) && sama(q, b))
    onUbah(ada ? pairs.filter(([p, q]) => !(sama(p, a) && sama(q, b))) : [...pairs, [a, b]])
  }

  const ketukA = (a) => {
    if (!bisaSunting) return
    setPilihA((lama) => (lama !== null && sama(lama, a) ? null : a))
  }
  const ketukB = (b) => {
    if (!bisaSunting || pilihA === null) return
    togglePasangan(pilihA, b)
    setPilihA(null)
  }
  const tombolKeyboard = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }

  const ringkasan = pairs.length
    ? `Diagram panah dari ${judulA} ke ${judulB}: ${pairs.map(([a, b]) => `${a} ke ${b}`).join(', ')}.`
    : `Diagram panah dari ${judulA} ke ${judulB} tanpa panah.`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="group" aria-label={ringkasan}>
        <defs>
          <marker id={idPanah} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Nama himpunan selalu terlihat (EL02) */}
        <text x={XA} y={26} textAnchor="middle" fontSize="20" fontWeight="700" fill="#2563EB">
          {judulA}
        </text>
        <text x={XB} y={26} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0D9488">
          {judulB}
        </text>
        <rect x={XA - NW / 2 - 8} y={TOP - 14} width={NW + 16} height={baris * STEP + 4} rx="24"
          fill="none" stroke="#2563EB" strokeWidth="2" />
        <rect x={XB - NW / 2 - 8} y={TOP - 14} width={NW + 16} height={baris * STEP + 4} rx="24"
          fill="none" stroke="#0D9488" strokeWidth="2" />

        {/* Panah */}
        {pairs.map(([a, b], k) => {
          const i = A.findIndex((x) => sama(x, a))
          const j = B.findIndex((x) => sama(x, b))
          if (i < 0 || j < 0) return null
          const x1 = XA + NW / 2
          const y1 = yA(i)
          const x2 = XB - NW / 2 - 4
          const y2 = yB(j)
          return (
            <g key={`${a}-${b}-${k}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="2.5" markerEnd={`url(#${idPanah})`} />
              {bisaSunting && (
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="18"
                  className="cursor-pointer"
                  role="button" tabIndex={0} aria-label={`Hapus panah ${a} ke ${b}`}
                  onClick={() => togglePasangan(a, b)}
                  onKeyDown={tombolKeyboard(() => togglePasangan(a, b))}
                />
              )}
            </g>
          )
        })}

        {/* Anggota A */}
        {A.map((a, i) => {
          const dipilih = pilihA !== null && sama(pilihA, a)
          const masalah = bermasalah(a)
          return (
            <g
              key={`A-${a}`}
              role={bisaSunting ? 'button' : undefined}
              tabIndex={bisaSunting ? 0 : undefined}
              aria-label={bisaSunting ? `Pilih ${a}` : undefined}
              aria-pressed={bisaSunting ? dipilih : undefined}
              onClick={() => ketukA(a)}
              onKeyDown={bisaSunting ? tombolKeyboard(() => ketukA(a)) : undefined}
              className={bisaSunting ? 'cursor-pointer' : undefined}
            >
              <rect x={XA - NW / 2 - 4} y={yA(i) - STEP / 2} width={NW + 8} height={STEP} fill="transparent" />
              {masalah && (
                <>
                  <rect x={XA - NW / 2 - 5} y={yA(i) - NH / 2 - 5} width={NW + 10} height={NH + 10} rx="12"
                    fill="none" stroke="#CA8A04" strokeWidth="2.5" strokeDasharray="6 4" />
                  <text x={XA - NW / 2 - 22} y={yA(i) + 7} textAnchor="middle" fontSize="20">⚠️</text>
                </>
              )}
              <rect x={XA - NW / 2} y={yA(i) - NH / 2} width={NW} height={NH} rx="10"
                fill={dipilih ? '#DBEAFE' : '#FFFFFF'} stroke="#2563EB" strokeWidth={dipilih ? 4 : 2} />
              <text x={XA} y={yA(i) + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0F172A">
                {String(a)}
              </text>
            </g>
          )
        })}

        {/* Anggota B */}
        {B.map((b, j) => (
          <g
            key={`B-${b}`}
            role={bisaSunting ? 'button' : undefined}
            tabIndex={bisaSunting ? 0 : undefined}
            aria-label={bisaSunting ? `Pasangkan ke ${b}` : undefined}
            onClick={() => ketukB(b)}
            onKeyDown={bisaSunting ? tombolKeyboard(() => ketukB(b)) : undefined}
            className={bisaSunting ? 'cursor-pointer' : undefined}
          >
            <rect x={XB - NW / 2 - 4} y={yB(j) - STEP / 2} width={NW + 8} height={STEP} fill="transparent" />
            <rect x={XB - NW / 2} y={yB(j) - NH / 2} width={NW} height={NH} rx="10"
              fill={sorotB.some((s) => sama(s, b)) ? '#CCFBF1' : '#FFFFFF'} stroke="#0D9488" strokeWidth={pilihA !== null ? 3 : 2} />
            <text x={XB} y={yB(j) + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#0F172A">
              {String(b)}
            </text>
          </g>
        ))}
      </svg>
      {bisaSunting && (
        <p className="mt-1 text-base text-muted" aria-live="polite">
          {pilihA === null ? 'Ketuk anggota A untuk mulai.' : `${pilihA} dipilih. Sekarang ketuk anggota B.`}
        </p>
      )}
    </div>
  )
}
