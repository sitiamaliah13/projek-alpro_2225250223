const GAYA = {
  utama: 'bg-brand text-white shadow-sm disabled:bg-slate-300 disabled:text-slate-600',
  kedua: 'border-2 border-pink-200 bg-white text-brand disabled:text-slate-400',
  petunjuk: 'border-2 border-hint bg-white text-hint-ink',
}

/** Tombol dengan target sentuh ≥ 48 px (design.md §8). */
export default function Tombol({ jenis = 'utama', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`min-h-tap w-full rounded-xl px-4 py-2 text-lg font-semibold ${GAYA[jenis]} ${className}`}
      {...props}
    />
  )
}
