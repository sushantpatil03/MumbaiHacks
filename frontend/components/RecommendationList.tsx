"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface Recommendation {
    id: string
    title: string
    description: string
    category: string
    potential_savings: number
    action_type: string
    feasibility?: string // Optional now as it might not be in new schema, but keeping for safety
}

interface RecommendationListProps {
    jobId: string
    recommendations: Recommendation[]
    onApply: (recs: string[]) => void
}

export function RecommendationList({ jobId, recommendations, onApply }: RecommendationListProps) {
    const [selected, setSelected] = useState<string[]>([])
    const [isApplying, setIsApplying] = useState(false)

    const toggleRec = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const handleApply = async () => {
        setIsApplying(true)
        try {
            await onApply(selected)
            toast.success("Recommendations applied!")
        } catch (error) {
            toast.error("Failed to apply recommendations")
        } finally {
            setIsApplying(false)
        }
    }

    if (!recommendations || recommendations.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Recommended Actions
                </h2>
                {selected.length > 0 && (
                    <Button onClick={handleApply} disabled={isApplying} className="glass-button">
                        {isApplying ? "Calculating..." : `Apply (${selected.length})`}
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {recommendations.map((rec) => {
                    const isSelected = selected.includes(rec.id)
                    return (
                        <div
                            key={rec.id}
                            onClick={() => toggleRec(rec.id)}
                            className={cn(
                                "relative group cursor-pointer transition-all duration-300 rounded-2xl border p-4",
                                isSelected
                                    ? "bg-green-500/10 border-green-500/50"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">{rec.title}</h3>
                                        <Badge variant="secondary" className="bg-white/10 text-white/80 text-[10px]">
                                            {rec.action_type || "Action"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-white/60">{rec.description}</p>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="text-green-400 font-medium">Potential Savings: ₹{rec.potential_savings?.toLocaleString() || 0}</span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                    isSelected ? "bg-green-500 border-green-500 text-white" : "border-white/30 text-transparent"
                                )}>
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
