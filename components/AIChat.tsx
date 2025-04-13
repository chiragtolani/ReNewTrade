"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ethers } from "ethers";
import EnergyLedger from "../frontend-data/EnergyLedger.json"; // Adjust path
import { useWallet } from "../contexts/WalletContext"; // Adjust path

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FactoryMatch {
  name: string;
  distance: number;
  energyDemand: number;
  priceRange: { min: number; max: number };
  lossFactor: number;
  walletAddress: string;
}

interface Transaction {
  factoryName: string;
  homeownerAddress: string;
  factoryAddress: string;
  energyAmount: number;
  pricePerKwh: number;
  totalPrice: number;
  timestamp: string;
  status: "pending" | "confirmed" | "settled";
  transactionId?: number;
  transactionHash?: string;
  carbonCredits?: number; // Added for carbon credits
}

export function AIChat() {
  const { isConnected, connectedAddress } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
  const [stage, setStage] = useState<
    "init" | "collecting_details" | "showing_matches" | "negotiating" | "confirming" | "completed"
  >("init");
  const [jsonData, setJsonData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCarbonCredits, setTotalCarbonCredits] = useState(0); // Track total credits
  const homeownerAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("AI configuration error.");
      return;
    }
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      setGenAI(ai);
    } catch (error) {
      console.error("Error initializing Gemini:", error);
      toast.error("Failed to initialize AI.");
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // System prompt with updated instructions
  const systemContext = `
You are an AI assistant specializing in green energy trading, facilitating connections between homeowners selling surplus renewable energy and factory owners buying it. Follow this workflow for user interactions, ensuring responses are clear, actionable, and user-friendly. Generate structured JSON data in the background for frontend processing, but present information to the user in readable, conversational text (e.g., bullet points, tables) without showing raw JSON in the chat unless explicitly requested. Additionally, calculate carbon credits for transactions based on energy sold (1 kWh = 0.0005 carbon credits) and include them in transaction outputs.

### Workflow

1. **User Initiates Sale**:
   - When a user messages about selling surplus energy, acknowledge and prompt for details:
     - Location (address or general area).
     - Energy production (type, capacity in kW, surplus in kWh daily/monthly).
     - Preferred contract terms (minimum price per kWh).
     - Any energy storage details.
   - Respond conversationally, e.g.:
     \`\`\`
     Great to hear you're interested in selling surplus energy! Could you share:
     - Your location (e.g., city or zip code).
     - Details of your energy setup (e.g., solar panels, 10 kW capacity, 20 kWh surplus daily).
     - Your preferred terms (e.g., minimum price per kWh, contract length).
     - Any battery storage you might have.
     \`\`\`
   - Store details internally for matching.

2. **Factory Matching**:
   - Match homeowner details with factories from:
     \`\`\`json
     [
       {
         "name": "GreenTech Industries",
         "address": "456 Industrial Park Road, Greenvale, CA 90215",
         "distance": 5,
         "energyDemand": 500000,
         "priceRange": { "min": 0.12, "max": 0.15 },
         "lossFactor": 0.05,
         "walletAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
       },
       {
         "name": "EcoFactory Corp",
         "address": "789 Factory Lane, Greenvale, CA 90216",
         "distance": 8,
         "energyDemand": 300000,
         "priceRange": { "min": 0.11, "max": 0.14 },
         "lossFactor": 0.07,
         "walletAddress": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
       },
       {
         "name": "SolarWorks Manufacturing",
         "address": "321 Solar Avenue, Greenvale, CA 90217",
         "distance": 3,
         "energyDemand": 400000,
         "priceRange": { "min": 0.13, "max": 0.16 },
         "lossFactor": 0.04,
         "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
       },
       {
         "name": "CleanEnergy Plants",
         "address": "654 Renewable Drive, Greenvale, CA 90218",
         "distance": 12,
         "energyDemand": 600000,
         "priceRange": { "min": 0.10, "max": 0.13 },
         "lossFactor": 0.08,
         "walletAddress": "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
       },
       {
         "name": "BrightFuture Factories",
         "address": "987 Greenway Blvd, Greenvale, CA 90219",
         "distance": 6,
         "energyDemand": 350000,
         "priceRange": { "min": 0.115, "max": 0.145 },
         "lossFactor": 0.06,
         "walletAddress": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
       }
     ]
     \`\`\`
   - Evaluate based on distance, loss factor, energy demand, and price compatibility.
   - Generate JSON internally:
     \`\`\`json
     {
       "factoryMatches": [
         {
           "name": string,
           "distance": number,
           "energyDemand": number,
           "priceRange": { "min": number, "max": number },
           "lossFactor": number,
           "walletAddress": string
         }
       ],
       "recommended": {
         "name": string,
         "reason": string
       }
     }
     \`\`\`
   - Present to user in readable format, e.g.:
     \`\`\`
     I've found some great matches for your energy sale:
     - **GreenTech Industries**: 5 miles away, needs 500,000 kWh/year, offers $0.12-$0.15/kWh, 5% loss.
     - **SolarWorks Manufacturing**: 3 miles away, needs 400,000 kWh/year, offers $0.13-$0.16/kWh, 4% loss.
     **Recommended**: SolarWorks Manufacturing, due to closer proximity and lower loss factor.
     Would you like to proceed with SolarWorks, choose another, or negotiate terms?
     \`\`\`

3. **Negotiation**:
   - Simulate negotiation to maximize homeowner price within factory range.
   - Generate JSON:
     \`\`\`json
     {
       "factory": {
         "name": string,
         "negotiatedPrice": number,
         "energyAmount": number,
         "lossFactor": number,
         "walletAddress": string
       },
       "status": "negotiation_complete"
     }
     \`\`\`
   - Present to user, e.g.:
     \`\`\`
     After negotiating with SolarWorks Manufacturing, we've agreed on:
     - Price: $0.15 per kWh
     - Energy: 20 kWh daily
     - Loss Factor: 4%
     Would you like to confirm this deal?
     \`\`\`

4. **Transaction Confirmation**:
   - Prepare JSON for EnergyLedger contract:
     \`\`\`json
     {
       "transaction": {
         "factoryName": string,
         "homeownerAddress": "0x14028b1fb1435125e679a8C2f87dF3FD8a6F907C",
         "factoryAddress": string,
         "energyAmount": number,
         "pricePerKwh": number,
         "totalPrice": number,
         "timestamp": string,
         "status": "pending",
         "carbonCredits": number
       }
     }
     \`\`\`
   - Calculate carbon credits: 1 kWh = 0.0005 credits.
   - Present to user, e.g.:
     \`\`\`
     Ready to confirm your transaction with SolarWorks Manufacturing:
     - Energy: 20 kWh
     - Price: $0.15/kWh
     - Total: $3.00
     - Carbon Credits Earned: 0.01
     Please confirm to proceed with MetaMask.
     \`\`\`

5. **Transaction Completion**:
   - After blockchain processing, generate JSON:
     \`\`\`json
     {
       "transaction": {
         "factoryName": string,
         "homeownerAddress": "0x14028b1fb1435125e679a8C2f87dF3FD8a6F907C",
         "factoryAddress": string,
         "energyAmount": number,
         "pricePerKwh": number,
         "totalPrice": number,
         "timestamp": string,
         "status": "confirmed",
         "transactionId": number,
         "transactionHash": string,
         "carbonCredits": number
       }
     }
     \`\`\`
   - Present to user, e.g.:
     \`\`\`
     Success! Your transaction with SolarWorks Manufacturing is confirmed:
     - Energy Sold: 20 kWh
     - Price: $0.15/kWh
     - Total: $3.00
     - Carbon Credits Earned: 0.01
     - Transaction ID: 123
     - View on Etherscan: [link]
     Your total carbon credits are now X.XX.
     \`\`\`

### Constraints
- Use homeowner address "0x14028b1fb1435125e679a8C2f87dF3FD8a6F907C".
- Generate JSON for frontend but show readable text in chat.
- Calculate carbon credits (1 kWh = 0.0005 credits) and include in transactions.
- Handle errors gracefully.
`;

  // Calculate carbon credits
  const calculateCarbonCredits = (energyAmount: number): number => {
    return energyAmount * 0.0005; // 1 kWh = 0.0005 credits
  };

  // Blockchain transaction
  const processTransaction = async (transaction: Transaction) => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected");
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      if (signerAddress.toLowerCase() !== homeownerAddress.toLowerCase()) {
        toast.error("MetaMask wallet does not match homeowner address.");
        return null;
      }

      const contract = new ethers.Contract(EnergyLedger.address, EnergyLedger.abi, signer);

      // Convert totalPrice (USD) to wei (ETH equivalent, demo rate: 1 USD = 0.0005 ETH)
      const ethPrice = ethers.parseEther((transaction.totalPrice * 0.0005).toFixed(18));
      const kWh = Math.round(transaction.energyAmount);
      const status = 0; // Pending

      const tx = await contract.addTransaction(transaction.factoryAddress, kWh, ethPrice, status, {
        value: ethPrice,
      });

      const receipt = await tx.wait();
      const txIndex = transactions.length; // Approximate index

      return { hash: tx.hash, id: txIndex };
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Failed to process transaction");
      return null;
    }
  };

  const generateResponse = async (userInput: string) => {
    if (!genAI) {
      throw new Error("AI is not initialized.");
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = [
        systemContext,
        ...messages.map((m) => `${m.role}: ${m.content}`),
        `user: ${userInput}`,
      ].join("\n");

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from AI");
      }

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      let parsedData: any = null;

      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedData = JSON.parse(jsonMatch[1]);
          if (parsedData.factoryMatches) {
            parsedData.factoryMatches.forEach((match: FactoryMatch) => {
              if (
                !match.name ||
                !match.distance ||
                !match.energyDemand ||
                !match.priceRange ||
                !match.lossFactor ||
                !ethers.isAddress(match.walletAddress)
              ) {
                throw new Error("Invalid factory match data");
              }
            });
          }
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
        }
      }

      return { text, json: parsedData };
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      if (!isConnected) {
        toast.error("Please connect your wallet in the header.");
        setIsLoading(false);
        return;
      }
      if (connectedAddress.toLowerCase() !== homeownerAddress.toLowerCase()) {
        toast.error("Connected wallet does not match homeowner address.");
        setIsLoading(false);
        return;
      }

      const { text, json } = await generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);

      if (json) {
        setJsonData(json);
        if (json.factoryMatches) {
          setStage("showing_matches");
        } else if (json.status === "negotiation_complete") {
          setStage("confirming");
        } else if (json.transaction?.status === "pending") {
          setStage("confirming");
          if (!ethers.isAddress(json.transaction.factoryAddress)) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "Invalid factory wallet address." },
            ]);
            setIsLoading(false);
            return;
          }

          // Calculate carbon credits
          const carbonCredits = calculateCarbonCredits(json.transaction.energyAmount);
          const transactionWithCredits = {
            ...json.transaction,
            homeownerAddress,
            carbonCredits,
          };

          const result = await processTransaction(transactionWithCredits);
          if (result) {
            const updatedTransaction = {
              ...transactionWithCredits,
              status: "confirmed",
              transactionId: result.id,
              transactionHash: result.hash,
            };
            setJsonData({ transaction: updatedTransaction });
            setTransactions((prev) => [...prev, updatedTransaction]);
            setTotalCarbonCredits((prev) => prev + carbonCredits);
            setStage("completed");
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `Success! Your transaction with ${updatedTransaction.factoryName} is confirmed:\n- Energy Sold: ${updatedTransaction.energyAmount} kWh\n- Price: $${updatedTransaction.pricePerKwh}/kWh\n- Total: $${updatedTransaction.totalPrice}\n- Carbon Credits Earned: ${carbonCredits.toFixed(4)}\n- Transaction ID: ${result.id}\n- [View on Etherscan](https://etherscan.io/tx/${result.hash})\n\nYour total carbon credits are now ${totalCarbonCredits + carbonCredits.toFixed(4)}.`,
              },
            ]);
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate response";
      toast.error(errorMessage);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transaction history UI with carbon credits
  const TransactionHistory = () => (
    <Card className="p-4 mt-4">
      <h3 className="font-bold">Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <>
          <p>Total Carbon Credits: {totalCarbonCredits.toFixed(4)}</p>
          <ul className="space-y-2">
            {transactions.map((tx, index) => (
              <li key={index} className="text-sm">
                <div>
                  <strong>{tx.factoryName}</strong>: {tx.energyAmount} kWh @ ${tx.pricePerKwh}/kWh = $
                  {tx.totalPrice}
                </div>
                <div>Status: {tx.status}</div>
                <div>Carbon Credits: {tx.carbonCredits?.toFixed(4)}</div>
                {tx.transactionId !== undefined && <div>ID: {tx.transactionId}</div>}
                {tx.transactionHash && (
                  <div>
                    Hash:{" "}
                    <a
                      href={`https://etherscan.io/tx/${tx.transactionHash}`}
                      target="_blank"
                      className="text-blue-500"
                    >
                      {tx.transactionHash.slice(0, 10)}...
                    </a>
                  </div>
                )}
                <div>Date: {new Date(tx.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );

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
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? (
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
                <TransactionHistory />
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
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}