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
      className="group absolute bottom-10 right-10 z-30 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-amber-900/60 transition-all duration-500 hover:scale-110 hover:shadow-amber-900/80 active:scale-95 border-2 border-amber-400/40 overflow-hidden bg-[length:200%_100%] hover:bg-[position:100%_0]"
      style={{ fontFamily: "'Philosopher', sans-serif" }}
      aria-label="Перейти до наступної сцени"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-300/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <span className="relative z-10 drop-shadow-lg">Далі</span>
      
      <svg 
        className={`w-6 h-6 relative z-10 transition-all duration-300 drop-shadow-lg ${
          isHovered ? 'translate-x-2 scale-110' : ''
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={3} 
          d="M13 7l5 5m0 0l-5 5m5-5H6" 
        />
      </svg>

      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-2xl bg-amber-400/30 animate-ping-slow"></div>
    </button>
  )
}