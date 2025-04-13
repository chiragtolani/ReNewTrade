"use client"

import { useState, useEffect } from "react"
import { BlockchainProvider } from "@/contexts/blockchain-context"

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

  return (
    <BlockchainProvider>
      {children}
    </BlockchainProvider>
  )
} 