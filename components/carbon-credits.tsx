"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, ArrowRight, Award, TreePine, BadgeIcon as Certificate, Building, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CarbonCreditsProps {
  credits: number
  bankAccount: string
  utilityProvider: string
}

export default function CarbonCredits({ credits, bankAccount, utilityProvider }: CarbonCreditsProps) {
  const [showCashoutConfirmation, setShowCashoutConfirmation] = useState(false)
  const [showUtilityConfirmation, setShowUtilityConfirmation] = useState(false)
  const [remainingCredits, setRemainingCredits] = useState(credits)

  const handleCashout = () => {
    if (remainingCredits >= 10) {
      setRemainingCredits((prev) => prev - 10)
      setShowCashoutConfirmation(true)
      setTimeout(() => setShowCashoutConfirmation(false), 3000)
    }
  }

  const handleUtilityDiscount = () => {
    if (remainingCredits >= 5) {
      setRemainingCredits((prev) => prev - 5)
      setShowUtilityConfirmation(true)
      setTimeout(() => setShowUtilityConfirmation(false), 3000)
    }
  }

  // Calculate dollar value of credits
  const creditValue = remainingCredits * 0.5 // $0.50 per credit
  const carbonOffset = remainingCredits * 5 // 5kg CO2 per credit

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Carbon Credits
            </CardTitle>
            <CardDescription>Track and manage your earned carbon credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="flex items-center justify-center py-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-green-100">
                <Leaf className="h-16 w-16 text-green-500" />
                <motion.div
                  className="absolute -top-2 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg font-bold">{remainingCredits.toFixed(1)}</span>
                </motion.div>
              </div>
            </motion.div>

            <div className="rounded-lg border p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Credit Value</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Cash value</span>
                  <span className="text-sm font-medium">${creditValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Carbon offset</span>
                  <span className="text-sm font-medium">{carbonOffset.toFixed(1)} kg CO₂</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next tier</span>
                <span className="font-medium">{Math.min(Math.round((remainingCredits / 20) * 100), 100)}%</span>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }}>
                <Progress value={Math.min((remainingCredits / 20) * 100, 100)} className="h-2" />
              </motion.div>
              <p className="text-xs text-muted-foreground">Earn 20 credits to reach Silver tier</p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">How to earn more credits</h3>
              <ul className="space-y-2 text-sm">
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Sell more renewable energy to peers</span>
                </motion.li>
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Refer friends to the platform</span>
                </motion.li>
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>Participate in community energy events</span>
                </motion.li>
              </ul>
            </div>

            {showCashoutConfirmation && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Cash Out Successful!</AlertTitle>
                <AlertDescription>
                  $5.00 will be deposited to your {bankAccount} account within 1-2 business days.
                </AlertDescription>
              </Alert>
            )}

            {showUtilityConfirmation && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Discount Applied!</AlertTitle>
                <AlertDescription>$2.50 discount will be applied to your next {utilityProvider} bill.</AlertDescription>
              </Alert>
            )}
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
              <Award className="h-5 w-5 text-purple-600" />
              Redeem Credits
            </CardTitle>
            <CardDescription>Use your carbon credits for rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500" />
                    Cash Redemption
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    10 credits ($5.00)
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Convert your carbon credits to cash at a rate of $0.50 per credit, deposited to your {bankAccount}{" "}
                  account
                </p>
                <Button variant="outline" className="w-full" disabled={remainingCredits < 10} onClick={handleCashout}>
                  Cash Out ${Math.min(remainingCredits, 10) * 0.5}
                </Button>
              </motion.div>

              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Utility Bill Discount
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    5 credits ($2.50)
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Apply a discount to your next {utilityProvider} bill at a rate of $0.50 per credit
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={remainingCredits < 5}
                  onClick={handleUtilityDiscount}
                >
                  Apply ${Math.min(remainingCredits, 5) * 0.5} Discount
                </Button>
              </motion.div>

              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-green-500" />
                    Plant a Tree
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    5 credits
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  We'll plant a tree on your behalf through our reforestation partners
                </p>
                <Button variant="outline" className="w-full" disabled={remainingCredits < 5}>
                  Plant a Tree
                </Button>
              </motion.div>

              <motion.div
                className="rounded-lg border p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Certificate className="h-4 w-4 text-blue-500" />
                    Carbon Offset Certificate
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    15 credits
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Receive an official carbon offset certificate for your contributions
                </p>
                <Button variant="outline" className="w-full" disabled={remainingCredits < 15}>
                  Get Certificate
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
