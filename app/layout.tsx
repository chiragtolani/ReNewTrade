import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { AIChat } from "@/components/AIChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReNewTrade - P2P Energy Trading Platform",
  description: "A modern platform for peer-to-peer renewable energy trading",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AIChat />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
