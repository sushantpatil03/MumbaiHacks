"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-black">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TaxNova</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Choose how you would like to proceed with your tax optimization journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Salaried Individual Card */}
          <Link href="/upload" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl text-white">Salaried Individual</CardTitle>
                  <CardDescription className="text-white/60 text-base">
                    Perfect for employees with Form 16, salary slips, and investments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Upload Form 16 / Salary Slips
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Optimize HRA, 80C, 80D
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Get personalized tax saving plan
                    </li>
                  </ul>
                  <div className="pt-4 flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* SME / Business Owner Card */}
          <Link href="/sme/dashboard" className="group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl text-white">SME / Business Owner</CardTitle>
                  <CardDescription className="text-white/60 text-base">
                    Designed for small businesses, freelancers, and GST filers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Find Missed Business Deductions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Match GST ITC (GSTR-2B vs Purchase)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Real-time AI Consultation
                    </li>
                  </ul>
                  <div className="pt-4 flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}
