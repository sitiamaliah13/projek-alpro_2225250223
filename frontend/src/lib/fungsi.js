/**
 * Cek syarat fungsi (IL01). Logika ini kembar dengan python/fungsiku_core/function_check.py.
 * Bila salah satu diubah, ubah keduanya dan jalankan kasus uji yang sama (agents.md aturan 8).
 *
 * Fungsi dari A ke B: SETIAP anggota A punya TEPAT SATU pasangan di B.
 */

const kunci = (v) => String(v)

/**
 * @param {Array<string|number>} domain  anggota himpunan A
 * @param {Array<[string|number, string|number]>} pairs  pasangan [a, b]
 * @returns {{ isFunction: boolean, issues: Array<{tag: string, a?: any, targets?: any[]}>, range: any[] }}
 */
export function cekFungsi(domain, pairs) {
  if (!domain || domain.length === 0) {
    return { isFunction: false, issues: [{ tag: 'EMPTY_DOMAIN' }], range: [] }
  }

  const pasanganDari = new Map(domain.map((a) => [kunci(a), []]))
  const diLuarDomain = []
  for (const [a, b] of pairs) {
    const daftar = pasanganDari.get(kunci(a))
    if (!daftar) {
      if (!diLuarDomain.some((x) => kunci(x) === kunci(a))) diLuarDomain.push(a)
    } else if (!daftar.some((t) => kunci(t) === kunci(b))) {
      daftar.push(b) // panah ganda yang sama dihitung sekali
    }
  }

  const issues = []
  for (const a of domain) {
    const targets = pasanganDari.get(kunci(a))
    if (targets.length === 0) issues.push({ tag: 'NO_PAIR', a })
    else if (targets.length > 1) issues.push({ tag: 'MULTI_PAIR', a, targets: [...targets] })
  }
  for (const a of diLuarDomain) issues.push({ tag: 'OUT_OF_DOMAIN', a })

  const range = []
  for (const targets of pasanganDari.values()) {
    for (const b of targets) if (!range.some((r) => kunci(r) === kunci(b))) range.push(b)
  }

  return { isFunction: issues.length === 0, issues, range }
}

/** Korespondensi satu-satu: fungsi, banyak anggota A = B, dan setiap anggota B terpasang tepat sekali. */
export function isKorespondensiSatuSatu(domain, codomain, pairs) {
  const hasil = cekFungsi(domain, pairs)
  if (!hasil.isFunction) return false
  if (domain.length !== codomain.length) return false
  const semuaDiKodomain = hasil.range.every((b) => codomain.some((c) => kunci(c) === kunci(b)))
  return semuaDiKodomain && hasil.range.length === codomain.length
}

/** Umpan balik yang menjelaskan mengapa (A9). Kalimat pendek (A1). */
export function pesanIsu(issue) {
  switch (issue.tag) {
    case 'NO_PAIR':
      return `${issue.a} belum punya pasangan.`
    case 'MULTI_PAIR':
      return `${issue.a} punya ${issue.targets.length} pasangan (${issue.targets.join(' dan ')}). Fungsi hanya boleh satu.`
    case 'OUT_OF_DOMAIN':
      return `${issue.a} bukan anggota A.`
    case 'EMPTY_DOMAIN':
      return 'Himpunan A masih kosong.'
    default:
      return 'Periksa lagi pasangannya.'
  }
}
