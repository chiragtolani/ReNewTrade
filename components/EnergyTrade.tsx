"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { utils } from 'ethers';
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useBlockchain } from "@/contexts/blockchain-context";

interface TradeData {
  sellerAddress: string;
  buyerAddress: string;
  buyerName: string;
  kWh: number;
  price: number;
  timestamp: string;
  status: string;
  type: string;
  transactionId: string;
}

interface Transaction {
  id: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  netAmount: number;
  utilityFee: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  counterparty: string;
}

interface EnergyTradeProps {
  onTransactionComplete?: (transaction: Transaction) => void;
}

export default function EnergyTrade({ onTransactionComplete }: EnergyTradeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const { contract, connectWallet, isConnected, address } = useBlockchain();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load trade data
        const response = await fetch('/energy-trade.json');
        const data = await response.json();
        setTradeData(data);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, []);

  // Debug logging for connection state changes
  useEffect(() => {
    console.log('Connection state:', {
      isConnected,
      address,
      hasContract: !!contract
    });
  }, [isConnected, address, contract]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleSell = async () => {
    if (!contract || !address || !tradeData) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (address.toLowerCase() !== tradeData.sellerAddress.toLowerCase()) {
      toast.error(`Please connect with the seller account ${tradeData.sellerAddress}`);
      return;
    }

    setIsLoading(true);
    try {
      const priceInWei = utils.parseEther(tradeData.price.toString());
      console.log('Transaction participants:', {
        seller: address,
        buyer: tradeData.buyerAddress,
        contract: contract.target
      });

      const tx = await contract.addTransaction(
        tradeData.buyerAddress,
        tradeData.kWh,
        priceInWei,
        0,
        { 
          value: priceInWei,
          gasLimit: 500000
        }
      );
      
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      // Create transaction record for history
      const utilityFee = Number(utils.formatEther(priceInWei)) * 0.3; // 30% utility fee
      const total = Number(utils.formatEther(priceInWei));
      const netAmount = total - utilityFee;

      const transaction: Transaction = {
        id: tx.hash,
        type: "sell",
        amount: tradeData.kWh,
        price: Number(utils.formatEther(priceInWei)),
        total: total,
        netAmount: netAmount,
        utilityFee: utilityFee,
        timestamp: new Date().toISOString(),
        status: "completed",
        counterparty: tradeData.buyerName
      };

      // Update transaction history through callback
      if (onTransactionComplete) {
        onTransactionComplete(transaction);
      }
      
      toast.success('Energy sold successfully!');
    } catch (error) {
      console.error('Error selling energy:', error);
      toast.error('Failed to sell energy. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tradeData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const addressesMatch = address && tradeData.sellerAddress 
    ? address.toLowerCase() === tradeData.sellerAddress.toLowerCase()
    : false;

  const canSell = isConnected && addressesMatch;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Energy Trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Seller</p>
              <p className="font-mono text-sm">{tradeData.sellerAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Buyer ({tradeData.buyerName})</p>
              <p className="font-mono text-sm">{tradeData.buyerAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p>{tradeData.kWh} kWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p>{tradeData.price} ETH</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="capitalize">{tradeData.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p>{tradeData.transactionId}</p>
            </div>
          </div>

          <Button
            onClick={!isConnected ? handleConnect : handleSell}
            disabled={isLoading || (isConnected && !canSell)}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : !isConnected ? (
              'Connect Wallet'
            ) : !addressesMatch ? (
              'Wrong Account Connected'
            ) : (
              'Sell Energy'
            )}
          </Button>

          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-2">
            <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
            <p>Address: {address || 'None'}</p>
            <p>Has Contract: {contract ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 