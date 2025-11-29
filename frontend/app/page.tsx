import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-white/80 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          AI-Powered Tax Optimization
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white">
          TaxNova <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Agent</span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Your personal AI Chartered Accountant. Upload your documents, chat with our agent, and discover hidden tax savings in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/onboarding">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10 transition-all hover:scale-105">
              Start Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full glass-button border-white/20 text-white hover:bg-white/10">
            View Demo Personas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          {[
            { icon: FileText, title: "Instant Analysis", desc: "Upload Form 16 or Salary Slips for instant parsing." },
            { icon: Zap, title: "Smart Detection", desc: "AI identifies missed HRA, 80C, and 80D opportunities." },
            { icon: ShieldCheck, title: "Verified Plan", desc: "Get a downloadable PDF plan ready for filing." },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 text-blue-300">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
