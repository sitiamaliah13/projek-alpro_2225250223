import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layar from './Layar.jsx'
import Tombol from './Tombol.jsx'
import UmpanBalik from './UmpanBalik.jsx'
import { tes } from '../data/konten.js'
import { useProgres } from '../data/ProgresContext.jsx'

/**
 * Lembar tes uraian (pretest/posttest, F2). Satu soal per layar (A1, A2).
 * Pembuka bernada suportif (GL03) membantu siswa memulai dengan tenang.
 * Kunci & rubrik TIDAK ada di aplikasi; jawaban dinilai peneliti (docs/kisi-kisi-soal-literasi.md).
 * Jawaban disimpan otomatis setiap kali diketik.
 */
export default function LembarTes({ jenis, ruteSelesai }) {
  const kunciProgres = jenis === 'pre' ? 'pretest' : 'posttest'
  const data = tes[jenis]
  const { progres, ubah } = useProgres()
  const navigate = useNavigate()
  const status = progres[kunciProgres]
  const [ke, setKe] = useState(0) // 0 = petunjuk, 1..n = soal, n+1 = konfirmasi
  const n = data.soal.length

  if (status.done) {
    return (
      <Layar judul={data.judul} bawah={<Tombol onClick={() => navigate(ruteSelesai)}>Lanjut</Tombol>}>
        <UmpanBalik jenis="benar">Jawaban {data.judul.toLowerCase()} sudah dikirim. Terima kasih!</UmpanBalik>
      </Layar>
    )
  }

  const simpan = (no, teks) =>
    ubah((p) => {
      p[kunciProgres].answers[no] = teks
    })

  const kirim = () => {
    ubah((p) => {
      p[kunciProgres].done = true
      p[kunciProgres].submittedAt = new Date().toISOString()
    })
    navigate(ruteSelesai, { replace: true })
  }

  if (ke === 0) {
    return (
      <Layar judul="Yuk, Kita Mulai!" bawah={<Tombol onClick={() => setKe(1)}>Mulai</Tombol>}>
        <p className="mb-4 rounded-2xl bg-brand-pale p-4 font-semibold text-brand">
          Tenang, kerjakan satu soal demi satu soal. Tuliskan langkah yang kamu pikirkan; kamu pasti bisa!
        </p>
        <p className="font-semibold">
          Ada {n} soal. Waktu sekitar {data.durasi_menit} menit.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          {data.petunjuk.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Layar>
    )
  }

  if (ke > n) {
    const terisi = data.soal.filter((s) => (status.answers[s.no] ?? '').trim() !== '').length
    return (
      <Layar
        judul={data.judul}
        bawah={
          <div className="flex gap-2">
            <Tombol jenis="kedua" onClick={() => setKe(n)}>
              Periksa lagi
            </Tombol>
            <Tombol onClick={kirim}>Kirim</Tombol>
          </div>
        }
      >
        <p>
          Kamu sudah mengisi <strong>{terisi}</strong> dari {n} soal.
        </p>
        {terisi < n && <UmpanBalik jenis="info">Masih ada soal yang kosong. Kamu boleh kembali dan mengisinya.</UmpanBalik>}
        <p className="mt-4">Setelah dikirim, jawaban tidak bisa diubah.</p>
      </Layar>
    )
  }

  const soal = data.soal[ke - 1]
  return (
    <Layar
      judul={`${data.judul} · Soal ${ke}/${n}`}
      bawah={
        <div className="flex gap-2">
          <Tombol jenis="kedua" onClick={() => setKe(ke - 1)}>
            Sebelumnya
          </Tombol>
          <Tombol onClick={() => setKe(ke + 1)}>{ke === n ? 'Selesai' : 'Lanjut'}</Tombol>
        </div>
      }
    >
      <h2 className="text-xl font-bold">{soal.judul}</h2>
      {soal.teks.map((t, i) => (
        <p key={i} className="mt-2">
          {t}
        </p>
      ))}
      {soal.tabel && (
        <table className="mt-3 w-full border-collapse bg-white">
          <thead>
            <tr>
              {soal.tabel.kolom.map((k) => (
                <th key={k} className="border border-slate-300 px-3 py-2 text-left">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {soal.tabel.baris.map((b) => (
              <tr key={b[0]}>
                {b.map((sel, i) => (
                  <td key={i} className="border border-slate-300 px-3 py-2">
                    {sel}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(soal.teks_akhir ?? []).map((t, i) => (
        <p key={i} className="mt-3">
          {t}
        </p>
      ))}
      <p className="mt-3 font-bold">{soal.tanya}</p>

      <label className="mt-4 block">
        <span className="font-semibold">Jawabanmu (tulis langkah demi langkah)</span>
        <textarea
          value={status.answers[soal.no] ?? ''}
          onChange={(e) => simpan(soal.no, e.target.value)}
          rows={8}
          placeholder={'Langkah 1: ...\nLangkah 2: ...'}
          className="mt-2 w-full rounded-xl border-2 border-slate-300 p-3 text-lg"
        />
      </label>
    </Layar>
  )
}
