"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Leaf, Building, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginAnimation from "@/components/login-animation"
import LoginWelcome from "@/components/login-welcome"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bankSelected, setBankSelected] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password")
      setIsLoading(false)
      return
    }

    // Mock authentication - in a real app, this would be a server request
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "John Smith",
            username: "admin",
            bankAccount: bankSelected || "Chase",
            bankBalance: 1250.75,
          }),
        )
        router.push("/")
      } else {
        setError("Invalid credentials. Try admin/admin")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleBankLogin = (bank: string) => {
    setBankSelected(bank)
    setIsLoading(true)

    // Mock Plaid integration - in a real app, this would open Plaid Link
    setTimeout(() => {
      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "John Smith",
          username: "admin",
          bankAccount: bank,
          bankBalance: 1250.75,
        }),
      )
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-end bg-gradient-to-b from-green-900/20 to-green-50/50 p-4 relative overflow-hidden">
      <LoginAnimation />
      <LoginWelcome />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-md relative z-10 mr-8 md:mr-16 lg:mr-24"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-green-100 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
                className="rounded-full bg-green-100 p-3"
              >
                <Leaf className="h-10 w-10 text-green-600" />
              </motion.div>
            </div>
            <CardTitle className="text-2xl">ReNewTrade</CardTitle>
            <CardDescription>Access the renewable energy trading platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="bank" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bank">Bank Account</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>
              <TabsContent value="bank" className="space-y-4 pt-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    No crypto wallet? No problem! Sign in with your bank account.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleBankLogin("Chase")}
                    disabled={isLoading}
                  >
                    <Building className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Chase</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleBankLogin("Bank of America")}
                    disabled={isLoading}
                  >
                    <Building className="h-8 w-8 text-red-600 mb-2" />
                    <span className="text-sm font-medium">Bank of America</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 hover:bg-green-50 hover:border-green-200"
                    onClick={() => handleBankLogin("Wells Fargo")}
                    disabled={isLoading}
                  >
                    <Building className="h-8 w-8 text-green-700 mb-2" />
                    <span className="text-sm font-medium">Wells Fargo</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 hover:bg-purple-50 hover:border-purple-200"
                    onClick={() => handleBankLogin("Other Bank")}
                    disabled={isLoading}
                  >
                    <Building className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium">Other Bank</span>
                  </Button>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or connect wallet</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleBankLogin("Crypto Wallet")}
                  disabled={isLoading}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Crypto Wallet</span>
                </Button>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-4 pt-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p className="w-full">
              Demo credentials: username <strong>admin</strong> / password <strong>admin</strong>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
