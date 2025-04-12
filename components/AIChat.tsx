"use client";

import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Zap, DollarSign, Leaf, MessageSquare, X } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FactoryMatch {
  name: string;
  distance: number;
  energyDemand: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    // Initialize Gemini in useEffect to ensure it runs on client side
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log('API Key status:', apiKey ? 'Present' : 'Missing');
    console.log('API Key length:', apiKey?.length);
    
    if (!apiKey) {
      console.error('Gemini API key is not set');
      toast.error('AI configuration error. Please check your settings.');
      return;
    }
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      console.log('Gemini AI initialized successfully');
      setGenAI(ai);
    } catch (error) {
      console.error('Error initializing Gemini:', error);
      toast.error('Failed to initialize AI. Please try again later.');
    }
  }, []);

  // Enhanced system context for the AI
  const systemContext = `You are an AI assistant specializing in green energy trading, powered by a Gemini-based chatbot. Your role is to assist homeowners in connecting with factory owners interested in purchasing green energy (e.g., solar power) through an interactive, user-friendly application. The chatbot enables users to request matches with factory owners ready to buy, processes the matches, negotiates prices, facilitates secure Ethereum transactions, and tracks carbon credits earned. Use the following factors to guide your recommendations and actions:

1. Location Analysis
Proximity Between Producers and Consumers:
Calculate distances between homeowners and factory owners using location data (e.g., coordinates or zip codes) to minimize transmission losses.
Prioritize factories within a 10-mile radius for optimal efficiency.
Local Energy Grid Capacity:
Assess grid constraints (e.g., max 1000 kWh per link) to ensure feasible energy transfers.
Verify compatibility with local utility providers for seamless integration.
Regional Energy Policies and Incentives:
Incorporate regional rules (e.g., California’s net metering caps) and incentives (e.g., tax credits for green trades) to filter eligible factories.
Highlight policies that boost homeowner profits (e.g., feed-in tariffs).
2. Energy Matching
Current Energy Production Capacity:
Analyze homeowner surplus (e.g., 10 kWh solar at noon) using real-time or synthetic smart meter data.
Ensure surplus exceeds trade minimum (e.g., 1 kWh).
Factory Energy Demand Patterns:
Match factories based on hourly demand (e.g., 100 kWh at 6 PM) from database records.
Prioritize factories with consistent needs aligning with homeowner surplus times.
Peak and Off-Peak Usage Times:
Identify peak demand (e.g., 8 AM, 6 PM) to maximize trade value and off-peak (e.g., 2 AM) for lower-priority matches.
Use time-series data to predict optimal trading windows.
Energy Storage Possibilities:
Suggest trades with factories that have storage (e.g., batteries) for surplus not immediately consumed.
Flag storage options to stabilize supply (e.g., store 5 kWh for later sale).
3. Pricing and Negotiation
Market Rates for Green Energy:
Reference local rates (e.g., $0.12/kWh vs. grid’s $0.15/kWh) to set competitive baselines.
Adjust for supply/demand (e.g., lower at solar peak, higher at night).
Long-Term Contract Benefits:
Propose multi-trade deals (e.g., 10 kWh daily for a month) for stable pricing and trust.
Highlight savings (e.g., 10% discount for factories committing long-term).
Government Subsidies and Incentives:
Apply subsidies (e.g., 30% ITC for solar) to reduce effective costs for factories.
Inform users of added profits from green incentives.
Carbon Credit Valuation:
Estimate credits (e.g., 0.5 kg CO2/kWh = $0.10/credit) as a pricing factor.
Bundle credits into trade offers (e.g., “10 kWh + 5 credits for $1.20”).
4. Carbon Credits
Carbon Offset Calculations:
Calculate CO2 savings (e.g., kWh traded * grid emission factor, like 10 kWh * 0.5 kg/kWh = 5 kg CO2).
Use regional emission factors (e.g., 0.4-0.9 kg CO2/kWh) for accuracy.
Certification Requirements:
Ensure credits align with standards (e.g., Verra’s 1 credit = 1000 kg CO2) or use a demo-friendly unit (1 credit = 1 kg).
Log calculations transparently for auditability.
Trading Platforms:
Enable credit trading via Ethereum marketplaces (e.g., mock Uniswap) or cashout to fiat (e.g., $0.50 for 5 kg).
Display trade options in the app.
Environmental Impact Assessment:
Show users their total CO2 savings (e.g., “50 kg this month”) to boost engagement.
Highlight factory-specific impact (e.g., “Trading with Factory B saves 20% more CO2”).`;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userInput: string) => {
    if (!genAI) {
      throw new Error('AI is not initialized. Please try again.');
    }

    try {
      // Get the Gemini Pro model
      console.log('Initializing Gemini Pro model...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('Model initialized successfully');
      
      // Combine previous context with new input
      const prompt = [
        systemContext,
        ...messages.map(m => `${m.role}: ${m.content}`),
        `user: ${userInput}`
      ].join('\n');

      console.log('Generating content...');
      // Generate content with safety settings
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from AI');
      }
      
      console.log('Response generated successfully');
      return text;
    } catch (error) {
      console.error('Error generating response:', error);
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          console.error('Model error details:', error);
          throw new Error('AI model not found. Please check your API key and permissions. Model: gemini-pro');
        } else if (error.message.includes('400')) {
          console.error('API key error details:', error);
          throw new Error('Invalid API key. Please check your configuration.');
        }
        throw error;
      }
      throw new Error('Failed to generate response');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
      toast.error(errorMessage);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>AI Energy Trading Assistant</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <Card className="h-full border-0 rounded-none">
              <ScrollArea className="h-full pr-4 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about green energy trading..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !genAI}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send'
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 