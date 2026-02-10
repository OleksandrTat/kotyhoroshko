'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SceneTransition } from '@/components/SceneTransition'

type Props = {
  children: React.ReactNode
}

type TextSize = 'normal' | 'large' | 'xlarge'

export function SceneContainer({ children }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>('normal')
  const [readingMode, setReadingMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedSize = window.localStorage.getItem('story-text-size')
    if (storedSize === 'normal' || storedSize === 'large' || storedSize === 'xlarge') {
      setTextSize(storedSize)
    }
    const storedReading = window.localStorage.getItem('story-reading-mode')
    if (storedReading === 'true') {
      setReadingMode(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('story-text-size', textSize)
  }, [textSize])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('story-reading-mode', String(readingMode))
  }, [readingMode])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div
      data-text-size={textSize}
      data-reading={readingMode ? 'on' : 'off'}
      className={`relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-black transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
      {readingMode ? (
        <div className="absolute inset-0 z-25 pointer-events-none bg-black/35 backdrop-blur-[1px] transition-opacity duration-500"></div>
      ) : null}
      <SceneTransition />

      {/* Top navigation controls */}
      <div className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] right-[calc(1.5rem+env(safe-area-inset-right))] flex gap-3 z-50">
        <Link
          href="/"
          className="w-14 h-14 rounded-full bg-[#2a170b]/80 backdrop-blur-md border-2 border-[#f2d4a4]/20 flex items-center justify-center text-[#f7efe4]/80 hover:text-[#fff1d8] hover:bg-[#2a170b]/95 hover:border-[#f9e1b5]/50 transition-all duration-300 hover:scale-110 shadow-lg group"
          title="Inicio"
          aria-label="Volver al inicio"
        >
          <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-14 h-14 rounded-full bg-[#2a170b]/80 backdrop-blur-md border-2 border-[#f2d4a4]/20 flex items-center justify-center text-[#f7efe4]/80 hover:text-[#fff1d8] hover:bg-[#2a170b]/95 hover:border-[#f9e1b5]/50 transition-all duration-300 hover:scale-110 shadow-lg group"
          title="Ajustes"
          aria-expanded={menuOpen}
          aria-controls="scene-settings"
          aria-label="Abrir ajustes de lectura"
          type="button"
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

      <div
        id="scene-settings"
        aria-hidden={!menuOpen}
        className={`absolute top-[calc(4.75rem+env(safe-area-inset-top))] right-[calc(1.5rem+env(safe-area-inset-right))] w-[22rem] rounded-2xl bg-gradient-to-br from-[#2a170b]/98 via-[#1f1209]/98 to-[#2a170b]/98 backdrop-blur-2xl border-2 border-[#f2d4a4]/20 shadow-2xl shadow-black/60 transition-all duration-300 z-[70] ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-6 space-y-5">
          <h3 className="text-xl font-bold text-[#f7efe4] flex items-center gap-2" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Ajustes de lectura
          </h3>

          <div className="space-y-4 text-sm text-[#f2d4a4]/80" style={{ fontFamily: "'Philosopher', sans-serif" }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[#f7efe4]/90 font-medium">Modo lectura</p>
                <p className="text-xs text-[#f2d4a4]/70">Atenúa el fondo y mejora la concentración.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={readingMode}
                onClick={() => setReadingMode(!readingMode)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${readingMode ? 'bg-[#f4bc55]' : 'bg-[#3b2412]'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-[#fff1d8] shadow-md transition-transform duration-300 ${
                    readingMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#f2d4a4]/60">Tamaño de texto</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {([
                  { id: 'normal', label: 'A' },
                  { id: 'large', label: 'A+' },
                  { id: 'xlarge', label: 'A++' },
                ] as const).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTextSize(option.id)}
                    aria-pressed={textSize === option.id}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      textSize === option.id
                        ? 'border-[#f9e1b5]/70 bg-[#3b2412]/60 text-[#fff1d8] shadow-lg shadow-black/30'
                        : 'border-[#f2d4a4]/20 bg-[#2a170b]/40 text-[#f2d4a4]/80 hover:border-[#f2d4a4]/50 hover:text-[#fff1d8]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#f2d4a4]/60">
              <span>Atajos:</span>
              <span className="rounded-md bg-[#2a170b]/70 px-2 py-1 text-[#fff1d8]">→</span>
              <span className="rounded-md bg-[#2a170b]/70 px-2 py-1 text-[#fff1d8]">Enter</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-[#3b2412]/30 hover:bg-[#3b2412]/45 text-[#f7efe4] hover:text-[#fff1d8] transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 border border-[#f2d4a4]/25"
              style={{ fontFamily: "'Philosopher', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Cerrar ajustes"
          className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
          onClick={() => setMenuOpen(false)}
        ></button>
      ) : null}

      <div
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-[#f2d4a4]/30 border-t-[#fbe9c9] animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-[#f2d4a4]/20 border-b-[#f2d4a4] animate-spin-reverse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
