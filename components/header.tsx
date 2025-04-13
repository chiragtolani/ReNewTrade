"use client"

import { BellIcon, Building, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState, useEffect } from 'react'
import { BrowserProvider, Contract, JsonRpcSigner, formatEther } from 'ethers'
import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  bankBalance: number
  carbonCredits: number
  userName: string
  bankName: string
}

export default function Header({ bankBalance, carbonCredits, userName, bankName }: HeaderProps) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState("")
  const [walletBalance, setWalletBalance] = useState("0")
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask')
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const newSigner = await provider.getSigner()
      const address = await newSigner.getAddress()
      const balance = await provider.getBalance(address)
      
      setSigner(newSigner)
      setConnectedAddress(address)
      setWalletBalance(formatEther(balance))
      setIsConnected(true)
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setSigner(null)
    setConnectedAddress("")
    setWalletBalance("0")
    setIsConnected(false)
    toast.success('Wallet disconnected')
  }

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      const provider = window.ethereum as any;  // Type assertion for MetaMask provider
      provider.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setConnectedAddress(accounts[0]);
          const ethProvider = new BrowserProvider(provider);
          const balance = await ethProvider.getBalance(accounts[0]);
          setWalletBalance(formatEther(balance));
        }
      });
    }

    return () => {
      if (window.ethereum) {
        const provider = window.ethereum as any;
        provider.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium"
      >
        Welcome to ReNewTrade, {userName}
      </motion.div>

      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-4">
          <motion.div className="hidden flex-col md:flex" whileHover={{ scale: 1.05 }}>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">${bankBalance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                {carbonCredits.toFixed(1)} Carbon Credits
              </Badge>
            </div>
          </motion.div>

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>{parseFloat(walletBalance).toFixed(4)} ETH</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs font-medium">{connectedAddress}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={connectWallet} className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@renewtrade.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {bankName}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("user")
                  router.push("/login")
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
