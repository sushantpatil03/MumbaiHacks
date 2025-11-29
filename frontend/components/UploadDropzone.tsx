"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function UploadDropzone() {
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleUpload(files[0])
        }
    }

    const handleUpload = async (file: File) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await api.post("/upload", formData)
            toast.success("Document parsed successfully!")
            router.push(`/consult/${res.data.job_id}`)
        } catch (error) {
            toast.error("Upload failed. Please try again.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSample = async (sampleName: string) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("use_sample", "true")
        formData.append("sample_name", sampleName)

        try {
            const res = await api.post("/upload", formData)
            toast.success(`Loaded sample: ${sampleName}`)
            router.push(`/consult/${res.data.job_id}`)
        } catch (error) {
            toast.error("Failed to load sample.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer glass-card",
                    isDragging
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-white/20 hover:border-white/40 hover:bg-white/5"
                )}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/20 text-primary">
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                            {isLoading ? "Analyzing Document..." : "Upload your Form 16 or Salary Slip"}
                        </h3>
                        <p className="text-white/60">
                            Drag and drop your PDF here, or click to browse
                        </p>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
            </div>

            <div className="text-center space-y-4">
                <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
                    Or try with a persona
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        className="glass-button border-white/10 hover:bg-white/10 text-white"
                        onClick={() => handleSample("sample_salary_rajesh")}
                        disabled={isLoading}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Rajesh (IT Professional)
                    </Button>
                    <Button
                        variant="outline"
                        className="glass-button border-white/10 hover:bg-white/10 text-white"
                        onClick={() => handleSample("sample_salary_priya")}
                        disabled={isLoading}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Priya (Marketing)
                    </Button>
                </div>
            </div>
        </div>
    )
}
