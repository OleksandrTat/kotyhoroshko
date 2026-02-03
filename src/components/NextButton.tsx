'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  nextSceneId: number
}

export function NextButton({ nextSceneId }: Props) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleClick = () => {
    if (isExiting) return
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    setIsExiting(true)
    setTimeout(() => {
      router.push(`/scene/${nextSceneId}`)
    }, 520)
  }

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group absolute bottom-10 right-10 z-30 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d29a5e] via-[#e6b87a] to-[#d29a5e] px-10 py-5 text-xl font-bold text-[#2a170b] shadow-2xl shadow-black/50 transition-all duration-500 hover:scale-110 active:scale-95 border border-white/20 overflow-hidden"
        style={{ fontFamily: "'Philosopher', sans-serif" }}
        aria-label="Ir a la siguiente escena"
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)] translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-900"></div>

        <span className="relative z-10 drop-shadow">Continuar</span>

        <svg
          className={`w-6 h-6 relative z-10 transition-all duration-300 drop-shadow ${
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

        <div className="absolute inset-[3px] rounded-[14px] border border-white/15 pointer-events-none"></div>
      </button>

      {isExiting ? (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(44,28,16,0.95),rgba(12,8,5,0.98))] animate-veil-in"></div>
        </div>
      ) : null}
    </>
  )
}
