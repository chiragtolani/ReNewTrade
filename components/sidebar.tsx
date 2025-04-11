"use client"

import { useState } from "react"
import {
  Home,
  BarChart3,
  RefreshCw,
  Leaf,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "trade", label: "Trade Energy", icon: RefreshCw },
    { id: "history", label: "History", icon: BarChart3 },
    { id: "carbon", label: "Carbon Credits", icon: Leaf },
    { id: "wallet", label: "Payment Methods", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "logout", label: "Logout", icon: LogOut },
  ]

  return (
    <motion.div
      className={cn(
        "relative hidden border-r bg-green-900 text-white md:block transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
      animate={{ width: collapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-16 items-center border-b border-green-800 px-6">
        <div className="flex items-center gap-2">
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex items-center justify-center">
            <Leaf className="h-6 w-6" />
          </motion.div>

          {!collapsed && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-semibold tracking-tight"
            >
              ReNewTrade
            </motion.h2>
          )}
        </div>
      </div>
      <div className="py-4">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-green-800",
                  activeTab === item.id ? "bg-green-800 text-white" : "text-green-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </motion.button>
            )
          })}
        </nav>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-green-700 text-white hover:bg-green-600"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </motion.div>
  )
}
