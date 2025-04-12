"use client"

import type React from "react"
import type { Transaction } from "@/types/transaction"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./header"
import Sidebar from "./sidebar"
import EnergyProductionChart from "./energy-production-chart"
import TradeInterface from "./trade-interface"
import TransactionHistory from "./transaction-history"
import CarbonCredits from "./carbon-credits"
import WalletInfo from "./wallet-info"
import EnergyTrade from "./EnergyTrade"
import { mockEnergyData, mockTransactions } from "@/lib/mock-data"
import { staggerContainer, cardVariants } from "@/lib/motion"
import { Zap, BarChart3, RefreshCw, Building, DollarSign, Percent } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DashboardProps {
  children?: React.ReactNode
  activeTab?: string
}

interface TradeData {
  type: "sell" | "buy";
  amount: number;
  price: number;
}

export default function Dashboard({ children, activeTab: propActiveTab }: DashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(propActiveTab || "overview")
  const [energyData, setEnergyData] = useState(mockEnergyData)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [walletBalance, setWalletBalance] = useState(0.45)
  const [bankBalance, setBankBalance] = useState(1250.75)
  const [todayEarnings, setTodayEarnings] = useState(3.75)
  const [utilityFees, setUtilityFees] = useState(1.25)
  const [carbonCredits, setCarbonCredits] = useState(12.5)
  const [user, setUser] = useState<{
    name: string
    username: string
    bankAccount?: string
    bankBalance?: number
  } | null>(null)
  const [showInsuranceBanner, setShowInsuranceBanner] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      // Get user from localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        if (parsedUser.bankBalance) {
          setBankBalance(parsedUser.bankBalance)
        }
      }
    }
  }, [isClient])

  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab)
    } else if (pathname === "/") {
      setActiveTab("overview")
    }
  }, [propActiveTab, pathname])

  // Function to handle navigation
  const handleNavigation = (tab: string) => {
    setActiveTab(tab)

    switch (tab) {
      case "overview":
        router.push("/")
        break
      case "trade":
        router.push("/")
        setActiveTab("trade")
        break
      case "history":
        router.push("/")
        setActiveTab("history")
        break
      case "carbon":
        router.push("/")
        setActiveTab("carbon")
        break
      case "profile":
        router.push("/profile")
        break
      case "settings":
        router.push("/settings")
        break
      case "help":
        router.push("/help")
        break
      case "logout":
        localStorage.removeItem("user")
        router.push("/login")
        break
      default:
        router.push("/")
    }
  }

  // Function to handle new trades
  const handleTrade = (tradeData: TradeData) => {
    // Calculate utility fee (30% of transaction)
    const utilityFee = tradeData.amount * tradeData.price * 0.3
    const netAmount = tradeData.amount * tradeData.price - utilityFee

    // Create new transaction with proper typing
    const newTransaction: Transaction = {
      id: `tx-${transactions.length + 1}`,
      type: tradeData.type,
      amount: tradeData.amount,
      price: tradeData.price,
      total: tradeData.amount * tradeData.price,
      netAmount: netAmount,
      utilityFee: utilityFee,
      timestamp: new Date().toISOString(),
      status: "completed",
      counterparty: tradeData.type === "sell" ? "Factory B" : "Home A",
    }

    setTransactions([newTransaction, ...transactions])

    // Update balances
    if (tradeData.type === "sell") {
      setBankBalance((prev) => prev + netAmount)
      setTodayEarnings((prev) => prev + netAmount)
      setUtilityFees((prev) => prev + utilityFee)
      // Add carbon credits for selling renewable energy
      setCarbonCredits((prev) => prev + tradeData.amount * 0.1)
    } else {
      setBankBalance((prev) => prev - tradeData.amount * tradeData.price)
      setUtilityFees((prev) => prev + utilityFee)
    }
  }

  const handleEnergyTrade = (transaction: Transaction) => {
    // Add the new transaction to the list
    setTransactions([transaction, ...transactions]);

    // Update balances
    if (transaction.type === "sell") {
      setBankBalance((prev) => prev + transaction.netAmount);
      setTodayEarnings((prev) => prev + transaction.netAmount);
      setUtilityFees((prev) => prev + transaction.utilityFee);
      // Add carbon credits for selling renewable energy
      setCarbonCredits((prev) => prev + transaction.amount * 0.1);
    } else {
      setBankBalance((prev) => prev - transaction.total);
      setUtilityFees((prev) => prev + transaction.utilityFee);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (children) {
      return children
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {showInsuranceBanner && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-blue-800">
                      All energy trades are insured up to $1,000 by EnergyShield Insurance
                    </span>
                    <button onClick={() => setShowInsuranceBanner(false)} className="text-blue-800 text-sm underline">
                      Dismiss
                    </button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
                    <Building className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${bankBalance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{user?.bankAccount || "Connected Bank"}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
                    <p className="text-xs text-green-500">After utility fees</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utility Fees Paid</CardTitle>
                    <Percent className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${utilityFees.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">PG&E grid connection fees</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Surplus</CardTitle>
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.4 kWh</div>
                    <p className="text-xs text-green-500 font-medium">Available to trade</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Energy Production & Consumption
                    </CardTitle>
                    <CardDescription>Today's energy metrics in kilowatt-hours (kWh)</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <EnergyProductionChart data={energyData} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>Your latest energy trades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionHistory transactions={transactions.slice(0, 5)} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <EnergyTrade onTransactionComplete={handleEnergyTrade} />
            </motion.div>
          </div>
        )
      case "trade":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <TradeInterface
              onTrade={handleTrade}
              availableSurplus={1.4}
              currentRate={0.12}
              bankAccount={user?.bankAccount || "Connected Bank"}
            />
          </motion.div>
        )
      case "history":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Transaction History
                </CardTitle>
                <CardDescription>Complete record of your energy trades</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
          </motion.div>
        )
      case "carbon":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <CarbonCredits
              credits={carbonCredits}
              bankAccount={user?.bankAccount || "Connected Bank"}
              utilityProvider="PG&E"
            />
          </motion.div>
        )
      case "wallet":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <WalletInfo balance={walletBalance} bankBalance={bankBalance} bankName={user?.bankAccount || "Bank"} />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={handleNavigation} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          walletBalance={walletBalance}
          bankBalance={bankBalance}
          carbonCredits={carbonCredits}
          userName={user?.name || "User"}
          bankName={user?.bankAccount || "Bank"}
        />
        <div className="flex-1 overflow-auto p-4 md:p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
