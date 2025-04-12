import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { AIChat } from "@/components/AIChat"
import ClientLayout from "./clientLayout"
import { WalletProvider } from "@/contexts/WalletContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReNewTrade - Energy Trading Platform",
  description: "A decentralized platform for trading renewable energy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <ClientLayout>
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
      </ClientLayout>
    </WalletProvider>
  )
}
