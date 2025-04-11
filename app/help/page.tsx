"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, MessageSquare, Phone, Mail, Building, Zap } from "lucide-react"
import Dashboard from "@/components/dashboard"

export default function HelpPage() {
  return (
    <Dashboard activeTab="help">
      <div className="container mx-auto py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Find answers to common questions about the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I sell my excess solar energy?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          To sell your excess solar energy, navigate to the "Trade" section from the sidebar. Enter the
                          amount of energy you want to sell and set your price. Our AI agent will match you with nearby
                          buyers, and payment will be deposited directly to your connected bank account.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What are utility fees and why do I pay them?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Utility fees (typically 30% of each transaction) are paid to your utility provider (e.g.,
                          PG&E) for grid connection, maintenance, and regulatory compliance. These fees ensure that your
                          energy trading is properly integrated with the existing power grid infrastructure.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do carbon credits work?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          You earn carbon credits by selling renewable energy on our platform. Each credit represents
                          approximately 5kg of CO₂ offset and is worth about $0.50. You can redeem these credits for
                          cash deposits to your bank account, utility bill discounts, or environmental initiatives like
                          tree planting.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Is my money safe on ReNewTrade?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Yes, all transactions on our platform are insured up to $1,000 by EnergyShield Insurance. We
                          use bank-level security for all financial transactions, and your bank account information is
                          protected using industry-standard encryption and security protocols.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>What are the regulatory limits for energy trading?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Most jurisdictions limit peer-to-peer energy trading to 100 kWh per day. Our platform
                          automatically checks your trades for compliance with local regulations and will notify you if
                          a trade exceeds these limits. This helps ensure that all transactions are legal and properly
                          reported to relevant authorities.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>Get help from our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" placeholder="John Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Help with energy trading" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea
                          id="message"
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your issue or question..."
                        />
                      </div>
                      <Button className="w-full">Submit Request</Button>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          Phone Support
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Call our customer service team for immediate assistance
                        </p>
                        <p className="text-sm font-medium">1-800-RENEWTRADE</p>
                        <p className="text-xs text-muted-foreground">Monday-Friday, 8am-6pm PT</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-green-600" />
                          Email Support
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">Send us an email anytime</p>
                        <p className="text-sm font-medium">support@renewtrade.com</p>
                        <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium mb-2">Partner Contacts</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Bank Support</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              1-800-BANK
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm">PG&E Support</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              1-800-PGE
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resources & Guides</CardTitle>
                  <CardDescription>Learn more about renewable energy trading</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Getting Started Guide</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Learn the basics of peer-to-peer energy trading
                        </p>
                        <Button variant="outline" className="w-full">
                          View Guide
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Regulatory Information</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Understand the rules and regulations for energy trading
                        </p>
                        <Button variant="outline" className="w-full">
                          View Regulations
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Video Tutorials</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          Watch step-by-step tutorials on using the platform
                        </p>
                        <Button variant="outline" className="w-full">
                          Watch Videos
                        </Button>
                      </CardContent>
                    </Card>
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
