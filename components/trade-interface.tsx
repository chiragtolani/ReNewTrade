"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { providers, Contract, utils } from 'ethers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, RefreshCw, ArrowLeftRight, Building, ShieldCheck, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { pulseAnimation } from "@/lib/motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-hot-toast"

interface TradeInterfaceProps {
  onTrade: (tradeData: any) => void
  availableSurplus: number
  currentRate: number
  bankAccount: string
}

export default function TradeInterface({ onTrade, availableSurplus, currentRate, bankAccount }: TradeInterfaceProps) {
  const [tradeType, setTradeType] = useState("sell")
  const [amount, setAmount] = useState(1)
  const [price, setPrice] = useState(currentRate)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contract, setContract] = useState<Contract | null>(null)
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null)

  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        try {
          const newProvider = new providers.Web3Provider(window.ethereum);
          setProvider(newProvider);
          const newSigner = newProvider.getSigner();
          setSigner(newSigner);

          // Load contract ABI and address
          const response = await fetch('/frontend-data/EnergyLedger.json');
          const { abi, address } = await response.json();

          // Create contract instance
          const contract = new Contract(address, abi, newSigner);
          setContract(contract);
        } catch (error) {
          console.error('Error initializing contract:', error);
          toast.error('Failed to initialize contract');
        }
      }
    };

    initializeContract();
  }, []);

  const handleAmountChange = (value: number[]) => {
    setAmount(value[0])
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true)
    try {
      const kWh = Math.floor(amount);
      const priceInETH = price.toString(); // Convert price to string for parseEther
      const priceInWei = utils.parseEther(priceInETH); // Convert ETH to Wei
      const buyerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #5

      console.log(`Sending ${priceInETH} ETH (${priceInWei.toString()} Wei) to ${buyerAddress}`);

      const tx = await contract.addTransaction(
        buyerAddress,
        kWh,
        priceInWei,
        0, // Status.Pending
        { value: priceInWei } // Send ETH with the transaction
      );
      
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      toast.success('Trade executed successfully!');
      
      // Update transaction history with new transaction
      const receipt = await provider?.getTransactionReceipt(tx.hash);
      if (receipt) {
        const newTx = {
          amount,
          price: priceInETH,
          type: tradeType,
          timestamp: new Date().toISOString(),
          hash: tx.hash,
          from: receipt.from,
          to: receipt.to,
          value: priceInWei.toString(), // Add the ETH value
          status: 'completed'
        };
        onTrade(newTx);
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      toast.error('Failed to execute trade');
    } finally {
      setIsLoading(false);
    }
  }

  const total = amount * price
  const utilityFee = total * 0.3 // 30% utility fee
  const netAmount = total - utilityFee
  const isCompliant = amount <= 100 // Regulatory cap of 100 kWh

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-green-600" />
              Trade Energy
            </CardTitle>
            <CardDescription>Buy or sell renewable energy directly with peers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="sell" className="w-full" onValueChange={setTradeType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sell">Sell Energy</TabsTrigger>
                  <TabsTrigger value="buy">Buy Energy</TabsTrigger>
                </TabsList>

                <TabsContent value="sell" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (kWh)</Label>
                    <div className="space-y-4">
                      <Slider
                        id="amount"
                        max={availableSurplus}
                        step={0.1}
                        defaultValue={[1]}
                        onValueChange={handleAmountChange}
                      />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">0 kWh</span>
                        <span className="text-sm font-medium">{amount.toFixed(1)} kWh</span>
                        <span className="text-sm text-muted-foreground">{availableSurplus} kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per kWh ($)</Label>
                    <Input id="price" type="number" step="0.01" min="0.01" value={price} onChange={handlePriceChange} />
                    <p className="text-xs text-muted-foreground">Current market rate: ${currentRate.toFixed(2)}/kWh</p>
                  </div>

                  <div className="rounded-lg border p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Regulatory Status:</span>
                      {isCompliant ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Compliant
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" /> Non-Compliant
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isCompliant
                        ? "This trade complies with local energy regulations (max 100 kWh/day)."
                        : "This trade exceeds the maximum allowed by regulations (100 kWh/day)."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (kWh)</Label>
                    <div className="space-y-4">
                      <Slider id="amount" max={5} step={0.1} defaultValue={[1]} onValueChange={handleAmountChange} />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">0 kWh</span>
                        <span className="text-sm font-medium">{amount.toFixed(1)} kWh</span>
                        <span className="text-sm text-muted-foreground">5 kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per kWh ($)</Label>
                    <Input id="price" type="number" step="0.01" min="0.01" value={price} onChange={handlePriceChange} />
                    <p className="text-xs text-muted-foreground">Current market rate: ${currentRate.toFixed(2)}/kWh</p>
                  </div>

                  <div className="rounded-lg border p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Regulatory Status:</span>
                      {isCompliant ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Compliant
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" /> Non-Compliant
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isCompliant
                        ? "This trade complies with local energy regulations (max 100 kWh/day)."
                        : "This trade exceeds the maximum allowed by regulations (100 kWh/day)."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-4">
                <motion.div className="flex flex-col gap-2 rounded-lg border p-4" animate={pulseAnimation}>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Amount</span>
                    <span className="text-sm font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 text-sm text-muted-foreground">
                          Utility Fee (30%)
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            This fee is paid to your utility provider (PG&E) for grid connection and maintenance.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-sm text-orange-600">-${utilityFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-1 flex justify-between">
                    <span className="text-sm font-medium">You {tradeType === "sell" ? "Receive" : "Pay"}</span>
                    <span className="text-lg font-bold">${netAmount.toFixed(2)}</span>
                  </div>
                </motion.div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Building className="h-4 w-4" />
                  <span>
                    Payment via {bankAccount} {tradeType === "sell" ? "deposit" : "withdrawal"}
                  </span>
                </div>

                <Button type="submit" className="w-full text-base" disabled={!isCompliant}>
                  {tradeType === "sell" ? "Sell Energy" : "Buy Energy"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Trade Preview
            </CardTitle>
            <CardDescription>Summary of your energy trade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="mb-4 text-center">
                <span className="text-2xl font-bold">{amount.toFixed(1)} kWh</span>
                <p className="text-sm text-muted-foreground">
                  {tradeType === "sell" ? "Energy to sell" : "Energy to buy"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Price per kWh</span>
                  <span className="text-sm font-medium">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total amount</span>
                  <span className="text-sm font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Utility fee (30%)</span>
                  <span className="text-sm font-medium">${utilityFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-1">
                  <span className="text-sm font-medium">Net amount</span>
                  <span className="text-sm font-medium">${netAmount.toFixed(2)}</span>
                </div>
                {tradeType === "sell" && (
                  <div className="flex justify-between">
                    <span className="text-sm">Estimated carbon credits</span>
                    <span className="text-sm font-medium">{(amount * 0.1).toFixed(1)} credits</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">How it works</h3>
              <p className="text-sm text-muted-foreground">
                {tradeType === "sell"
                  ? "When you sell energy, our AI agent will match you with nearby buyers. Payment will be deposited to your bank account, and a utility fee will be paid to your provider."
                  : "When you buy energy, our AI agent will match you with nearby sellers. Payment will be withdrawn from your bank account, including a utility fee paid to your provider."}
              </p>
            </div>

            {showConfirmation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your {tradeType} order has been submitted. ${netAmount.toFixed(2)} will be{" "}
                    {tradeType === "sell" ? "deposited to" : "withdrawn from"} your {bankAccount} account.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
