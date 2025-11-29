"use client"

import { useSME } from "@/components/sme/SMEContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SavingsDisplay() {
  const { savings } = useSME()

  return (
    <div className="h-full p-6 overflow-y-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Tax Savings Analysis</h2>
        <p className="text-white/60">Real-time insights based on your documents.</p>
      </div>

      {/* Total Savings Card */}
      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Total Potential Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">
            ₹ {(savings.missedDeductions + savings.gstItcMissed).toLocaleString('en-IN')}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missed Deductions */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Missed Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹ {savings.missedDeductions.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-white/40 mt-1">Business expenses not claimed</p>
          </CardContent>
        </Card>

        {/* GST ITC Missed */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> GST ITC Missed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹ {savings.gstItcMissed.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-white/40 mt-1">Unclaimed Input Tax Credit</p>
          </CardContent>
        </Card>
      </div>

      {/* Details List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Detailed Breakdown</h3>
        {savings.details.length === 0 ? (
          <div className="text-center py-8 text-white/40 border border-dashed border-white/10 rounded-xl">
            No data available yet. Upload documents to start analysis.
          </div>
        ) : (
          <div className="space-y-3">
            {savings.details.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{item.category}</div>
                  <div className="text-sm text-white/50">{item.description}</div>
                </div>
                <div className="text-green-400 font-bold">
                  + ₹ {item.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
