"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import { motion } from "framer-motion"
import type { RootState } from '@react-three/fiber'
import { Group, Mesh, Vector3 as ThreeVector3, Euler as ThreeEuler } from 'three'
import dynamic from 'next/dynamic'

// Dynamically import Three.js components
const ThreeCanvas = dynamic(() => import("@react-three/fiber").then(mod => mod.Canvas), {
  ssr: false
})

const OrbitControls = dynamic(() => import("@react-three/drei").then(mod => mod.OrbitControls), {
  ssr: false
})

const Environment = dynamic(() => import("@react-three/drei").then(mod => mod.Environment), {
  ssr: false
})

interface WindTurbineProps {
  position: [number, number, number]
  scale: number
  rotationSpeed: number
}

interface SolarPanelProps {
  position: [number, number, number]
  scale: number
  rotation: [number, number, number]
}

interface EarthProps {
  position: [number, number, number]
  scale: number
}

const WindTurbine: React.FC<WindTurbineProps> = ({ position, scale, rotationSpeed }) => {
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
      position={new ThreeVector3(...position)}
      scale={new ThreeVector3(scale, scale, scale)}
    >
      {/* Base */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.2, 2]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Turbine head */}
      <mesh position={new ThreeVector3(0, 1.2, 0)}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Blades */}
      <group ref={bladeRef} position={new ThreeVector3(0, 1.2, 0)}>
        <mesh rotation={new ThreeEuler(0, 0, 0)}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={new ThreeEuler(0, 0, Math.PI * (2/3))}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={new ThreeEuler(0, 0, Math.PI * (4/3))}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  )
}

const SolarPanel: React.FC<SolarPanelProps> = ({ position, scale, rotation }) => {
  return (
    <group
      position={new ThreeVector3(...position)}
      scale={new ThreeVector3(scale, scale, scale)}
      rotation={new ThreeEuler(...rotation)}
    >
      {/* Panel */}
      <mesh>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#1a365d" />
      </mesh>

      {/* Stand */}
      <mesh position={new ThreeVector3(0, -0.7, 0)}>
        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Base */}
      <mesh position={new ThreeVector3(0, -1, 0)}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  )
}

const Earth: React.FC<EarthProps> = ({ position, scale }) => {
  const earthRef = useRef<Mesh>(null)

  useFrame((_state: RootState) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh
      ref={earthRef}
      position={new ThreeVector3(...position)}
      scale={new ThreeVector3(scale, scale, scale)}
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

export function LoginAnimation() {
  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ThreeCanvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
        >
          <OrbitControls enableZoom={false} />
          <Earth position={[-5, 2, 0]} scale={2} />
          <WindTurbine position={[-8, -1, -2]} scale={0.7} rotationSpeed={1.2} />
          <SolarPanel position={[-7, -1, 1]} scale={0.8} rotation={[-0.1, 0.5, 0]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          <Environment preset="sunset" />
        </ThreeCanvas>
      </Suspense>
    </motion.div>
  )
}

export default LoginAnimation
