'use client'

import { useEffect } from 'react'
import { GameShell, GAME_SECONDARY_BUTTON_CLASS } from './GameShell'
import { useFocusTrap } from '@/hooks/useFocusTrap'

export function EndedVideoOverlay({
  title,
  onReplay,
  onClose,
}: {
  title: string
  onReplay: () => void
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
      className="animate-fade-in absolute inset-0 z-[62] flex items-center justify-center bg-[rgba(5,3,2,0.42)] p-4 backdrop-blur-[3px]"
    >
      <GameShell
        title="Escena terminada"
        description={`La parte animada de "${title}" ya termino. Puedes seguir el cuento o verla otra vez.`}
        badge="Cuento listo"
        helperText="Cuando quieras, cierra esta tarjeta y usa el boton de continuar para pasar a la siguiente escena."
        onClose={onClose}
        closeLabel="Seguir el cuento"
      >
        <div className="grid gap-3">
          <button type="button" onClick={onReplay} className={GAME_SECONDARY_BUTTON_CLASS}>
            Ver otra vez
          </button>
        </div>
      </GameShell>
    </div>
  )
}
