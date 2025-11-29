"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, IndianRupee } from "lucide-react"

interface SavingsBannerProps {
    beforeTax: number
    afterTax: number
    savings: number
}

export function SavingsBanner({ beforeTax, afterTax, savings }: SavingsBannerProps) {
    if (savings <= 0) return null

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="glass-panel bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 rounded-full p-2 pr-6 shadow-2xl backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-green-500 text-white p-3 rounded-full shadow-lg shadow-green-500/30">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-green-300 font-medium uppercase tracking-wider">Total Savings Unlocked</p>
                        <p className="text-2xl font-bold text-white">₹{savings.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8 hidden md:flex">
                    <div className="text-right">
                        <p className="text-xs text-white/40">Original Tax</p>
                        <p className="text-white/80 line-through">₹{beforeTax.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="text-white/20" />
                    <div className="text-right">
                        <p className="text-xs text-white/40">New Tax</p>
                        <p className="text-white font-semibold">₹{afterTax.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
