'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import type { DialogueBubble as DialogueType } from '@/content/scenes'

const TONE_STYLES: Record<NonNullable<DialogueType['tone']>, {
  bg: string
  border: string
  text: string
  tail: string
}> = {
  warm: { bg: '#FFF8E6', border: '#F4BC55', text: '#3a1f0e', tail: '#FFF8E6' },
  hero: { bg: '#E8F4FF', border: '#4A90D9', text: '#0d2a4a', tail: '#E8F4FF' },
  danger: { bg: '#FFE8E8', border: '#D94A4A', text: '#4a0d0d', tail: '#FFE8E8' },
  mystic: { bg: '#EDE8FF', border: '#8B5CF6', text: '#2d1a4a', tail: '#EDE8FF' },
}

type Props = {
  bubble: DialogueType
  delay?: number
}

export function DialogueBubbleComponent({
  bubble,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const tone = bubble.tone ?? 'warm'
  const style = TONE_STYLES[tone]
  const isRight = bubble.align === 'right'
  const tailStyle: CSSProperties = isRight ? { right: 24 } : { left: 24 }

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      {
        scale: 0.3,
        opacity: 0,
        transformOrigin: isRight ? 'bottom right' : 'bottom left',
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay,
        ease: 'back.out(2.5)',
      },
    )
  }, [delay, isRight])

  return (
    <div
      ref={ref}
      className={`relative inline-block max-w-[280px] ${isRight ? 'self-end' : 'self-start'}`}
    >
      <div
        className="mb-1 px-3 py-0.5 rounded-full text-xs font-bold inline-block"
        style={{ background: style.border, color: style.text, fontFamily: 'var(--font-body)' }}
      >
        {bubble.speaker}
      </div>

      <div
        className="rounded-2xl px-4 py-3 shadow-lg"
        style={{
          background: style.bg,
          border: `2.5px solid ${style.border}`,
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.2vw, 1.25rem)',
          lineHeight: 1.55,
          color: style.text,
        }}
      >
        {bubble.text}
      </div>

      <svg
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill={style.tail}
        className="absolute -bottom-3"
        style={tailStyle}
      >
        <path d={isRight ? 'M20 0 L0 0 L14 16 Z' : 'M0 0 L20 0 L6 16 Z'} />
        <path
          d={isRight ? 'M20 0 L14 16' : 'M0 0 L6 16'}
          stroke={style.border}
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  )
}
