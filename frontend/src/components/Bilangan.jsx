import { formatBilangan } from '../lib/aljabar.js'

/**
 * Penanda Tanda (F8, IL05): bilangan negatif OTOMATIS diberi kurung (bila `kurung`) dan warna ungu
 * (token `negative`). Bilangan positif tetap warna teks biasa. Warna selalu disertai tanda "−" (design.md §8).
 * `peran`: 'x' (biru, domain) atau 'fx' (teal, kodomain) untuk menjaga warna representasi (design.md §4.2).
 */
export default function Bilangan({ nilai, kurung = false, peran, tebal = true }) {
  const negatif = nilai < 0
  let warna = ''
  if (negatif) warna = 'text-negative'
  else if (peran === 'x') warna = 'text-domain'
  else if (peran === 'fx') warna = 'text-codomain'
  return (
    <span className={`${warna} ${tebal ? 'font-bold' : ''} whitespace-nowrap`}>
      {formatBilangan(nilai, kurung && negatif)}
    </span>
  )
}
