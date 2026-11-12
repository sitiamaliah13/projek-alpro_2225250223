import { formatBilangan } from '../../lib/aljabar.js'

/**
 * Alternatif statis Mesin Fungsi (SVG 2D) untuk sakelar "Matikan 3D" dan HP RAM kecil.
 * Isi dan interaksinya sama dengan versi 3D; hanya tampilannya datar.
 * tahap: 0 = x belum masuk, 1 = x di dalam mesin, 2 = f(x) keluar.
 */
export default function MesinFungsiStatis({ aturan, x, fx, tahap }) {
  const warnaX = x < 0 ? '#9333EA' : '#2563EB'
  const warnaF = fx < 0 ? '#9333EA' : '#0D9488'
  return (
    <svg viewBox="0 0 320 170" className="w-full rounded-2xl bg-white" role="img" aria-label={`Mesin fungsi ${aturan}`}>
      {/* masukan */}
      <circle cx="44" cy="85" r="28" fill="#FFFFFF" stroke={warnaX} strokeWidth={tahap === 0 ? 4 : 2} strokeDasharray={tahap === 0 ? undefined : '5 4'} />
      <text x="44" y="92" textAnchor="middle" fontSize="20" fontWeight="700" fill={warnaX}>
        {tahap === 0 ? formatBilangan(x) : ''}
      </text>
      <text x="44" y="140" textAnchor="middle" fontSize="16" fill="#475569">x</text>
      <line x1="76" y1="85" x2="100" y2="85" stroke="#475569" strokeWidth="3" />

      {/* mesin = aturan (warna panah/aturan) */}
      <rect x="102" y="40" width="116" height="90" rx="14" fill="#F1F5F9" stroke="#475569" strokeWidth="3" />
      <text x="160" y="72" textAnchor="middle" fontSize="16" fill="#475569">aturan</text>
      <text x="160" y="98" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F172A">{aturan}</text>
      {tahap === 1 && (
        <text x="160" y="122" textAnchor="middle" fontSize="18" fontWeight="700" fill={warnaX}>
          x = {formatBilangan(x)}
        </text>
      )}

      {/* keluaran */}
      <line x1="220" y1="85" x2="244" y2="85" stroke="#475569" strokeWidth="3" />
      <circle cx="276" cy="85" r="28" fill="#FFFFFF" stroke={tahap === 2 ? warnaF : '#0D9488'} strokeWidth={tahap === 2 ? 4 : 2} strokeDasharray={tahap === 2 ? undefined : '5 4'} />
      <text x="276" y="92" textAnchor="middle" fontSize="20" fontWeight="700" fill={warnaF}>
        {tahap === 2 ? formatBilangan(fx) : ''}
      </text>
      <text x="276" y="140" textAnchor="middle" fontSize="16" fill="#475569">f(x)</text>
    </svg>
  )
}
