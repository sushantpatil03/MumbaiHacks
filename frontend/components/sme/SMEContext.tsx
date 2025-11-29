"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SavingsData {
  missedDeductions: number
  gstItcMissed: number
  details: any[]
}

interface SMEContextType {
  savings: SavingsData
  updateSavings: (data: Partial<SavingsData>) => void
  isChatLoading: boolean
  setChatLoading: (loading: boolean) => void
}

const SMEContext = createContext<SMEContextType | undefined>(undefined)

export function SMEProvider({ children }: { children: ReactNode }) {
  const [savings, setSavings] = useState<SavingsData>({
    missedDeductions: 0,
    gstItcMissed: 0,
    details: []
  })
  const [isChatLoading, setChatLoading] = useState(false)

  const updateSavings = (data: Partial<SavingsData>) => {
    setSavings(prev => ({ ...prev, ...data }))
  }

  return (
    <SMEContext.Provider value={{ savings, updateSavings, isChatLoading, setChatLoading }}>
      {children}
    </SMEContext.Provider>
  )
}

export function useSME() {
  const context = useContext(SMEContext)
  if (context === undefined) {
    throw new Error('useSME must be used within a SMEProvider')
  }
  return context
}
