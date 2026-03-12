'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type CursorState = 'default' | 'button' | 'hotspot'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const stateRef = useRef<CursorState>('default')
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<CursorState>('default')

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(isFinePointer)
  }, [])

  useEffect(() => {
    if (!enabled || !cursorRef.current) {
      return
    }

    const cursor = cursorRef.current
    gsap.set(cursor, { opacity: 1, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.22, ease: 'power3.out' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.22, ease: 'power3.out' })

    const setCursorState = (next: CursorState) => {
      if (stateRef.current === next) {
        return
      }
      stateRef.current = next
      setState(next)
    }

    const handleMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)

      const target = event.target as HTMLElement | null
      if (!target) {
        setCursorState('default')
        return
      }

      if (target.closest('[data-cursor="hotspot"]')) {
        setCursorState('hotspot')
        return
      }

      if (target.closest('[data-cursor="button"], button, a')) {
        setCursorState('button')
        return
      }

      setCursorState('default')
    }

    const handleLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2, ease: 'power2.out' })
    }

    const handleEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2, ease: 'power2.out' })
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerleave', handleLeave)
    document.addEventListener('pointerenter', handleEnter)

    return () => {
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
      document.removeEventListener('pointerenter', handleEnter)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <div ref={cursorRef} className="custom-cursor" data-state={state} aria-hidden="true">
      <div className="custom-cursor-pen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l6 6-9 12-6 3 3-6 12-9Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l5 5" />
        </svg>
      </div>
      <div className="custom-cursor-orb" />
      <div className="custom-cursor-spark" />
    </div>
  )
}
