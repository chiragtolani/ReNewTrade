"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Bell, Moon, Sun, Globe, Shield, CreditCard, Building, Zap, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Dashboard from "@/components/dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [bankAccount, setBankAccount] = useState("Chase")
  const [utilityProvider, setUtilityProvider] = useState("PG&E")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleSavePayment = () => {
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  return (
    <Dashboard activeTab="settings">
      <div className="container mx-auto py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="payment" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="payment">Payment & Utility</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-6">
              {showSuccessAlert && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Your payment and utility settings have been updated successfully.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Bank Account
                  </CardTitle>
                  <CardDescription>Manage your connected bank account for payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Connected Bank</Label>
                      <Select defaultValue={bankAccount} onValueChange={setBankAccount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chase">Chase</SelectItem>
                          <SelectItem value="Bank of America">Bank of America</SelectItem>
                          <SelectItem value="Wells Fargo">Wells Fargo</SelectItem>
                          <SelectItem value="Citibank">Citibank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg border p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-blue-800 mb-1">Secure Banking</h3>
                          <p className="text-xs text-blue-700">
                            Your bank account information is securely stored using bank-level encryption. We never store
                            your full account details on our servers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-deposit Earnings</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically deposit earnings to your bank account
                        </p>
                      </div>
                      <Switch id="auto-deposit" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Utility Provider
                  </CardTitle>
                  <CardDescription>Manage your utility provider connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Utility Provider</Label>
                      <Select defaultValue={utilityProvider} onValueChange={setUtilityProvider}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select utility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PG&E">Pacific Gas & Electric (PG&E)</SelectItem>
                          <SelectItem value="SCE">Southern California Edison (SCE)</SelectItem>
                          <SelectItem value="SDGE">San Diego Gas & Electric (SDG&E)</SelectItem>
                          <SelectItem value="Other">Other Utility Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg border p-4 bg-yellow-50 border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-yellow-800 mb-1">Utility Fee Information</h3>
                          <p className="text-xs text-yellow-700">
                            Your utility provider charges a 30% fee on all energy transactions for grid maintenance and
                            regulatory compliance. This fee is automatically calculated and paid from each transaction.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Apply Credits to Utility Bill</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically apply carbon credits to reduce your utility bill
                        </p>
                      </div>
                      <Switch id="auto-apply-credits" />
                    </div>
                  </div>

                  <Button onClick={handleSavePayment}>Save Payment & Utility Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Regulatory Compliance
                  </CardTitle>
                  <CardDescription>View and understand energy trading regulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-2">Trading Limits</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-medium">•</span>
                          <span>Maximum 100 kWh per day trading limit (CA PUC Regulation)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-medium">•</span>
                          <span>Maximum $500 per day transaction limit</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-medium">•</span>
                          <span>All transactions are reported to your utility provider</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your account via email
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Trade Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new trading opportunities</p>
                      </div>
                      <Switch id="trade-alerts" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Bank Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when money is deposited or withdrawn
                        </p>
                      </div>
                      <Switch id="bank-alerts" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share your energy data with the community</p>
                      </div>
                      <Switch id="data-sharing" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Transaction Insurance</Label>
                        <p className="text-sm text-muted-foreground">
                          Insure your energy trades up to $1,000 (included free)
                        </p>
                      </div>
                      <Switch id="transaction-insurance" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Manage your application preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Theme</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred application theme</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <Switch id="theme-toggle" />
                        <Moon className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-base">Language</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred language for the application
                      </p>
                      <div className="flex items-center space-x-2 pt-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <RadioGroup defaultValue="english" className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="english" id="english" />
                            <Label htmlFor="english">English</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spanish" id="spanish" />
                            <Label htmlFor="spanish">Spanish</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="french" id="french" />
                            <Label htmlFor="french">French</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Dashboard>
  )
}
