"use client"

import { SMEProvider } from "@/components/sme/SMEContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SMELayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SMEProvider>
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center px-6 bg-white/5 backdrop-blur-md z-10">
          <Link href="/welcome" className="mr-4 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
              TN
            </div>
            <span className="font-semibold text-lg">TaxNova <span className="text-purple-400">SME</span></span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-white/60">
              AI-Powered Business Tax Optimization
            </div>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              Help
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
           {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
          </div>
          {children}
        </main>
      </div>
    </SMEProvider>
  )
}
