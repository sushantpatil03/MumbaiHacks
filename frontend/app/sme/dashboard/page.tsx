"use client"

import ChatInterface from "@/components/sme/ChatInterface"
import SavingsDisplay from "@/components/sme/SavingsDisplay"

export default function SMEDashboard() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Side: Chat Interface */}
      <div className="w-1/2 h-full">
        <ChatInterface />
      </div>

      {/* Right Side: Savings Display */}
      <div className="w-1/2 h-full bg-black/50">
        <SavingsDisplay />
      </div>
    </div>
  )
}
