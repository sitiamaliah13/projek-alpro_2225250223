/**
 * Isian angka dengan tombol ± terpisah, karena keyboard angka di sebagian HP Android
 * tidak punya tanda minus. Bilangan negatif ditampilkan ungu (token negative, IL05).
 */
export default function InputAngka({ nilai, onUbah, label, disabled }) {
  const negatif = nilai.trim().startsWith('-') || nilai.trim().startsWith('−')
  const balikTanda = () => {
    const t = nilai.trim().replace(/^[−-]/, '')
    onUbah(negatif ? t : `-${t}`)
  }
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={balikTanda}
        disabled={disabled}
        className="min-h-tap min-w-tap rounded-xl border-2 border-slate-300 bg-white text-xl font-bold"
        aria-label="Ubah tanda positif/negatif"
      >
        ±
      </button>
      <input
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={nilai}
        disabled={disabled}
        onChange={(e) => onUbah(e.target.value)}
        className={`min-h-tap w-full rounded-xl border-2 border-slate-300 px-4 text-xl font-semibold ${
          negatif ? 'text-negative' : 'text-ink'
        }`}
      />
    </div>
  )
}
