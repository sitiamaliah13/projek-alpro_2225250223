/**
 * Antrian sinkron progres ke server (architecture.md §7).
 * Progres selalu disimpan di HP dulu. Server dikirimi salinan terbaru beberapa detik kemudian;
 * bila offline, dicoba lagi saat internet kembali. Hanya salinan terakhir yang perlu dikirim.
 */
import { simpanProgresServer } from './api.js'
import { baca, hapus, tulis } from './storage.js'

const KUNCI_TERTUNDA = 'sinkron-tertunda'
const JEDA_MS = 2000

export function buatPenyinkron({ kirim = simpanProgresServer, jeda = JEDA_MS, onStatus = () => {} } = {}) {
  let pengatur = null
  let sedangKirim = false
  let terakhir = baca(KUNCI_TERTUNDA, null) // { token, data } yang belum terkirim

  async function kirimSekarang() {
    clearTimeout(pengatur)
    pengatur = null
    if (!terakhir || sedangKirim) return
    const paket = terakhir
    sedangKirim = true
    onStatus('mengirim')
    try {
      await kirim(paket.token, paket.data)
      if (terakhir === paket) {
        terakhir = null
        hapus(KUNCI_TERTUNDA)
      }
      onStatus(terakhir ? 'tertunda' : 'tersimpan')
    } catch (e) {
      // Token habis: data tetap aman di HP, tidak perlu dicoba terus.
      if (e?.status === 401 || e?.status === 403) {
        terakhir = null
        hapus(KUNCI_TERTUNDA)
        onStatus('perlu-masuk')
      } else {
        onStatus('tertunda')
      }
    } finally {
      sedangKirim = false
    }
    if (terakhir) {
      clearTimeout(pengatur)
      pengatur = setTimeout(kirimSekarang, jeda * 5)
    }
  }

  return {
    jadwalkan(token, data) {
      terakhir = { token, data }
      tulis(KUNCI_TERTUNDA, terakhir)
      onStatus('tertunda')
      clearTimeout(pengatur)
      pengatur = setTimeout(kirimSekarang, jeda)
    },
    kirimSekarang,
    adaTertunda: () => Boolean(terakhir),
    batal() {
      clearTimeout(pengatur)
      pengatur = null
      terakhir = null
      hapus(KUNCI_TERTUNDA)
    },
  }
}
