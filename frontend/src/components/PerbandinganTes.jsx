import { useEffect, useState } from 'react'
import { ambilStatus, apiAktif } from '../data/api.js'
import { nGain, SKOR_MAKS_TES } from '../lib/perkembangan.js'

const PROSES = { reasoning: 'Penalaran', formulate: 'Merumuskan', employ: 'Menerapkan', interpret: 'Menafsirkan' }

/**
 * Perbandingan nilai pretest–posttest (item F). Nilai diisi peneliti dengan rubrik di database,
 * jadi kunci jawaban tes formal tidak pernah ada di aplikasi (agents.md aturan 6).
 */
export default function PerbandinganTes({ token }) {
  const [skor, setSkor] = useState(null)
  const [galat, setGalat] = useState('')

  useEffect(() => {
    if (!apiAktif() || !token) return undefined
    let batal = false // token lama diganti saat sesi pulih: abaikan jawaban token lama
    setGalat('')
    ambilStatus(token)
      .then((s) => !batal && setSkor(s.scores ?? {}))
      .catch((e) => !batal && setGalat(e.message))
    return () => {
      batal = true
    }
  }, [token])

  const pre = skor?.pre?.score ?? null
  const post = skor?.post?.score ?? null
  const gain = nGain(pre, post)

  return (
    <section className="surface-float mt-6 rounded-3xl p-5" aria-labelledby="judul-nilai">
      <h2 id="judul-nilai" className="text-xl font-bold">
        Nilai Pretest dan Posttest
      </h2>
      {!token ? (
        <p className="mt-1 text-muted">Nilai tampil bila kamu masuk dengan kode siswa dari guru.</p>
      ) : galat ? (
        <p className="mt-1 text-muted">{galat}</p>
      ) : skor === null ? (
        <p className="mt-1 text-muted">Memuat nilai…</p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              ['Pretest', pre, skor?.pre],
              ['Posttest', post, skor?.post],
            ].map(([judul, nilai, rinci]) => (
              <div key={judul} className="rounded-2xl border-2 border-slate-200 bg-white p-3">
                <p className="font-semibold">{judul}</p>
                <p className="text-2xl font-bold">{nilai === null ? '–' : `${nilai} / ${SKOR_MAKS_TES}`}</p>
                {nilai === null && <p className="text-base text-muted">Belum dinilai guru.</p>}
                {rinci?.per_process && (
                  <ul className="mt-1 text-base text-muted">
                    {Object.entries(rinci.per_process).map(([k, v]) => (
                      <li key={k}>
                        {PROSES[k] ?? k}: {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {gain ? (
            <p className="mt-3 font-semibold" role="status">
              Peningkatan: {post - pre >= 0 ? '+' : ''}
              {post - pre} poin · N-Gain {gain.nilai} ({gain.kategori})
            </p>
          ) : (
            <p className="mt-3 text-muted">Perbandingan muncul setelah kedua tes dinilai.</p>
          )}
          <p className="mt-2 text-base text-muted">
            Pembahasan soal tes dibagikan guru di kelas setelah posttest, agar tes tetap adil.
          </p>
        </>
      )}
    </section>
  )
}
