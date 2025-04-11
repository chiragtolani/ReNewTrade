"use client"

import { motion } from "framer-motion"
import { Leaf } from "lucide-react"

export default function LoginWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute left-8 md:left-16 lg:left-24 top-1/2 transform -translate-y-1/2 z-10 max-w-md text-white"
    >
      <div className="bg-green-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">ReNewTrade</h1>
        </div>
        <h2 className="text-xl font-semibold mb-3">Renewable Energy Trading Platform</h2>
        <p className="mb-4 text-white/90">
          Connect, trade, and manage renewable energy with ease. Join our community of environmentally conscious users
          making a difference through peer-to-peer energy trading.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm">Trade surplus energy for real money</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm">Earn carbon credits for environmental impact</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-sm">Connect directly with your bank account</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
