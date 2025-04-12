"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh, Vector3 } from 'three'

interface EarthProps {
  position: [number, number, number]
  scale: number
}

const Earth = ({ position, scale }: EarthProps) => {
  const earthRef = useRef<Mesh>(null)

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh
      ref={earthRef}
      position={new Vector3(...position)}
      scale={new Vector3(scale, scale, scale)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4299e1" />
      {/* Continents */}
      <mesh>
        <sphereGeometry args={[1.01, 32, 32]} />
        <meshStandardMaterial
          color="#48bb78"
          transparent
          opacity={0.8}
          wireframe
        />
      </mesh>
    </mesh>
  )
}

export default Earth 