"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Upload, Check, User, FileText, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [regime, setRegime] = useState<"Old" | "New" | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingMsg, setLoadingMsg] = useState("")

    const uploadMessages = [
        "Analyzing document structure...",
        "Extracting salary components...",
        "Identifying tax regime...",
        "Calculating potential deductions...",
        "Preparing your personalized agent..."
    ]

    const skipMessages = [
        "Initializing secure session...",
        "Setting up your profile...",
        "Configuring tax rules...",
        "Preparing your personalized agent..."
    ]

    const handleNext = () => {
        if (step === 1 && !name) return toast.error("Please enter your name")
        if (step === 2 && !regime) return toast.error("Please select a tax regime")
        setStep(step + 1)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // Select message set
        const messages = file ? uploadMessages : skipMessages

        // Rotate messages
        let msgIdx = 0
        setLoadingMsg(messages[0])
        const interval = setInterval(() => {
            msgIdx = (msgIdx + 1) % messages.length
            setLoadingMsg(messages[msgIdx])
        }, 1500)

        const formData = new FormData()
        formData.append("name", name)
        formData.append("tax_regime", regime || "New")

        if (file) {
            formData.append("file", file)
        }

        try {
            const res = await api.post("/upload", formData)
            const jobId = res.data.job_id
            clearInterval(interval)
            setLoadingMsg("Done! Redirecting...")
            toast.success("Profile created! Redirecting...")
            router.push(`/consult/${jobId}`)
        } catch (error) {
            console.error(error)
            clearInterval(interval)
            toast.error("Something went wrong. Please try again.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />

            <div className="w-full max-w-2xl relative z-10">
                {/* Progress Bar */}
                <div className="flex justify-between mb-12 px-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= s ? "bg-white text-black border-white" : "bg-transparent text-white/30 border-white/20"
                                }`}>
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            <span className={`text-xs font-medium transition-colors duration-500 ${step >= s ? "text-white" : "text-white/30"
                                }`}>
                                {s === 1 ? "Identity" : s === 2 ? "Regime" : "Documents"}
                            </span>
                        </div>
                    ))}
                    {/* Connecting Lines */}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10 -z-10" />
                    <div
                        className="absolute top-5 left-0 h-[2px] bg-white transition-all duration-500 -z-10"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 text-center"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TaxNova</span>
                                </h1>
                                <p className="text-xl text-white/60">
                                    Let's start with your name.
                                </p>
                            </div>

                            <div className="relative max-w-md mx-auto group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                <Input
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                    placeholder="Enter your full name"
                                    className="h-16 pl-12 text-lg bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <Button
                                size="lg"
                                onClick={handleNext}
                                className="h-14 px-8 rounded-full text-lg bg-white text-black hover:bg-white/90 hover:scale-105 transition-all"
                            >
                                Continue <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 text-center"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    Which Tax Regime?
                                </h2>
                                <p className="text-lg text-white/60">
                                    Select your current preference. We can help you switch later!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div
                                    onClick={() => setRegime("Old")}
                                    className={`p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${regime === "Old"
                                            ? "border-blue-500 bg-blue-500/10 scale-105 shadow-xl shadow-blue-500/20"
                                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                        }`}
                                >
                                    <Shield className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                                    <h3 className="text-xl font-bold text-white mb-2">Old Regime</h3>
                                    <p className="text-sm text-white/50">
                                        Avail deductions like HRA, 80C, 80D. Better for high investments.
                                    </p>
                                </div>

                                <div
                                    onClick={() => setRegime("New")}
                                    className={`p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${regime === "New"
                                            ? "border-purple-500 bg-purple-500/10 scale-105 shadow-xl shadow-purple-500/20"
                                            : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                        }`}
                                >
                                    <FileText className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
                                    <h3 className="text-xl font-bold text-white mb-2">New Regime</h3>
                                    <p className="text-sm text-white/50">
                                        Lower tax rates, fewer deductions. Simpler and often better for lower income.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-white/60">
                                    Back
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    className="h-14 px-8 rounded-full text-lg bg-white text-black hover:bg-white/90 hover:scale-105 transition-all"
                                >
                                    Continue <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 text-center"
                        >
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    Upload Documents
                                </h2>
                                <p className="text-lg text-white/60">
                                    Upload your Form 16 or Salary Slip for instant analysis.
                                </p>
                            </div>

                            <div className="max-w-xl mx-auto">
                                <div className="border-2 border-dashed border-white/20 rounded-3xl p-12 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white">
                                            {file ? <Check className="w-8 h-8 text-green-400" /> : <Upload className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                {file ? file.name : "Click to Upload PDF"}
                                            </h3>
                                            <p className="text-white/40 mt-2">
                                                {file ? "File selected" : "Drag & drop or click to browse"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 pt-4">
                                <div className="flex gap-4 justify-center">
                                    <Button variant="ghost" onClick={() => setStep(2)} className="text-white/60">
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="h-14 px-12 rounded-full text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-500/25 min-w-[200px]"
                                    >
                                        {isSubmitting ? "Processing..." : (file ? "Start Analysis" : "Skip & Start Chat")}
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {isSubmitting && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-white/60 text-sm animate-pulse"
                                        >
                                            {loadingMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
