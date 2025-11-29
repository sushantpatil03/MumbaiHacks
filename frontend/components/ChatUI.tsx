"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ChatMessage {
    role: "user" | "agent"
    content: string
}

interface ChatUIProps {
    jobId: string
    initialHistory?: { user: string; agent: string }[]
    onUpdate: () => void
}

export function ChatUI({ jobId, initialHistory = [], onUpdate }: ChatUIProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(
        initialHistory.flatMap((h) => [
            { role: "user", content: h.user },
            { role: "agent", content: h.agent },
        ])
    )
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            toast.success("File selected: " + e.target.files[0].name)
        }
    }

    const sendMessage = async () => {
        if ((!input.trim() && !selectedFile) || isLoading) return

        const userMsg = input
        setMessages((prev) => [...prev, { role: "user", content: userMsg + (selectedFile ? ` [Attached: ${selectedFile.name}]` : "") }])
        setInput("")
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append("job_id", jobId)
            formData.append("user_message", userMsg)
            if (selectedFile) {
                formData.append("file", selectedFile)
            }

            const res = await api.post("/chat", formData)

            setMessages((prev) => [...prev, { role: "agent", content: res.data.agent_reply }])

            if (res.data.agent_reply.includes("analyzing")) {
                toast("Agent is analyzing your data...", { icon: "🤔" })
            }

            setSelectedFile(null)
            onUpdate()
        } catch (error) {
            console.error(error)
            toast.error("Failed to send message")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col glass-card">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">TaxNova Agent</h3>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Online • Orchestrator Mode
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages
                        .filter(msg => !(msg.role === "user" && !msg.content)) // Hide empty user messages (system triggers)
                        .map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-3 max-w-[80%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === "user" ? "bg-purple-500/20" : "bg-blue-500/20"
                                    )}
                                >
                                    {msg.role === "user" ? (
                                        <User className="w-4 h-4 text-purple-400" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-blue-400" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "p-3 rounded-2xl text-sm",
                                        msg.role === "user"
                                            ? "bg-purple-500/20 text-white rounded-tr-none"
                                            : "bg-white/5 text-white/90 rounded-tl-none border border-white/10"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-xs text-white/60">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10 bg-black/20">
                {selectedFile && (
                    <div className="mb-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 inline-flex items-center gap-2">
                        <Paperclip className="w-3 h-3" />
                        {selectedFile.name}
                        <button onClick={() => setSelectedFile(null)} className="hover:text-red-400">×</button>
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="chat-upload"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => document.getElementById("chat-upload")?.click()}
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="glass-input bg-white/5 border-white/10 focus:bg-white/10"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isLoading || (!input.trim() && !selectedFile)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
