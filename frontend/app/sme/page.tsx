"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Calculator } from 'lucide-react';

export default function SMEPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 tracking-tight"
        >
          SME Tax Assistant
        </motion.h1>
        <p className="text-lg text-gray-600">
          Select a tool to optimize your tax filing and savings.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Feature 1: Deduction Finder */}
          <Link href="/sme/deductions">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Missed Deduction Finder</h2>
              <p className="text-gray-500 mb-6">
                Analyze bank statements and expenses to find hidden tax deductions you might have missed.
              </p>
              <div className="mt-auto flex items-center text-blue-600 font-medium">
                Start Analysis <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          </Link>

          {/* Feature 2: GST Matcher */}
          <Link href="/sme/gst">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer h-full flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">GST ITC Auto Matcher</h2>
              <p className="text-gray-500 mb-6">
                Match your purchase register with GSTR-2B to identify missing Input Tax Credit.
              </p>
              <div className="mt-auto flex items-center text-purple-600 font-medium">
                Start Matching <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
