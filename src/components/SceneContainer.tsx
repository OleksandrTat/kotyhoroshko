'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
}

export function SceneContainer({ children }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden bg-black transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
      
      {/* Top navigation controls */}
      <div className="absolute top-8 right-8 flex gap-3 z-50">
        {/* Home button */}
        <Link
          href="/"
          className="w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-slate-800/95 hover:border-amber-400/40 transition-all duration-300 hover:scale-110 shadow-lg group"
          title="На головну"
        >
          <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>

        {/* Settings button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-slate-800/95 hover:border-amber-400/40 transition-all duration-300 hover:scale-110 shadow-lg group"
          title="Налаштування"
        >
          <svg 
            className={`w-6 h-6 transition-all duration-300 group-hover:scale-110 ${menuOpen ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings panel */}
      <div 
        className={`absolute top-24 right-8 w-80 rounded-2xl bg-gradient-to-br from-slate-900/98 via-purple-950/98 to-slate-900/98 backdrop-blur-2xl border-2 border-amber-400/20 shadow-2xl shadow-black/60 transition-all duration-300 z-50 ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Налаштування
          </h3>

          <div className="space-y-3 text-sm text-white/70" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            <p>Звукові ефекти та додаткові налаштування будуть доступні скоро.</p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 border border-red-500/20"
              style={{ fontFamily: "'Philosopher', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Повернутись на початок
            </Link>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      <div 
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-orange-500/20 border-b-orange-500 animate-spin-reverse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}