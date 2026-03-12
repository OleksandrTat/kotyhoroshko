'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
  text: string
  chapterTitle?: string
  onSpeak?: () => void
  isPlaying?: boolean
}

export default function NarratorCard({ text, chapterTitle, onSpeak, isPlaying }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!cardRef.current) {
      return
    }
    gsap.from(cardRef.current, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })
  }, [text])

  useEffect(() => {
    if (!textRef.current) {
      return
    }

    textRef.current.innerHTML = text
      .split('')
      .map((char) => (char === ' ' ? ' ' : `<span style="opacity:0;display:inline-block">${char}</span>`))
      .join('')

    const spans = textRef.current.querySelectorAll('span')
    gsap.to(spans, { opacity: 1, duration: 0.04, stagger: 0.025, ease: 'none', delay: 0.4 })
  }, [text])

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        bottom: '5.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(560px, 92vw)',
        background: 'linear-gradient(135deg, rgba(20,12,4,0.94) 0%, rgba(30,18,6,0.92) 100%)',
        borderLeft: '3px solid #f4bc55',
        borderRadius: '0 12px 12px 0',
        padding: '1.25rem 1.5rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(244,188,85,0.15)',
      }}
    >
      {chapterTitle ? (
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(244,188,85,0.65)',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-display)',
          }}
        >
          ✦ {chapterTitle} ✦
        </div>
      ) : null}
      <p
        ref={textRef}
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
          lineHeight: 1.7,
          color: '#f7efe4',
          margin: 0,
        }}
      />
      {onSpeak ? (
        <button
          onClick={onSpeak}
          aria-label={isPlaying ? 'Pausar narracion' : 'Escuchar narracion'}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: isPlaying ? 'rgba(244,188,85,0.25)' : 'transparent',
            border: '1px solid rgba(244,188,85,0.35)',
            color: '#f4bc55',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isPlaying ? 'goldPulse 2s ease-in-out infinite' : 'none',
          }}
        >
          {isPlaying ? '🔊' : '🔈'}
        </button>
      ) : null}
    </div>
  )
}
