"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletIcon, ExternalLink, CreditCard, ArrowUpRight, ArrowDownLeft, Building, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WalletInfoProps {
  balance: number
  bankBalance: number
  bankName: string
  address?: string
}

export default function WalletInfo({ balance, bankBalance, bankName, address = "0x1a2b...3c4d" }: WalletInfoProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Payment Methods
          </CardTitle>
          <CardDescription>Manage your bank account and blockchain wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank">Bank Account</TabsTrigger>
              <TabsTrigger value="crypto">Crypto Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="bank" className="space-y-4 pt-4">
              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{bankName}</span>
                  </div>
                  <span className="text-xl font-bold">${bankBalance.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Account Type</span>
                    <span>Checking Account</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Account Number</span>
                    <span className="font-mono">****6789</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-2">
                <Button className="flex-1 flex items-center gap-2">
                  <ArrowDownLeft className="h-4 w-4" />
                  Deposit
                </Button>
                <Button variant="outline" className="flex-1 flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Connected Utility</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="text-sm">PG&E</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Change
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-4 pt-4">
              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Crypto Wallet</span>
                  </div>
                  <span className="text-xl font-bold">{balance.toFixed(4)} ETH</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Wallet Address</span>
                    <span className="font-mono text-xs">{address}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Network</span>
                    <span>Ethereum</span>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-2">
                <Button className="flex-1 flex items-center gap-2">
                  <ArrowDownLeft className="h-4 w-4" />
                  Receive
                </Button>
                <Button variant="outline" className="flex-1 flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Send
                </Button>
              </div>

              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <span>View on Explorer</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <div className="rounded-lg border p-4 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Connect Another Wallet</h3>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
