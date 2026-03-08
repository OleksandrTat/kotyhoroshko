'use client'

import { useState } from 'react'

export function SceneControls() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  return (
    <>
      <button
        onClick={() => setMenuOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white/70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-slate-800/90 hover:text-white"
        title="Ajustes"
      >
        <svg
          className={`h-6 w-6 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
      </button>

      <div className={`absolute right-6 top-20 w-72 rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ${menuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}>
        <div className="space-y-4 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-200" style={{ fontFamily: 'var(--font-body)' }}>
            Ajustes
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontFamily: 'var(--font-body)' }}>
              Sonido
            </span>
            <button
              onClick={() => setSoundEnabled((value) => !value)}
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${soundEnabled ? 'bg-slate-400' : 'bg-slate-700'}`}
            >
              <div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/80" style={{ fontFamily: 'var(--font-body)' }}>
              Reproducción automática
            </span>
            <button
              onClick={() => setAutoPlay((value) => !value)}
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${autoPlay ? 'bg-slate-400' : 'bg-slate-700'}`}
            >
              <div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${autoPlay ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <button
              className="w-full rounded-lg bg-slate-700/20 px-4 py-2 text-sm text-slate-200 transition-colors duration-300 hover:bg-slate-700/30"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
