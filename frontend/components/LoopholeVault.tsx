"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, ChevronDown, ChevronUp, AlertTriangle, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

interface LoopholeStrategy {
    title: string
    description: string
    impact: "High" | "Medium" | "Low"
    complexity: "Easy" | "Moderate" | "Complex"
    legal_status: string
    detailed_explanation: string
}

interface LoopholeVaultProps {
    jobId: string
}

export function LoopholeVault({ jobId }: LoopholeVaultProps) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [strategies, setStrategies] = useState<LoopholeStrategy[]>([])
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const handleUnlock = async () => {
        setIsLoading(true)
        try {
            const res = await api.post(`/analyze/loopholes/${jobId}`)
            setStrategies(res.data.strategies)
            setIsUnlocked(true)
            toast.success("Vault Unlocked! Insider strategies revealed.")
        } catch (error) {
            console.error(error)
            toast.error("Failed to unlock the vault. Try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full space-y-6">
            {!isUnlocked ? (
                <Card className="relative overflow-hidden border-2 border-dashed border-white/10 bg-black/40 p-12 text-center group hover:border-red-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <Lock className="w-10 h-10 text-white/40 group-hover:text-red-400 transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Unlock <span className="text-red-400">Insider Strategies</span>
                            </h2>
                            <p className="text-white/60 max-w-lg mx-auto">
                                Access "creative but legal" tax planning techniques tailored to your profile.
                                These are aggressive strategies used by high-net-worth individuals.
                            </p>
                        </div>

                        <Button
                            size="lg"
                            onClick={handleUnlock}
                            disabled={isLoading}
                            className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all hover:scale-105"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 animate-pulse" /> Cracking the Code...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Unlock className="w-5 h-5" /> Reveal Loopholes
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> 100% Legal • High Impact • Expert Level
                        </div>
                    </div>
                </Card>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Unlock className="w-6 h-6 text-red-500" />
                            Vault Unlocked
                            <span className="text-xs font-normal bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                                {strategies.length} Strategies Found
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {strategies.map((strategy, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full bg-black/40 border-white/10 hover:border-red-500/30 transition-all overflow-hidden flex flex-col">
                                    <div className="p-6 space-y-4 flex-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-xl font-bold text-white leading-tight">
                                                {strategy.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${strategy.impact === "High" ? "bg-green-500/20 text-green-400" :
                                                strategy.impact === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                                    "bg-blue-500/20 text-blue-400"
                                                }`}>
                                                {strategy.impact} Impact
                                            </span>
                                        </div>

                                        <p className="text-white/70 text-sm">
                                            {strategy.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/10">
                                                Complexity: <span className="text-white">{strategy.complexity}</span>
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/10">
                                                Status: <span className="text-white">{strategy.legal_status}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5">
                                        <button
                                            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                                            className="w-full px-6 py-3 flex items-center justify-between text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {expandedIndex === idx ? "Hide Details" : "Explain Strategy"}
                                            {expandedIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>

                                        <AnimatePresence>
                                            {expandedIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-white/5"
                                                >
                                                    <div className="p-6 text-sm text-white/80 leading-relaxed border-t border-white/5">
                                                        <div className="flex items-start gap-3 mb-4 text-yellow-400/80 bg-yellow-400/10 p-3 rounded-lg">
                                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                                            <p className="text-xs">
                                                                Disclaimer: This is an aggressive strategy. Ensure you have proper documentation.
                                                            </p>
                                                        </div>
                                                        <p className="whitespace-pre-wrap">{strategy.detailed_explanation}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
