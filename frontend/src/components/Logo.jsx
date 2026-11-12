/** Logo FungsiKu: notasi f(x) dengan warna pink untuk identitas aplikasi. */
export function TandaLogo({ besar = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-brand font-bold italic text-white shadow-sm ${
        besar ? 'h-12 w-12 text-lg' : 'h-10 w-10 text-base'
      }`}
      aria-hidden="true"
    >
      f(x)
    </span>
  )
}

export default function Logo({ besar = false }) {
  return (
    <span className="flex items-center gap-2">
      <TandaLogo besar={besar} />
      <span className={`${besar ? 'text-2xl' : 'text-xl'} font-bold`}>
        <span className="text-brand">Fungsi</span>Ku
      </span>
    </span>
  )
}
