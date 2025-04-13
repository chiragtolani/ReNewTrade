"use client"

import { Vector3, Euler } from 'three'

const Ground = () => {
  return (
    <mesh rotation={new Euler(-Math.PI / 2, 0, 0)} position={new Vector3(0, -1, 0)}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

export default Ground 