import { useRegisterSW } from 'virtual:pwa-register/react'

const MODE_ARTIFACT = typeof __ARTIFACT__ !== 'undefined' && __ARTIFACT__

function StatusPWA() {
  const {
    offlineReady: [siap],
  } = useRegisterSW()
  const sudahTerpasang = typeof navigator !== 'undefined' && navigator.serviceWorker?.controller
  if (!siap && !sudahTerpasang) {
    return <p className="text-base text-muted">⏳ Menyiapkan mode offline…</p>
  }
  return <p className="text-base font-semibold text-ok-ink">✓ Siap dipakai offline</p>
}

/** Menampilkan "✓ Siap dipakai offline" setelah semua aset tersimpan di HP (architecture.md §7). */
export default function StatusOffline() {
  // Versi Artifact tidak memakai service worker, jadi mode offline tidak tersedia di sana.
  if (MODE_ARTIFACT) return <p className="text-base text-muted">Versi web daring (mode offline tersedia di versi PWA).</p>
  return <StatusPWA />
}
