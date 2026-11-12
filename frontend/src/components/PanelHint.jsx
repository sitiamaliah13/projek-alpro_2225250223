import Teks from './Teks.jsx'

/** Petunjuk 3 tingkat yang hanya muncul bila diminta (A8, GL03). */
export default function PanelHint({ petunjuk = [], terbuka, onBuka }) {
  if (petunjuk.length === 0) return null
  const masihAda = terbuka < petunjuk.length
  return (
    <div className="mt-4">
      {petunjuk.slice(0, terbuka).map((h, i) => (
        <div key={i} className="mb-2 rounded-xl border-2 border-hint bg-white px-4 py-2">
          <span className="font-bold text-hint-ink">💡 Petunjuk {i + 1}. </span>
          <Teks as="span">{h}</Teks>
        </div>
      ))}
      {masihAda && (
        <button
          type="button"
          onClick={onBuka}
          className="min-h-tap rounded-xl px-2 font-semibold text-hint-ink underline"
        >
          💡 {terbuka === 0 ? 'Minta petunjuk' : 'Petunjuk berikutnya'} ({terbuka + 1}/{petunjuk.length})
        </button>
      )}
    </div>
  )
}
