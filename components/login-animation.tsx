"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import { motion } from "framer-motion"

function WindTurbine({ position = [0, 0, 0], scale = 1, rotationSpeed = 1 }) {
  const turbineRef = useRef()
  const bladeRef = useRef()

  useFrame((state) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z += 0.01 * rotationSpeed
    }
  })

  return (
    <group ref={turbineRef} position={position} scale={scale}>
      {/* Tower */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 4, 16]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Nacelle */}
      <mesh position={[0, 4.1, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      {/* Blades */}
      <group ref={bladeRef} position={[0, 4.1, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh rotation={[0, 0, (Math.PI * 2) / 3]}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh rotation={[0, 0, (Math.PI * 4) / 3]}>
          <boxGeometry args={[0.1, 1.5, 0.05]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </group>
  )
}

function SolarPanel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1, 0.1, 1.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Panel */}
      <mesh position={[0, 0.11, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 1.4]} />
        <meshStandardMaterial color="#1a4c7c" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Earth({ position = [0, 0, 0], scale = 1 }) {
  const earthRef = useRef()

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={earthRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1d7caa" metalness={0.1} roughness={0.7} />

        {/* Continents - simplified representation */}
        <group>
          <mesh position={[0.7, 0.5, 0.5]} scale={[0.3, 0.2, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#2d9d3a" />
          </mesh>
          <mesh position={[-0.5, 0.3, 0.7]} scale={[0.4, 0.2, 0.2]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#2d9d3a" />
          </mesh>
          <mesh position={[0.2, -0.6, 0.6]} scale={[0.3, 0.3, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#2d9d3a" />
          </mesh>
        </group>
      </mesh>
    </Float>
  )
}

function Scene() {
  const { camera } = useThree()

  useEffect(() => {
    // Position camera to focus more on the left side
    camera.position.set(-3, 2, 10)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Position Earth more to the left */}
      <Earth position={[-5, 2, 0]} scale={2} />

      {/* Position wind turbines more to the left and center */}
      <WindTurbine position={[-8, -1, -2]} scale={0.7} rotationSpeed={1.2} />
      <WindTurbine position={[-6, -1, -3]} scale={0.6} rotationSpeed={0.8} />
      <WindTurbine position={[-3, -1, -2]} scale={0.8} rotationSpeed={1} />

      {/* Position solar panels more to the left and center */}
      <SolarPanel position={[-7, -1, 1]} scale={0.8} rotation={[-0.1, 0.5, 0]} />
      <SolarPanel position={[-4, -1, 2]} scale={0.7} rotation={[-0.1, -0.3, 0]} />
      <SolarPanel position={[-2, -1, 3]} scale={0.9} rotation={[-0.1, 0.1, 0]} />

      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#88c172" />
      </mesh>
    </>
  )
}

export default function LoginAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 -z-10"
    >
      <Canvas shadows>
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          // Limit rotation to keep focus on the left side
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        <Environment preset="sunset" />
      </Canvas>
    </motion.div>
  )
}
