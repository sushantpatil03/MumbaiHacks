"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Bot, User, X } from "lucide-react"
import { useSME } from "@/components/sme/SMEContext"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: string[]
}

export default function ChatInterface() {
  const { isChatLoading, setChatLoading, updateSavings } = useSME()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your SME Tax Assistant. I can help you find missed deductions and match your GST ITC. Please upload your documents or ask me a question.",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      attachments: selectedFiles.map(f => f.name)
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    setChatLoading(true)

    try {
      const formData = new FormData()
      formData.append("message", inputValue)
      formData.append("session_id", sessionId)
      selectedFiles.forEach(file => {
        formData.append("files", file)
      })

      // Clear files after sending
      setSelectedFiles([])

      const response = await fetch("http://127.0.0.1:8000/sme/chat/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, responseMessage])

      if (data.savings_update) {
        updateSavings(data.savings_update)
      }

    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/5 border-r border-white/10">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          AI Assistant
        </h2>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-2",
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white/10 text-white/90 rounded-bl-none border border-white/10"
                )}
              >
                <div>{message.content}</div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {message.attachments.map((name, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs bg-black/20 px-2 py-1 rounded-md">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl px-4 py-3 rounded-bl-none border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm space-y-3">
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm text-white/80 border border-white/10">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => removeFile(index)} className="hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-500"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
