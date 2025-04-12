"use client"

import { Vector3, Euler } from 'three'

interface SolarPanelProps {
  position: [number, number, number]
  scale: number
  rotation: [number, number, number]
}

const SolarPanel = ({ position, scale, rotation }: SolarPanelProps) => {
  return (
    <group
      position={new Vector3(...position)}
      scale={new Vector3(scale, scale, scale)}
      rotation={new Euler(...rotation)}
    >
      {/* Panel */}
      <mesh>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>

      {/* Stand */}
      <mesh position={new Vector3(0, -0.7, 0)}>
        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Base */}
      <mesh position={new Vector3(0, -1, 0)}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  )
}

export default SolarPanel 