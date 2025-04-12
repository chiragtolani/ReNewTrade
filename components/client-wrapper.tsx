"use client"

import { useState, useEffect } from "react"

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-full h-screen bg-gradient-to-b from-green-50 to-white" />
  }

  return <>{children}</>
} 