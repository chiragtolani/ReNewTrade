"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import EnergyLedger from "../frontend-data/EnergyLedger.json"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface BlockchainContextType {
  contract: ethers.Contract | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  connectWallet: () => Promise<void>
  isConnected: boolean
}

const BlockchainContext = createContext<BlockchainContextType>({
  contract: null,
  provider: null,
  signer: null,
  address: null,
  connectWallet: async () => {},
  isConnected: false,
})

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const setupConnection = async (provider: ethers.BrowserProvider, accounts: string[]) => {
    try {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        EnergyLedger.address,
        EnergyLedger.abi,
        signer
      )

      setProvider(provider)
      setSigner(signer)
      setContract(contract)
      setAddress(accounts[0])
      setIsConnected(true)
    } catch (error) {
      console.error("Error setting up connection:", error)
    }
  }

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      // Switch to Sepolia network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      })

      const provider = new ethers.BrowserProvider(window.ethereum)
      await setupConnection(provider, accounts)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            if (chainId === "0xaa36a7") { // Sepolia chainId
              const provider = new ethers.BrowserProvider(window.ethereum)
              await setupConnection(provider, accounts)
            }
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // Listen for account and network changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // Wallet disconnected
          setAddress(null)
          setIsConnected(false)
          setContract(null)
          setSigner(null)
        } else {
          const provider = new ethers.BrowserProvider(window.ethereum)
          await setupConnection(provider, accounts)
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Cleanup
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [])

  return (
    <BlockchainContext.Provider
      value={{
        contract,
        provider,
        signer,
        address,
        connectWallet,
        isConnected,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

export const useBlockchain = () => useContext(BlockchainContext) 