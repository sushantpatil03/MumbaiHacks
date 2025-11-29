"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ChatUI } from "@/components/ChatUI"
import { ObservationsGrid } from "@/components/ObservationsGrid"
import { RecommendationList } from "@/components/RecommendationList"
import { SavingsBanner } from "@/components/SavingsBanner"
import { AgentCards } from "@/components/AgentCards"
import { DebugConsole } from "@/components/DebugConsole"
import { LoopholeVault } from "@/components/LoopholeVault"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { api } from "@/lib/api"
import { FileDown } from "lucide-react"
import Link from "next/link"

export default function ConsultPage() {
    const params = useParams()
    const jobId = params.jobId as string
    const [profile, setProfile] = useState<any>(null)
    const [observations, setObservations] = useState<any[]>([])
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [savingsData, setSavingsData] = useState<any>(null)

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/profile/${jobId}`)
            setProfile(res.data)
        } catch (e) {
            console.error(e)
        }
    }

    const fetchObservations = async () => {
        try {
            const res = await api.get(`/observations/${jobId}`)
            setObservations(res.data.observations)
            setRecommendations(res.data.recommendations)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchProfile()
        // Poll for observations every 5s if chat is active
        const interval = setInterval(fetchObservations, 5000)
        return () => clearInterval(interval)
    }, [jobId])

    const handleApplyRecs = async (recIds: string[]) => {
        try {
            const res = await api.post(`/apply_recommendations/${jobId}`, {
                recommendation_ids: recIds
            })
            setSavingsData(res.data)
        } catch (e) {
            console.error(e)
        }
    }

    if (!profile) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>

    return (
        <div className="min-h-screen p-6 pb-32">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tax Consultation</h1>
                        <p className="text-white/50">Job ID: {jobId.slice(0, 8)}...</p>
                    </div>
                    <Link href={`/final/${jobId}`}>
                        <Button variant="outline" className="glass-button">
                            View Final Plan <FileDown className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </header>

                <AgentCards jobId={jobId} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Chat */}
                    <div className="lg:col-span-5 space-y-6">
                        <ChatUI
                            jobId={jobId}
                            initialHistory={profile.chat_history}
                            onUpdate={() => {
                                fetchProfile()
                                fetchObservations()
                            }}
                        />

                        <DebugConsole data={profile} />
                    </div>

                    {/* Right Column: Insights */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Only show analysis if available */}
                        {observations.length > 0 ? (
                            <>
                                <ObservationsGrid observations={observations} />
                                <RecommendationList
                                    jobId={jobId}
                                    recommendations={recommendations}
                                    onApply={handleApplyRecs}
                                />
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 glass-panel text-center space-y-4 min-h-[400px]">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                    <span className="text-4xl">🤖</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white">AI Agent Active</h3>
                                <p className="text-white/60 max-w-md">
                                    I'm analyzing your inputs in real-time. Please continue the conversation to help me build your tax profile.
                                    <br /><br />
                                    Once I have enough data, I'll reveal your personalized tax saving opportunities here!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loophole Vault Section */}
                <div className="pt-8 border-t border-white/10">
                    <LoopholeVault jobId={jobId} />
                </div>
            </div>

            {savingsData && (
                <SavingsBanner
                    beforeTax={savingsData.before_tax}
                    afterTax={savingsData.after_tax}
                    savings={savingsData.savings}
                />
            )}
        </div>
    )
}
