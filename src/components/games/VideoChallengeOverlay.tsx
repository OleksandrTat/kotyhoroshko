'use client'

import { useEffect, useState } from 'react'
import type { VideoGame } from '@/content/scenes'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { CollectGame } from './CollectGame'
import { DragGame } from './DragGame'
import { HoldGame } from './HoldGame'
import { TrailGame } from './TrailGame'
import { ConfettiEffect } from '@/components/effects/ConfettiEffect'

export function VideoChallengeOverlay({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: VideoGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const focusRef = useFocusTrap<HTMLDivElement>(true)
  const [showConfetti, setShowConfetti] = useState(false)

  // Envuelve onComplete para disparar confeti antes de cerrar
  const handleComplete = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      setShowConfetti(true)
    }
    const delay = prefersReduced ? 0 : 1400
    // Dar tiempo al confeti antes de llamar al padre
    window.setTimeout(() => {
      setShowConfetti(false)
      onComplete()
    }, delay)
  }

  // Limpiar confeti si se cierra a mano
  const handleClose = () => {
    setShowConfetti(false)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      ref={focusRef}
      role="dialog"
      aria-modal="true"
      data-story-modal="true"
      className="animate-fade-in absolute inset-0 z-[58] flex items-center justify-center bg-[rgba(4,2,1,0.36)] p-4 backdrop-blur-[3px]"
    >
      {/* Confeti de victoria sobre todo el overlay */}
      {showConfetti ? <ConfettiEffect durationMs={2000} /> : null}

      {game.type === 'collect' && (
        <CollectGame game={game} onComplete={handleComplete} onRestart={onRestart} onClose={handleClose} />
      )}
      {game.type === 'trail' && (
        <TrailGame game={game} onComplete={handleComplete} onRestart={onRestart} onClose={handleClose} />
      )}
      {game.type === 'drag' && (
        <DragGame game={game} onComplete={handleComplete} onRestart={onRestart} onClose={handleClose} />
      )}
      {game.type === 'hold' && (
        <HoldGame game={game} onComplete={handleComplete} onRestart={onRestart} onClose={handleClose} />
      )}
    </div>
  )
}
