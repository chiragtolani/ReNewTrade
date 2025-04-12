import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Zap, DollarSign, Leaf } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  // Enhanced system context for the AI
  const systemContext = `You are an AI assistant specializing in green energy trading. Your role is to help homeowners connect with factory owners interested in purchasing green energy. Consider the following factors:

1. Location Analysis:
   - Proximity between energy producers and consumers
   - Local energy grid capacity
   - Regional energy policies and incentives

2. Energy Matching:
   - Current energy production capacity
   - Factory energy demand patterns
   - Peak and off-peak usage times
   - Energy storage possibilities

3. Pricing and Negotiation:
   - Market rates for green energy
   - Long-term contract benefits
   - Government subsidies and incentives
   - Carbon credit valuation

4. Carbon Credits:
   - Carbon offset calculations
   - Certification requirements
   - Trading platforms
   - Environmental impact assessment

Provide specific, actionable recommendations and facilitate connections between homeowners and factory owners. Use markdown formatting for better readability.`;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Combine previous context with new input
      const prompt = [
        systemContext,
        ...messages.map(m => `${m.role}: ${m.content}`),
        `user: ${userInput}`
      ].join('\n');

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
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
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card className="flex-1 p-4">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about green energy trading..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Send'
          )}
        </Button>
      </form>
    </div>
  );
} 