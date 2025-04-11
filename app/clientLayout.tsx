"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")

    // If not on login page and not logged in, redirect to login
    if (!user && pathname !== "/login") {
      router.push("/login")
    }

    // If on login page and logged in, redirect to home
    if (user && pathname === "/login") {
      router.push("/")
    }

    setIsLoading(false)
  }, [pathname, router])

  if (isLoading) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gradient-to-b from-green-50 to-white`}>
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
