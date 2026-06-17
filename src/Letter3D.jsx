import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Float, RoundedBox } from '@react-three/drei'
import { useRef } from 'react'

/* One stroke of the "A", with the shared orange material. */
function Bar(props) {
  return (
    <RoundedBox radius={0.1} smoothness={4} {...props}>
      <meshStandardMaterial
        color="#c06a2f"
        roughness={0.28}
        metalness={0.5}
        emissive="#5e2d10"
        emissiveIntensity={0.25}
      />
    </RoundedBox>
  )
}

/* The 3D letter A — drag to rotate (via PresentationControls), click to spin. */
function LetterA() {
  const ref = useRef()
  const target = useRef(0)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += (target.current - ref.current.rotation.y) * Math.min(1, dt * 3.5)
  })
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        target.current += Math.PI * 2
      }}
      onPointerOver={() => (document.body.style.cursor = 'grab')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <Bar args={[0.52, 3.4, 0.62]} position={[-0.62, 0, 0]} rotation={[0, 0, -0.33]} />
      <Bar args={[0.52, 3.4, 0.62]} position={[0.62, 0, 0]} rotation={[0, 0, 0.33]} />
      <Bar args={[1.18, 0.5, 0.62]} position={[0, -0.5, 0]} />
    </group>
  )
}

export default function Letter3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.9} color="#ffe6c4" />
      <directionalLight position={[-5, -2, 2]} intensity={0.5} color="#ffd9a8" />
      <pointLight position={[0, 1, 4]} intensity={0.7} />
      <PresentationControls
        global
        snap
        polar={[-0.5, 0.5]}
        azimuth={[-1, 1]}
        config={{ mass: 1, tension: 220, friction: 26 }}
      >
        <Float rotationIntensity={0.5} floatIntensity={0.7} speed={1.3}>
          <LetterA />
        </Float>
      </PresentationControls>
    </Canvas>
  )
}
