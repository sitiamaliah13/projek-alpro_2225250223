import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { formatBilangan } from '../lib/aljabar.js'

/**
 * F17 Mesin Fungsi 3D (pelengkap, agents.md aturan 5; design.md §4.6).
 * - frameloop="demand": kanvas hanya digambar ulang saat siswa mengetuk (EL03, hemat baterai).
 * - dpr maks 1,5; tanpa bayangan; kamera tetap; tanpa rotasi otomatis; geometri prosedural.
 * - Bola PINDAH posisi per tahap (tanpa animasi): tahap 0 di kiri, 1 di dalam mesin, 2 keluar di kanan.
 * - Label HTML diletakkan dekat objek (A10). File ini di-lazy-load.
 */
const BIRU = '#2563EB'
const TEAL = '#0D9488'
const UNGU = '#9333EA'
const ABU = '#475569'

function Label({ children, posisi }) {
  return (
    <Html position={posisi} center style={{ pointerEvents: 'none' }}>
      <div className="whitespace-nowrap rounded-lg bg-white px-2 py-1 text-lg font-bold shadow">{children}</div>
    </Html>
  )
}

function Bola({ posisi, warna, label }) {
  return (
    <group position={posisi}>
      <mesh>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color={warna} roughness={0.5} />
      </mesh>
      <Label posisi={[0, 0.85, 0]}>{label}</Label>
    </group>
  )
}

function Mesin({ aturan }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.2, 1.6, 1.4]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.8} />
      </mesh>
      {/* corong masuk dan keluar */}
      <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.5, 0.3, 20]} />
        <meshStandardMaterial color={ABU} />
      </mesh>
      <mesh position={[1.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.5, 0.3, 20]} />
        <meshStandardMaterial color={ABU} />
      </mesh>
      <Label posisi={[0, 1.2, 0]}>{aturan}</Label>
    </group>
  )
}

export default function MesinFungsi3D({ aturan, x, fx, tahap, kualitas = 'standar' }) {
  const warnaX = x < 0 ? UNGU : BIRU
  const warnaF = fx < 0 ? UNGU : TEAL
  return (
    <div className="h-64 w-full overflow-hidden rounded-2xl bg-white" role="img" aria-label={`Mesin fungsi 3D dengan aturan ${aturan}`}>
      <Canvas
        frameloop="demand"
        dpr={kualitas === 'standar' ? [1, 1.5] : 1}
        gl={{ antialias: kualitas === 'standar', powerPreference: 'low-power' }}
        camera={{ position: [0, 1.4, 11], fov: 40 }}
      >
        <color attach="background" args={['#FFFFFF']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <Mesin aturan={aturan} />
        {tahap === 0 && <Bola posisi={[-2.9, 0, 0]} warna={warnaX} label={`x = ${formatBilangan(x)}`} />}
        {tahap === 1 && <Label posisi={[0, -1.25, 0]}>{`x = ${formatBilangan(x)} sedang diproses`}</Label>}
        {tahap === 2 && <Bola posisi={[2.9, 0, 0]} warna={warnaF} label={`f(x) = ${formatBilangan(fx)}`} />}
      </Canvas>
    </div>
  )
}
