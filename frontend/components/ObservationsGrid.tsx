"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface Observation {
    title: string
    description: string
    impact: "HIGH" | "MEDIUM" | "LOW"
}

export function ObservationsGrid({ observations }: { observations: Observation[] }) {
    if (!observations || observations.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Key Observations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {observations.map((obs, i) => (
                    <Card key={i} className="glass-card border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-white">{obs.title}</CardTitle>
                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                                    {obs.impact} IMPACT
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-white/70">{obs.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
