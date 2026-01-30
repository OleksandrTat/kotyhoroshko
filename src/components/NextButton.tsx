'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  nextSceneId: number
}

export function NextButton({ nextSceneId }: Props) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    // Pequeña vibración si está disponible
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    router.push(`/scene/${nextSceneId}`)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group absolute bottom-8 right-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-amber-900/50 transition-all duration-300 hover:scale-105 hover:shadow-amber-900/70 active:scale-95 animate-fade-in-delayed border border-amber-400/30"
      style={{ fontFamily: "'Philosopher', sans-serif" }}
    >
      <span className="relative z-10">Далі</span>
      
      <svg 
        className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>

      {/* Efecto de brillo al hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Pulso sutil */}
      <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping-slow"></div>
    </button>
  )
}