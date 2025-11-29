"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle2, Circle } from "lucide-react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface AgentStatus {
    status: "idle" | "active" | "completed"
    output: string
}

export function AgentCards({ jobId }: { jobId: string }) {
    const [agents, setAgents] = useState<Record<string, AgentStatus>>({})

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get(`/agents/status/${jobId}`)
                setAgents(res.data)
            } catch (e) {
                console.error(e)
            }
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 2000)
        return () => clearInterval(interval)
    }, [jobId])

    const agentList = [
        { id: "parser", name: "Parser", icon: "📄" },
        { id: "interview", name: "Interviewer", icon: "💬" },
        { id: "observation", name: "Analyst", icon: "🔍" },
        { id: "optimizer", name: "Optimizer", icon: "⚡" },
        { id: "report", name: "Reporter", icon: "📝" },
    ]

    return (
        <div className="grid grid-cols-5 gap-2 mb-8">
            {agentList.map((agent) => {
                const status = agents[agent.id]?.status || "idle"
                const output = agents[agent.id]?.output || "Waiting..."

                return (
                    <div
                        key={agent.id}
                        className={cn(
                            "rounded-xl p-3 border transition-all duration-300",
                            status === "active" ? "bg-primary/20 border-primary shadow-lg shadow-primary/10 scale-105" :
                                status === "completed" ? "bg-green-500/10 border-green-500/30" :
                                    "bg-white/5 border-white/5 opacity-60"
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{agent.icon}</span>
                            {status === "active" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                            {status === "completed" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                            {status === "idle" && <Circle className="w-3 h-3 text-white/20" />}
                        </div>
                        <p className="text-xs font-medium text-white mb-0.5">{agent.name}</p>
                        <p className="text-[10px] text-white/50 truncate">{output}</p>
                    </div>
                )
            })}
        </div>
    )
}
