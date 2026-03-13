'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsapSetup'

type Side = 'left' | 'right'

type DialogueLine = {
  text: string
  character: string
  emoji: string
  side: Side
  delay: number
}

export const SCENE_DIALOGUES: Partial<Record<number, DialogueLine[]>> = {
  7: [
    { text: '¿A luchar o a hacer las paces?', character: 'Dragón', emoji: '🐉', side: 'right', delay: 1 },
    { text: '¡A luchar!', character: 'Hermanos', emoji: '👦', side: 'left', delay: 2.5 },
  ],
  21: [
    { text: '¿Has venido a luchar?', character: 'Dragón', emoji: '🐉', side: 'right', delay: 1 },
    { text: '¡Quiero liberar a mi familia!', character: 'Kotyhoroshko', emoji: '💪', side: 'left', delay: 2.5 },
  ],
  23: [
    { text: 'Cierra los ojos... ¡voy a silbar!', character: 'Kotyhoroshko', emoji: '💪', side: 'left', delay: 0.8 },
  ],
  24: [
    { text: '¿Hacemos las paces?', character: 'Dragón', emoji: '🐉', side: 'right', delay: 0.8 },
    { text: '¡No! ¡A luchar!', character: 'Kotyhoroshko', emoji: '💪', side: 'left', delay: 2 },
  ],
}

function SingleBubble({ line }: { line: DialogueLine }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    gsap.fromTo(
      el,
      { scale: 0, opacity: 0, transformOrigin: line.side === 'left' ? 'bottom left' : 'bottom right' },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)', delay: line.delay },
    )
  }, [line.delay, line.side])

  return (
    <div
      ref={ref}
      className={`flex items-end gap-2 ${line.side === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <span className="shrink-0 text-4xl">{line.emoji}</span>
      <div
        className={`relative max-w-[14rem] rounded-[1.4rem] border-2 border-[rgba(255,225,174,0.6)] bg-white px-4 py-3 text-sm font-bold text-[#1a0d06] shadow-lg ${
          line.side === 'left' ? 'rounded-bl-sm' : 'rounded-br-sm'
        }`}
      >
        <p className="mb-1 text-xs uppercase tracking-wide text-[#8b4513]">{line.character}</p>
        <p>{line.text}</p>
      </div>
    </div>
  )
}

export function DialogueBubbles({ sceneId }: { sceneId: number }) {
  const dialogues = SCENE_DIALOGUES[sceneId]
  if (!dialogues || dialogues.length === 0) return null

  return (
    <div className="absolute bottom-[calc(9rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-[44] flex flex-col gap-3">
      {dialogues.map((line, index) => (
        <SingleBubble key={index} line={line} />
      ))}
    </div>
  )
}
