'use client'

import { useEffect, useState } from 'react'

export function SceneTransition() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black animate-fade-out">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Spinner ornamental */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-amber-400/10 border-b-amber-400 animate-spin-reverse"></div>
            
            {/* Centro decorativo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse-slow shadow-lg shadow-amber-500/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}