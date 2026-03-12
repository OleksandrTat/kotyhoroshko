'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type TailPos = 'bottom-left' | 'bottom-right'

type Props = {
  text: string
  character: string
  characterColor?: string
  tailPosition?: TailPos
  visible?: boolean
}

export default function DialogueBubble({
  text,
  character,
  characterColor = '#f4bc55',
  tailPosition = 'bottom-left',
  visible = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current || !visible) {
      return
    }
    gsap.fromTo(
      ref.current,
      {
        scale: 0.5,
        opacity: 0,
        transformOrigin: tailPosition === 'bottom-left' ? 'bottom left' : 'bottom right',
      },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
    )
  }, [tailPosition, visible])

  if (!visible) {
    return null
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', maxWidth: '280px' }}>
      <div
        style={{
          background: 'rgba(255,248,230,0.97)',
          borderRadius: '18px',
          padding: '0.75rem 1rem',
          color: '#1a1008',
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          lineHeight: 1.5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
          border: `2px solid ${characterColor}33`,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: characterColor,
            color: '#1a1008',
            fontWeight: 700,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            marginRight: '0.5rem',
            verticalAlign: 'middle',
          }}
        >
          {character[0]?.toUpperCase()}
        </span>
        {text}
      </div>
      <svg
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="rgba(255,248,230,0.97)"
        style={{
          position: 'absolute',
          ...(tailPosition === 'bottom-left' ? { bottom: -16, left: 20 } : {}),
          ...(tailPosition === 'bottom-right' ? { bottom: -16, right: 20, transform: 'scaleX(-1)' } : {}),
        }}
      >
        <path d="M0 0 L24 0 L12 18 Z" />
      </svg>
    </div>
  )
}
