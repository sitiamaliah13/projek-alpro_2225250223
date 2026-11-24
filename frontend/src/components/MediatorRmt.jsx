import { useState } from 'react'
import Teks from './Teks.jsx'
import Tombol from './Tombol.jsx'
import UmpanBalik from './UmpanBalik.jsx'
import { apiAktif, tanyaMediator } from '../data/api.js'
import { konteksKartu } from '../lib/rmt.js'

const BATAS_PER_LAYAR = 50

/**
 * Mediator RMT berbasis AI (DeepSeek lewat server) — RMT-3.
 * Muncul hanya bila diminta (A8, GL03). Memberi pertanyaan pemandu dan meminta bukti logis,
 * tidak memberi kunci jawaban (Mediated Learning Experience). Login tidak wajib; token dipakai bila ada.
 * Nama siswa tidak dikirim (agents.md aturan 6).
 */
export default function MediatorRmt({ kartu, rmt, token, onPakai, selaluBuka = false, batas = BATAS_PER_LAYAR, saran = [] }) {
  const [buka, setBuka] = useState(selaluBuka)
  const [pesan, setPesan] = useState('')
  const [riwayat, setRiwayat] = useState([]) // [{ peran, teks }]
  const [memuat, setMemuat] = useState(false)
  const [galat, setGalat] = useState('')
  const sisa = batas - riwayat.filter((g) => g.peran === 'siswa').length

  if (!buka) {
    return (
      <button
        type="button"
        onClick={() => setBuka(true)}
        className="mt-4 min-h-tap rounded-xl px-2 font-semibold text-domain underline"
      >
        🧭 Tanya Mediator
      </button>
    )
  }

  if (!apiAktif()) {
    return (
      <UmpanBalik jenis="info">
        Mediator butuh internet. Untuk sekarang, pakai tombol petunjuk.
      </UmpanBalik>
    )
  }

  const kirim = async () => {
    const teks = pesan.trim()
    if (!teks || memuat || sisa <= 0) return
    setMemuat(true)
    setGalat('')
    try {
      const balasan = await tanyaMediator(token, {
        fase: rmt?.fase.nama ?? '',
        fungsi_kognitif: rmt?.fungsi.nama ?? '',
        konteks: konteksKartu(kartu),
        pesan: teks,
        riwayat: riwayat.slice(-6),
      })
      setRiwayat((r) => [...r, { peran: 'siswa', teks }, { peran: 'mediator', teks: balasan }])
      setPesan('')
      onPakai?.()
    } catch (e) {
      setGalat(e.message)
    } finally {
      setMemuat(false)
    }
  }

  return (
    <section className="mt-4 rounded-2xl border-2 border-domain bg-white p-3" aria-label="Mediator RMT">
      <p className="font-bold">🧭 Mediator</p>
      <p className="mb-2 text-muted">Mediator tidak memberi jawaban. Ia mengajakmu berpikir dan mencari bukti.</p>
      {riwayat.length === 0 && saran.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {saran.map((s) => (
            <button key={s} type="button" onClick={() => setPesan(s)} className="min-h-tap rounded-xl border-2 border-slate-300 px-3 text-left">
              {s}
            </button>
          ))}
        </div>
      )}

      {riwayat.map((g, i) => (
        <div key={i} className={`mb-2 rounded-xl px-3 py-2 ${g.peran === 'siswa' ? 'bg-slate-100' : 'border-l-4 border-domain'}`}>
          <span className="font-semibold">{g.peran === 'siswa' ? 'Kamu: ' : 'Mediator: '}</span>
          <Teks as="span">{g.teks}</Teks>
        </div>
      ))}

      {sisa > 0 ? (
        <>
          <label htmlFor="pesan-mediator" className="sr-only">
            Tulis pikiranmu
          </label>
          <textarea
            id="pesan-mediator"
            value={pesan}
            maxLength={500}
            rows={2}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Tulis apa yang kamu pikirkan, atau bagian yang membingungkan."
            className="w-full rounded-xl border-2 border-slate-300 p-2 text-lg"
          />
          <Tombol jenis="kedua" onClick={kirim} disabled={memuat || !pesan.trim()}>
            {memuat ? 'Mediator sedang berpikir…' : `Kirim (${sisa} tersisa)`}
          </Tombol>
        </>
      ) : (
        <p className="text-muted">Batas {batas} pertanyaan sudah tercapai. Sekarang coba sendiri, ya.</p>
      )}
      {galat && <UmpanBalik jenis="info">{galat}</UmpanBalik>}
    </section>
  )
}
