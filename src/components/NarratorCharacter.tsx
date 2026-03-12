'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
  line: string
  isVisible: boolean
  isSpeaking: boolean
}

export function NarratorCharacter({ line, isVisible, isSpeaking }: Props) {
  const charRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!charRef.current || !isVisible) return
    gsap.fromTo(
      charRef.current,
      { y: 80, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' },
    )
  }, [isVisible])

  useEffect(() => {
    if (!charRef.current) return
    if (isSpeaking) {
      gsap.to(charRef.current, {
        y: -8,
        duration: 0.4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
      if (bubbleRef.current) {
        gsap.to(bubbleRef.current, {
          scale: 1.04,
          duration: 0.4,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: 'left bottom',
        })
      }
    } else {
      gsap.killTweensOf(charRef.current)
      gsap.to(charRef.current, { y: 0, duration: 0.3 })
      if (bubbleRef.current) {
        gsap.killTweensOf(bubbleRef.current)
        gsap.to(bubbleRef.current, { scale: 1, duration: 0.3 })
      }
    }
  }, [isSpeaking])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-end gap-3 pointer-events-none">
      <div ref={charRef}>
        <svg width="72" height="100" viewBox="0 0 72 100" fill="none">
          <ellipse cx="36" cy="78" rx="22" ry="22" fill="#8B4513" />
          <circle cx="36" cy="38" r="20" fill="#FDBCB4" />
          <ellipse cx="36" cy="24" rx="20" ry="10" fill="#C8C8C8" />
          <circle cx="28" cy="38" r="3" fill="#4A2B10" />
          <circle cx="44" cy="38" r="3" fill="#4A2B10" />
          <path d="M28 48 Q36 55 44 48" stroke="#A05020" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="38" r="6" fill="none" stroke="#654321" strokeWidth="1.5" />
          <circle cx="44" cy="38" r="6" fill="none" stroke="#654321" strokeWidth="1.5" />
          <line x1="34" y1="38" x2="38" y2="38" stroke="#654321" strokeWidth="1.5" />
          <path d="M16 26 Q36 12 56 26" fill="#E88B5A" stroke="#CC6030" strokeWidth="1" />
          <text
            x="36"
            y="96"
            fontSize="8"
            textAnchor="middle"
            fill="rgba(255,225,174,0.7)"
            fontFamily="var(--font-body)"
          >
            Бабуся Міла
          </text>
        </svg>
      </div>

      <div
        ref={bubbleRef}
        className="relative max-w-[200px] rounded-2xl bg-[rgba(255,248,230,0.97)] border-2 border-[rgba(244,188,85,0.5)] p-3 shadow-xl"
        style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
      >
        <p className="text-[#3a1f0e] text-sm leading-relaxed">{line}</p>
        <div className="absolute -left-3 bottom-4 w-4 h-4 overflow-hidden">
          <div className="w-5 h-5 bg-[rgba(255,248,230,0.97)] border-b-2 border-l-2 border-[rgba(244,188,85,0.5)] rotate-45 -translate-x-2 translate-y-1" />
        </div>
      </div>
    </div>
  )
}
