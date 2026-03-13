'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { TOTAL_SCENES, type Scene } from '@/content/scenes'
import { THEME_META } from './sceneMeta'

export function DraggableStoryPanel({
  scene,
}: {
  scene: Scene
  visible?: boolean
}) {
  const meta = THEME_META[scene.theme]
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const clampPosition = useCallback((x: number, y: number) => {
    const panel = panelRef.current
    if (!panel) {
      return { x, y }
    }

    const margin = 12
    const maxX = Math.max(window.innerWidth - panel.offsetWidth - margin, margin)
    const maxY = Math.max(window.innerHeight - panel.offsetHeight - margin, margin)
    return { x: Math.min(Math.max(x, margin), maxX), y: Math.min(Math.max(y, margin), maxY) }
  }, [])

  useEffect(() => {
    if (!position) {
      return
    }

    const handleResize = () => {
      setPosition((current) => (current ? clampPosition(current.x, current.y) : current))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [clampPosition, position])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const panel = panelRef.current
    if (!panel) {
      return
    }

    const rect = panel.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
    }
    setPosition({ x: rect.left, y: rect.top })
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const nextX = dragState.originX + event.clientX - dragState.startX
    const nextY = dragState.originY + event.clientY - dragState.startY
    setPosition(clampPosition(nextX, nextY))
  }, [clampPosition])

  const handlePointerEnd = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    dragRef.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  const alignedClass =
    scene.panelAlign === 'right'
      ? 'md:left-auto md:right-[calc(2rem+env(safe-area-inset-right))]'
      : 'md:left-[calc(2rem+env(safe-area-inset-left))] md:right-auto'

  return (
    <div
      ref={panelRef}
      data-gsap="story-panel"
      className={`absolute bottom-[calc(6.7rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-[26] sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] ${position ? '' : alignedClass}`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto', width: 'min(92vw, 32rem)' } : undefined}
    >
      <div className={`story-panel depth-shadow relative rounded-[2rem] border border-[rgba(var(--color-accent),0.28)] bg-[linear-gradient(145deg,rgba(26,14,10,0.9),rgba(11,6,4,0.92))] p-5 sm:p-6 md:p-7 ${isDragging ? 'shadow-[0_34px_90px_rgba(0,0,0,0.62)]' : ''}`}>
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">Escena {scene.id} de {TOTAL_SCENES}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.52)]">{meta.label}</p>
            <h1 className="mt-3 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {scene.title}
            </h1>
          </div>
          <button
            type="button"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            aria-label="Arrastrar el cuadro de texto"
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(var(--color-secondary),0.2)] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.74)] ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:bg-[rgba(var(--color-secondary),0.3)]'}`}
            style={{ touchAction: 'none' }}
          >
            Arrastra
          </button>
        </div>

        <div className="relative mt-4 rounded-[1.25rem] border border-[rgba(var(--color-accent),0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[rgba(var(--color-accent),0.62)]">
          {meta.hint}
        </div>

        <div className="story-scroll-mask relative mt-5 max-h-[min(42svh,25rem)] space-y-4 overflow-y-auto pr-2">
          {scene.text.map((paragraph, index) => (
            <p
              key={paragraph}
              data-gsap={`story-text-${index}`}
              className="story-text text-left font-medium text-[rgba(var(--color-accent),0.95)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
