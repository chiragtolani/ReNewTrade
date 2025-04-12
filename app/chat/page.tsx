import { AIChat } from "@/components/AIChat"

export default function ChatPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        AI Energy Trading Assistant
      </h1>
      <AIChat />
    </main>
  )
} 