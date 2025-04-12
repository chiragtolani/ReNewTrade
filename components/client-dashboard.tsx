"use client"

import dynamic from "next/dynamic"

const Dashboard = dynamic(() => import("@/components/dashboard"), {
  ssr: false
})

interface ClientDashboardProps {
  activeTab?: string
}

export default function ClientDashboard({ activeTab }: ClientDashboardProps) {
  return <Dashboard activeTab={activeTab} />
} 