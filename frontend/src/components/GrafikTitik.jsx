import { formatBilangan } from '../lib/aljabar.js'

/**
 * Grafik titik (x, f(x)) pada bidang koordinat, SVG 2D (design.md §4.2 tahap 6).
 * Titik diketuk untuk menampilkan koordinatnya tepat di sampingnya (A10). Tanpa animasi.
 */
const W = 320
const H = 300
const PAD = 36

export default function GrafikTitik({ titik, terpilih, onPilih, garis = false }) {
  const xs = [0, ...titik.map(([x]) => x)]
  const ys = [0, ...titik.map(([, y]) => y)]
  const xMin = Math.min(...xs) - 1
  const xMax = Math.max(...xs) + 1
  const yMin = Math.min(...ys) - 1
  const yMax = Math.max(...ys) + 1
  const px = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD)
  const py = (y) => H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD)
  const bulat = (a, b) => Array.from({ length: Math.floor(b) - Math.ceil(a) + 1 }, (_, i) => Math.ceil(a) + i)

  const ringkas = `Grafik titik: ${titik.map(([x, y]) => `(${formatBilangan(x)}, ${formatBilangan(y)})`).join(', ')}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl bg-white" role="group" aria-label={ringkas}>
      {/* kisi tipis */}
      {bulat(xMin, xMax).map((x) => (
        <line key={`gx${x}`} x1={px(x)} y1={PAD / 2} x2={px(x)} y2={H - PAD / 2} stroke="#E2E8F0" />
      ))}
      {bulat(yMin, yMax).map((y) => (
        <line key={`gy${y}`} x1={PAD / 2} y1={py(y)} x2={W - PAD / 2} y2={py(y)} stroke="#E2E8F0" />
      ))}
      {/* sumbu: x biru, y teal (warna sama dengan x dan f(x)) */}
      <line x1={PAD / 2} y1={py(0)} x2={W - PAD / 2} y2={py(0)} stroke="#2563EB" strokeWidth="2" />
      <line x1={px(0)} y1={H - PAD / 2} x2={px(0)} y2={PAD / 2} stroke="#0D9488" strokeWidth="2" />
      <text x={W - PAD / 2} y={py(0) - 6} textAnchor="end" fontSize="18" fontWeight="700" fill="#2563EB">x</text>
      <text x={px(0) + 6} y={PAD / 2 + 14} fontSize="18" fontWeight="700" fill="#0D9488">f(x)</text>

      {garis && titik.length > 1 && (
        <line
          x1={px(titik[0][0])} y1={py(titik[0][1])}
          x2={px(titik[titik.length - 1][0])} y2={py(titik[titik.length - 1][1])}
          stroke="#475569" strokeWidth="2" strokeDasharray="6 5"
        />
      )}

      {titik.map(([x, y]) => {
        const pilih = terpilih !== undefined && terpilih !== null && terpilih[0] === x && terpilih[1] === y
        return (
          <g
            key={`${x},${y}`}
            role={onPilih ? 'button' : undefined}
            tabIndex={onPilih ? 0 : undefined}
            aria-label={onPilih ? `Titik x ${formatBilangan(x)}` : undefined}
            onClick={onPilih ? () => onPilih([x, y]) : undefined}
            onKeyDown={onPilih ? (e) => (e.key === 'Enter' || e.key === ' ') && onPilih([x, y]) : undefined}
            className={onPilih ? 'cursor-pointer' : undefined}
          >
            <circle cx={px(x)} cy={py(y)} r="22" fill="transparent" />
            <circle cx={px(x)} cy={py(y)} r={pilih ? 9 : 7} fill={y < 0 ? '#9333EA' : '#0F172A'} stroke="#fff" strokeWidth="2" />
            {pilih && (
              <text x={px(x) + 12} y={py(y) - 10} fontSize="18" fontWeight="700" fill="#0F172A">
                ({formatBilangan(x)}, {formatBilangan(y)})
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
