import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

function Machine() {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useFrame((state, delta) => {
    if (!group.current || reduced) return
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.35 + pointer.x * 0.22, 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.12 - pointer.y * 0.1, 3, delta)
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06
  })

  return (
    <group ref={group} rotation={[0.1, -0.35, -0.24]} scale={1.1}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.7, 48]} />
        <meshStandardMaterial color="#090909" roughness={0.18} metalness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 0.1, 0.38]}>
        <cylinderGeometry args={[0.43, 0.55, 0.12, 48]} />
        <meshStandardMaterial color="#ff0a78" roughness={0.22} metalness={0.65} emissive="#690020" emissiveIntensity={0.22} />
      </mesh>
      <mesh castShadow position={[0, 0.58, 0]}>
        <boxGeometry args={[0.72, 0.26, 0.68]} />
        <meshStandardMaterial color="#151515" roughness={0.24} metalness={0.78} />
      </mesh>
      <mesh castShadow position={[0, -0.53, 0]}>
        <cylinderGeometry args={[0.34, 0.29, 0.58, 40]} />
        <meshStandardMaterial color="#232323" roughness={0.32} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0, -1.08, 0]}>
        <cylinderGeometry args={[0.2, 0.14, 0.58, 32]} />
        <meshStandardMaterial color="#b7b7b7" roughness={0.12} metalness={1} />
      </mesh>
      <mesh castShadow position={[0, -1.55, 0]}>
        <cylinderGeometry args={[0.055, 0.025, 0.45, 20]} />
        <meshStandardMaterial color="#dedede" roughness={0.08} metalness={1} />
      </mesh>
      <mesh castShadow position={[0.54, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.42, 28]} />
        <meshStandardMaterial color="#bcbcbc" roughness={0.12} metalness={1} />
      </mesh>
      <mesh castShadow position={[0.81, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.23, 0.23, 0.16, 28]} />
        <meshStandardMaterial color="#ff0a78" roughness={0.2} metalness={0.7} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.36 + i * 0.36, 0.1, 0.61]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.014, 12, 24]} />
          <meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

export default function TattooMachine() {
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  return (
    <div className="machine-stage" aria-hidden="true">
      <div className="machine-fallback">TS</div>
      <Canvas
        dpr={coarse ? 1 : [1, 1.5]}
        camera={{ position: [0, 0.25, 5.2], fov: 36 }}
        gl={{ antialias: !coarse, alpha: true, powerPreference: 'high-performance' }}
        shadows={!coarse}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <spotLight position={[4, 5, 4]} intensity={3.2} angle={0.42} penumbra={0.65} color="#fff" castShadow={!coarse} />
          <pointLight position={[-3, 0, 2]} intensity={4} color="#ff0a78" />
          <pointLight position={[2, -2, 1]} intensity={1.5} color="#ffffff" />
          <Float speed={coarse ? 0.6 : 1.1} rotationIntensity={coarse ? 0.04 : 0.12} floatIntensity={0.18}>
            <Machine />
          </Float>
          <ContactShadows position={[0, -2.1, 0]} opacity={0.5} scale={5} blur={2.8} far={3.5} color="#000" />
        </Suspense>
      </Canvas>
    </div>
  )
}
