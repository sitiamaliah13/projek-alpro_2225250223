/** Menampilkan teks konten dengan penebalan **kata** (signaling, tanpa warna tambahan). */
export default function Teks({ children, as: Tag = 'p', className = '' }) {
  const bagian = String(children ?? '').split('**')
  return (
    <Tag className={className}>
      {bagian.map((t, i) => (i % 2 === 1 ? <strong key={i}>{t}</strong> : t))}
    </Tag>
  )
}
