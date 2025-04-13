"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { providers, utils } from 'ethers';
import { toast } from "react-hot-toast";

interface WalletContextType {
  isConnected: boolean;
  connectedAddress: string;
  walletBalance: string;
  signer: providers.JsonRpcSigner | null;
  provider: providers.Web3Provider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);

  const updateWalletInfo = async (newProvider: providers.Web3Provider, address: string) => {
    try {
      const newSigner = newProvider.getSigner();
      const balance = await newProvider.getBalance(address);
      
      setSigner(newSigner);
      setProvider(newProvider);
      setConnectedAddress(address);
      setWalletBalance(utils.formatEther(balance));
      setIsConnected(true);
    } catch (error) {
      console.error('Error updating wallet info:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask');
      return;
    }

    try {
      const newProvider = new providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await updateWalletInfo(newProvider, accounts[0]);
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setConnectedAddress("");
    setWalletBalance("0");
    setIsConnected(false);
    toast.success('Wallet disconnected');
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const newProvider = new providers.Web3Provider(window.ethereum);
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            await updateWalletInfo(newProvider, accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const provider = window.ethereum as any;
      
      provider.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const newProvider = new providers.Web3Provider(provider);
          await updateWalletInfo(newProvider, accounts[0]);
        }
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        const provider = window.ethereum as any;
        provider.removeListener('accountsChanged', () => {});
        provider.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider 
      value={{
        isConnected,
        connectedAddress,
        walletBalance,
        signer,
        provider,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 