'use client'

import { useState } from 'react'

export function SceneControls() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  return (
    <>
      {/* Botón de menú */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-800/90 transition-all duration-300 hover:scale-110"
        title="Налаштування"
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Panel de control */}
      <div className={`absolute top-20 right-6 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-amber-300 mb-4" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            Налаштування
          </h3>

          {/* Control de sonido */}
          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontFamily: "'Philosopher', sans-serif" }}>Звук</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${soundEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Auto-play */}
          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontFamily: "'Philosopher', sans-serif" }}>Авто-перехід</span>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${autoPlay ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${autoPlay ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button className="w-full py-2 px-4 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors duration-300 text-sm"
                    style={{ fontFamily: "'Philosopher', sans-serif" }}>
              Повернутись на початок
            </button>
          </div>
        </div>
      </div>
    </>
  )
}