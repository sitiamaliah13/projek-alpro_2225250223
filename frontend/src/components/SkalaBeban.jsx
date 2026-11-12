/** Skala beban kognitif Paas 1–9 (F16). */
export default function SkalaBeban({ nilai, onPilih }) {
  return (
    <div>
      {/* 5 kolom agar setiap tombol tetap ≥ 48 px di layar 360 px */}
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Skala usaha 1 sampai 9">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={nilai === n}
            onClick={() => onPilih(n)}
            className={`min-h-tap rounded-lg border-2 text-lg font-bold ${
              nilai === n ? 'border-domain bg-domain text-white' : 'border-slate-300 bg-white'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-base text-muted">
        <span>1 = sangat ringan</span>
        <span>9 = sangat berat</span>
      </div>
    </div>
  )
}
