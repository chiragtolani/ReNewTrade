"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, Mesh, Vector3, Euler } from 'three'

interface WindTurbineProps {
  position: [number, number, number]
  scale: number
  rotationSpeed: number
}

const WindTurbine = ({ position, scale, rotationSpeed }: WindTurbineProps) => {
  const turbineRef = useRef<Group>(null)
  const bladeRef = useRef<Mesh>(null)

  useFrame(() => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += rotationSpeed * 0.02
    }
  })

  return (
    <group
      ref={turbineRef}
      position={new Vector3(...position)}
      scale={new Vector3(scale, scale, scale)}
    >
      {/* Base */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.2, 2]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Turbine head */}
      <mesh position={new Vector3(0, 1.2, 0)}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Blades */}
      <group ref={bladeRef} position={new Vector3(0, 1.2, 0)}>
        <mesh rotation={new Euler(0, 0, 0)}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={new Euler(0, 0, Math.PI * (2/3))}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={new Euler(0, 0, Math.PI * (4/3))}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  )
}

export default WindTurbine 