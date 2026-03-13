'use client'

import { useEffect } from 'react'
import type { VideoGame } from '@/content/scenes'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { CollectGame } from './CollectGame'
import { DragGame } from './DragGame'
import { HoldGame } from './HoldGame'
import { TrailGame } from './TrailGame'

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()
      onClose()
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
      {game.type === 'collect' ? <CollectGame game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'trail' ? <TrailGame game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'drag' ? <DragGame game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'hold' ? <HoldGame game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
    </div>
  )
}
