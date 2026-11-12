import { Link } from 'react-router-dom'

/** Ilustrasi Mesin Fungsi yang diam (tanpa animasi, EL03): x masuk → aturan → f(x) keluar. */
function IlustrasiMesin() {
  return (
    <svg viewBox="0 0 220 140" className="h-auto w-full max-w-[240px]" role="img" aria-label="Ilustrasi mesin fungsi: x masuk, f(x) keluar">
      <circle cx="30" cy="70" r="22" fill="#FFFFFF" fillOpacity="0.95" />
      <text x="30" y="77" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2563EB">x</text>
      <path d="M54 70h22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 63l8 7-8 7" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="82" y="34" width="66" height="72" rx="14" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="3" />
      <text x="115" y="66" textAnchor="middle" fontSize="16" fill="#FFFFFF">× 2</text>
      <text x="115" y="88" textAnchor="middle" fontSize="16" fill="#FFFFFF">+ 1</text>
      <path d="M150 70h22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M166 63l8 7-8 7" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="196" cy="70" r="22" fill="#FFFFFF" fillOpacity="0.95" />
      <text x="196" y="76" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0F766E">f(x)</text>
    </svg>
  )
}

/**
 * Hero Banner Beranda. Gradien pink tua; warna matematika pada ilustrasi tetap semantik.
 * Satu ajakan utama saja: "Mulai Belajar".
 */
export default function HeroBanner({ ke, labelLanjut }) {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 to-pink-800 p-6 text-white shadow-[0_16px_34px_rgba(157,23,77,0.2)] lg:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="flex-1">
          <p className="font-semibold text-pink-100">Pemetaan Fungsi · Kelas VIII</p>
          <h2 className="mt-2 text-2xl font-bold">Belajar Pemetaan Fungsi Jadi Lebih Mudah dan Terarah!</h2>
          <p className="mt-2 text-pink-50">Pelajari langkah demi langkah, sesuai temponya sendiri.</p>
          <Link
            to={ke}
            className="mt-5 inline-flex min-h-tap items-center rounded-2xl bg-white px-5 font-bold text-brand shadow-sm"
          >
            {labelLanjut ?? 'Mulai Belajar'} →
          </Link>
        </div>
        <IlustrasiMesin />
      </div>
    </section>
  )
}
