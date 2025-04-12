"use client"

import { useRef, useEffect, Suspense, useState } from "react"
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"

const Earth = dynamic(() => import('./3d/Earth'), { ssr: false })
const WindTurbine = dynamic(() => import('./3d/WindTurbine'), { ssr: false })
const SolarPanel = dynamic(() => import('./3d/SolarPanel'), { ssr: false })
const Ground = dynamic(() => import('./3d/Ground'), { ssr: false })

const Scene = dynamic(() => Promise.resolve(() => (
  <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: "transparent" }}>
    <OrbitControls enableZoom={false} />
    <Environment preset="sunset" />
    <Earth position={[-5, 2, 0]} scale={2} />
    <WindTurbine position={[-8, -1, -2]} scale={0.7} rotationSpeed={1.2} />
    <SolarPanel position={[-7, -1, 1]} scale={0.8} rotation={[-0.1, 0.5, 0]} />
    <Ground />
  </Canvas>
)), { ssr: false })

export function LoginAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-gradient-to-b from-green-50 to-white" />
  }

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={
        <div className="w-full h-full bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      }>
        <Scene />
      </Suspense>
    </motion.div>
  )
}

export default LoginAnimation
