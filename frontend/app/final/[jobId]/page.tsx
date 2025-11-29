"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function FinalPage() {
    const params = useParams()
    const jobId = params.jobId as string

    const handleDownload = async () => {
        window.open(`http://localhost:8000/api/download/plan/${jobId}`, '_blank')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Plan Ready!</h1>
                    <p className="text-white/60">Your optimized tax plan has been generated.</p>
                </div>

                <Card className="glass-card p-8 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Next Steps</h3>
                        <div className="space-y-3">
                            {[
                                "Download your detailed PDF plan",
                                "Submit rent receipts to your HR portal",
                                "Complete pending 80C investments",
                                "Purchase health insurance if recommended"
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                                        {i + 1}
                                    </div>
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Button size="lg" className="w-full bg-white text-black hover:bg-white/90" onClick={handleDownload}>
                            <Download className="mr-2 w-4 h-4" /> Download PDF Plan
                        </Button>
                        <Link href="/">
                            <Button variant="ghost" className="w-full text-white/50 hover:text-white">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Start New Consultation
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
