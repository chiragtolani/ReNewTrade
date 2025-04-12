"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import type { RootState } from '@react-three/fiber'
import { Group, Mesh, Vector3 as ThreeVector3, Euler as ThreeEuler } from 'three'

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

const SceneContent: React.FC = () => {
  const { camera } = useThree()

  useEffect(() => {
    // Position camera to focus more on the left side
    camera.position.set(-3, 2, 10)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={new ThreeVector3(10, 10, 5)} intensity={1} />

      <Earth position={[-5, 2, 0]} scale={2} />

      <WindTurbine position={[-8, -1, -2]} scale={0.7} rotationSpeed={1.2} />
      <WindTurbine position={[-6, -1, -3]} scale={0.6} rotationSpeed={0.8} />
      <WindTurbine position={[-3, -1, -2]} scale={0.8} rotationSpeed={1} />

      <SolarPanel position={[-7, -1, 1]} scale={0.8} rotation={[-0.1, 0.5, 0]} />
      <SolarPanel position={[-4, -1, 2]} scale={0.7} rotation={[-0.1, -0.3, 0]} />
      <SolarPanel position={[-2, -1, 3]} scale={0.9} rotation={[-0.1, 0.1, 0]} />

      <mesh 
        position={new ThreeVector3(0, -1.5, 0)} 
        rotation={new ThreeEuler(-Math.PI / 2, 0, 0)}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#88c172" />
      </mesh>
    </>
  )
}

export const Scene: React.FC = () => {
  return (
    <Canvas shadows>
      <SceneContent />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
      <Environment preset="sunset" />
    </Canvas>
  )
} 