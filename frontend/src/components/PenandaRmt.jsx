/**
 * Penanda fase RMT dan fungsi kognitif sasaran (RMT-1, RMT-2).
 * Teks kecil satu baris, tanpa animasi, tanpa warna baru (EL03, design.md §1).
 * Arti fungsi kognitif hanya tampil bila siswa mengetuknya (siswa mengatur informasi).
 */
export default function PenandaRmt({ rmt }) {
  if (!rmt) return null
  return (
    <details className="mb-2 text-base text-muted">
      <summary className="min-h-tap cursor-pointer py-2">
        {rmt.fase.kode === 'R' ? 'Refleksi' : `Fase ${rmt.fase.kode}`} · <span className="font-semibold text-ink">{rmt.fungsi.nama}</span>
      </summary>
      <p className="rounded-xl bg-white px-3 py-2">
        {rmt.fase.nama}. <span className="font-semibold">Fungsi kognitif – {rmt.fungsi.nama}:</span> {rmt.fungsi.arti}
      </p>
    </details>
  )
}
