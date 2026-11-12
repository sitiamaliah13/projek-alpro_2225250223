import { useCallback, useEffect, useState } from 'react'
import { baca, tulis } from './storage.js'

/**
 * Pengaturan 3D (architecture.md §9, HP siswa campuran).
 * - 'auto' (bawaan): RAM ≤ 2 GB → 3D mati (gambar statis); RAM 3 GB → mode ringan; selain itu standar.
 * - Siswa selalu bisa menyalakan/mematikan lewat sakelar "Matikan 3D". Pilihan disimpan di HP.
 */
const KUNCI = 'pengaturan3d'
const EVENT = 'fungsiku:3d'

function ramPerangkat() {
  return typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null
}

export function kualitas3D() {
  const ram = ramPerangkat()
  if (ram !== null && ram <= 3) return 'ringan'
  return 'standar'
}

function bacaAktif() {
  const pilihan = baca(KUNCI, 'auto')
  if (pilihan === 'on') return true
  if (pilihan === 'off') return false
  const ram = ramPerangkat()
  return !(ram !== null && ram <= 2)
}

export function usePengaturan3D() {
  const [aktif, setAktifState] = useState(bacaAktif)

  useEffect(() => {
    const sinkron = () => setAktifState(bacaAktif())
    window.addEventListener(EVENT, sinkron)
    return () => window.removeEventListener(EVENT, sinkron)
  }, [])

  const setAktif = useCallback((nyala) => {
    tulis(KUNCI, nyala ? 'on' : 'off')
    setAktifState(nyala)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { aktif, setAktif, kualitas: kualitas3D() }
}
