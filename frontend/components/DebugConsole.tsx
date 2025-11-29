"use client"

import { Card } from "@/components/ui/card"
import { Terminal } from "lucide-react"

interface DebugConsoleProps {
    data: any
}

export function DebugConsole({ data }: DebugConsoleProps) {
    return (
        <Card className="glass-card p-0 overflow-hidden border-white/10 bg-black/40">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <Terminal className="w-4 h-4 text-green-400" />
                <h3 className="text-xs font-mono font-bold text-white/70 uppercase tracking-wider">
                    Live Agent State
                </h3>
                <div className="ml-auto flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>
            <div className="p-4 overflow-x-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <pre className="text-[10px] md:text-xs font-mono text-green-400/90 leading-relaxed">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </Card>
    )
}
