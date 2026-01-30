'use client'

import { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

export function SceneContainer({ children }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true)
  }, [])

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {children}
      
      {/* Controles de accesibilidad - esquina superior derecha */}
      <div className="absolute top-6 right-6 flex gap-2 z-50">
        {/* Botón de menú */}
        <button
          className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-800/90 transition-all duration-300 hover:scale-110"
          title="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay de carga suave */}
      <div className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}></div>
    </div>
  )
}