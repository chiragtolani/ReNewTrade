import type React from "react"
import ClientLayout from "./clientLayout"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'

export const metadata = {
  title: 'ReNewTrade - Peer to Peer Energy Trading Platform',
  description: 'A modern peer-to-peer energy trading platform built with Next.js, React, and Three.js.',
  generator: 'v0.dev'
};
