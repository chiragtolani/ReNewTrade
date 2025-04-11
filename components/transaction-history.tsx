"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { motion } from "framer-motion"
import { listItemVariants } from "@/lib/motion"

interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: number
  price: number
  total: number
  netAmount?: number
  utilityFee?: number
  timestamp: string
  status: "pending" | "completed" | "failed"
  counterparty: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {transactions.map((transaction) => (
        <motion.div
          key={transaction.id}
          variants={listItemVariants}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                transaction.type === "sell" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "sell" ? (
                <ArrowUpIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${transaction.type === "sell" ? "text-green-600" : "text-red-600"}`}>
                {transaction.type === "sell" ? "Sold" : "Bought"} {transaction.amount} kWh
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.timestamp).toLocaleString()} • {transaction.counterparty}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className={`text-sm font-medium ${transaction.type === "sell" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "sell" ? "+" : "-"}${transaction.total.toFixed(2)}
            </p>
            {transaction.utilityFee !== undefined && (
              <p className="text-xs text-muted-foreground">
                Fee: ${transaction.utilityFee.toFixed(2)} • Net: $
                {(transaction.total - transaction.utilityFee).toFixed(2)}
              </p>
            )}
            <Badge
              variant={
                transaction.status === "completed"
                  ? "outline"
                  : transaction.status === "pending"
                    ? "secondary"
                    : "destructive"
              }
              className="text-xs"
            >
              {transaction.status}
            </Badge>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
