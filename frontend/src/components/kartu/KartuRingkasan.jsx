import Teks from '../Teks.jsx'

/** Layar penutup: ringkasan inti + lencana (design.md §7, tanpa papan peringkat). */
export default function KartuRingkasan({ kartu, lencana }) {
  return (
    <div>
      <ul className="space-y-2">
        {kartu.poin.map((p, i) => (
          <li key={i} className="rounded-xl bg-white px-4 py-3">
            <Teks as="span">{p}</Teks>
          </li>
        ))}
      </ul>
      {lencana && (
        <p className="mt-5 rounded-xl border-2 border-hint bg-white px-4 py-3 text-center font-bold">
          🏅 Lencana: {lencana}
        </p>
      )}
    </div>
  )
}
