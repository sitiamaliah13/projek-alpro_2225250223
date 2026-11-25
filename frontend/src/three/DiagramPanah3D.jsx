import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Diagram panah 3D (Three.js) untuk relasi, fungsi, domain, kodomain, dan range (IL01, IL02, GL01).
 * Aturan pelengkap 3D (agents.md aturan 5, design.md §4.6):
 * - frameloop="demand": hanya digambar ulang saat siswa memutar atau mengetuk; tidak ada gerak otomatis (EL03).
 * - Animasi bola berjalan hanya diputar saat siswa menekan "Telusuri" (siswa mengatur tempo, A5).
 * - dpr maks 1,5; tanpa bayangan; geometri sederhana. File ini di-lazy-load.
 */
const WARNA = { domain: '#2563EB', kodomain: '#0D9488', masalah: '#CA8A04', panah: '#475569', aktif: '#DB2777' }
const kunci = (v) => String(v)

function Label({ posisi, children, tebal = false }) {
  return (
    <Html position={posisi} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`whitespace-nowrap rounded-md bg-white/90 px-1.5 text-lg ${tebal ? 'font-bold' : 'font-semibold'}`}>
        {children}
      </div>
    </Html>
  )
}

/** Posisi anggota: tersusun vertikal di dalam "gelembung" himpunan. */
function posisiAnggota(n, x) {
  const jarak = 1.15
  return Array.from({ length: n }, (_, i) => new THREE.Vector3(x, ((n - 1) / 2 - i) * jarak, 0))
}

function Himpunan({ x, tinggi, warna, judul }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh scale={[1, tinggi / 2 + 0.6, 0.55]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={warna} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <Label posisi={[0, tinggi / 2 + 1.15, 0]} tebal>
        {judul}
      </Label>
    </group>
  )
}

function Anggota({ posisi, warna, label, tebal }) {
  return (
    <group position={posisi}>
      <mesh>
        <sphereGeometry args={[tebal ? 0.3 : 0.24, 20, 14]} />
        <meshStandardMaterial color={warna} roughness={0.45} />
      </mesh>
      <Label posisi={[0, 0.48, 0]}>{label}</Label>
    </group>
  )
}

/** Panah 3D: tabung + kerucut dari titik awal ke titik akhir. */
function Panah({ dari, ke, warna }) {
  const { tengah, panjang, rotasi, ujung } = useMemo(() => {
    const arah = new THREE.Vector3().subVectors(ke, dari)
    const total = arah.length()
    const satuan = arah.clone().normalize()
    const awal = dari.clone().add(satuan.clone().multiplyScalar(0.3))
    const akhir = ke.clone().sub(satuan.clone().multiplyScalar(0.55))
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), satuan)
    return {
      tengah: new THREE.Vector3().addVectors(awal, akhir).multiplyScalar(0.5),
      panjang: Math.max(total - 0.85, 0.1),
      rotasi: new THREE.Euler().setFromQuaternion(q),
      ujung: akhir.clone().add(satuan.clone().multiplyScalar(0.14)),
    }
  }, [dari, ke])
  return (
    <group>
      <mesh position={tengah} rotation={rotasi}>
        <cylinderGeometry args={[0.04, 0.04, panjang, 10]} />
        <meshStandardMaterial color={warna} />
      </mesh>
      <mesh position={ujung} rotation={rotasi}>
        <coneGeometry args={[0.13, 0.3, 14]} />
        <meshStandardMaterial color={warna} />
      </mesh>
    </group>
  )
}

/** Bola kecil yang berjalan sekali sepanjang panah terpilih (dipicu siswa; `key` baru = mulai ulang). */
function BolaJalan({ dari, ke }) {
  const ref = useRef()
  const waktu = useRef(0)
  useFrame((state, delta) => {
    if (!ref.current) return
    if (waktu.current < 1) {
      waktu.current = Math.min(1, waktu.current + delta / 0.9)
      state.invalidate()
    }
    ref.current.position.lerpVectors(dari, ke, waktu.current)
  })
  return (
    <mesh ref={ref} position={dari}>
      <sphereGeometry args={[0.16, 16, 12]} />
      <meshStandardMaterial color={WARNA.aktif} emissive={WARNA.aktif} emissiveIntensity={0.4} />
    </mesh>
  )
}

/**
 * @param {{A: any[], B: any[], pairs: any[][], sorotRange?: boolean, masalah?: any[], telusur?: number|null, kualitas?: string}} p
 */
export default function DiagramPanah3D({ A, B, pairs, sorotRange = false, masalah = [], telusur = null, ulang = 0, kualitas = 'standar' }) {
  const posA = useMemo(() => posisiAnggota(A.length, -2.4), [A])
  const posB = useMemo(() => posisiAnggota(B.length, 2.4), [B])
  const range = new Set(pairs.map(([, b]) => kunci(b)))
  const tinggi = Math.max(A.length, B.length) * 1.15
  const iA = (a) => A.findIndex((x) => kunci(x) === kunci(a))
  const iB = (b) => B.findIndex((x) => kunci(x) === kunci(b))
  const aktif = telusur !== null && pairs[telusur] ? pairs[telusur] : null

  return (
    <div className="relative isolate h-72 w-full touch-none overflow-hidden rounded-2xl bg-white" role="img" aria-label="Diagram panah 3D. Geser untuk memutar.">
      <Canvas
        frameloop="demand"
        dpr={kualitas === 'standar' ? [1, 1.5] : 1}
        gl={{ antialias: kualitas === 'standar', powerPreference: 'low-power' }}
        camera={{ position: [0, 0.6, 9], fov: 45 }}
      >
        <color attach="background" args={['#FFFFFF']} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 5, 6]} intensity={1.1} />
        <Himpunan x={-2.4} tinggi={tinggi} warna={WARNA.domain} judul="A (domain)" />
        <Himpunan x={2.4} tinggi={tinggi} warna={WARNA.kodomain} judul="B (kodomain)" />
        {A.map((a, i) => {
          const bermasalah = masalah.some((m) => kunci(m) === kunci(a))
          return <Anggota key={`a${i}`} posisi={posA[i]} warna={bermasalah ? WARNA.masalah : WARNA.domain} label={String(a)} tebal={bermasalah} />
        })}
        {B.map((b, i) => {
          const diRange = sorotRange && range.has(kunci(b))
          return (
            <Anggota
              key={`b${i}`}
              posisi={posB[i]}
              warna={WARNA.kodomain}
              label={diRange ? `${b} ★` : String(b)}
              tebal={diRange}
            />
          )
        })}
        {pairs.map(([a, b], i) => {
          const pa = posA[iA(a)]
          const pb = posB[iB(b)]
          if (!pa || !pb) return null
          return <Panah key={`p${i}`} dari={pa} ke={pb} warna={i === telusur ? WARNA.aktif : WARNA.panah} />
        })}
        {aktif && posA[iA(aktif[0])] && posB[iB(aktif[1])] && (
          <BolaJalan key={`bola-${telusur}-${ulang}`} dari={posA[iA(aktif[0])]} ke={posB[iB(aktif[1])]} />
        )}
        <OrbitControls enablePan={false} minDistance={6} maxDistance={14} makeDefault />
      </Canvas>
    </div>
  )
}
