'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { distanceBetween, type GamePoint, toViewBoxPoint } from './gameUtils'
import { sfx } from '@/lib/sfx'

type DragGame = Extract<VideoGame, { type: 'drag' }>

const DRAG_TOKEN_SIZE = 76
const DRAG_START = { x: 0.1, y: 0.74 } as const
const DRAG_CHECKPOINTS = [
  { x: 0.3, y: 0.68 },
  { x: 0.46, y: 0.44 },
  { x: 0.66, y: 0.56 },
] as const
const DRAG_GOAL_POINT = { x: 0.82, y: 0.22 } as const

export function DragGame({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: DragGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
  const completeRef = useRef(false)
  const [position, setPosition] = useState<GamePoint>(DRAG_START)
  const [nextCheckpoint, setNextCheckpoint] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hint, setHint] = useState('Lleva el arado por las marcas doradas y termina en el gran aro final.')
  const isDone = nextCheckpoint > DRAG_CHECKPOINTS.length

  useEffect(() => {
    if (!isDone) return
    if (completeRef.current) return
    completeRef.current = true

    sfx.play('success')

    const timeoutId = window.setTimeout(() => {
      onComplete()
    }, 650)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isDone])

  const updatePosition = useCallback((clientX: number, clientY: number, offsetX: number, offsetY: number) => {
    const board = boardRef.current
    if (!board) {
      return
    }

    const rect = board.getBoundingClientRect()
    const maxX = Math.max(rect.width - DRAG_TOKEN_SIZE, 1)
    const maxY = Math.max(rect.height - DRAG_TOKEN_SIZE, 1)
    const nextX = Math.min(Math.max(clientX - rect.left - offsetX, 0), maxX)
    const nextY = Math.min(Math.max(clientY - rect.top - offsetY, 0), maxY)
    const nextPosition = { x: nextX / maxX, y: nextY / maxY }
    setPosition(nextPosition)

    if (nextCheckpoint < DRAG_CHECKPOINTS.length) {
      if (distanceBetween(nextPosition, DRAG_CHECKPOINTS[nextCheckpoint]) <= 0.11) {
        const nextValue = nextCheckpoint + 1
        setNextCheckpoint(nextValue)
        setHint(
          nextValue === DRAG_CHECKPOINTS.length
            ? 'Muy bien. Ya solo falta llevar el arado al aro final.'
            : `Excelente. Ahora busca la marca ${nextValue + 1}.`,
        )
      }
      return
    }

    if (distanceBetween(nextPosition, DRAG_GOAL_POINT) <= 0.12) {
      setNextCheckpoint(DRAG_CHECKPOINTS.length + 1)
      setHint('Surco completo. Los hermanos ya pueden seguir trabajando.')
    }
  }, [nextCheckpoint])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (isDone) {
      return
    }

    const tokenRect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - tokenRect.left,
      offsetY: event.clientY - tokenRect.top,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [isDone])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    updatePosition(event.clientX, event.clientY, dragState.offsetX, dragState.offsetY)
  }, [updatePosition])

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

  const progressValue = (Math.min(nextCheckpoint, DRAG_CHECKPOINTS.length + 1) / (DRAG_CHECKPOINTS.length + 1)) * 100

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Manos al arado"
      status={
        isDone
          ? 'Surco completo'
          : nextCheckpoint === DRAG_CHECKPOINTS.length
            ? 'Lleva el arado al aro final'
            : `Marca ${nextCheckpoint + 1} de ${DRAG_CHECKPOINTS.length}`
      }
      successText={isDone ? 'Perfecto. El surco ya esta listo.' : undefined}
      helperText="El arado ahora tiene un recorrido de verdad: toca las marcas doradas y despues ve al final."
      progressValue={progressValue}
      onRestart={onRestart}
      onClose={onClose}
    >
      <div ref={boardRef} className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(42,30,18,0.94),rgba(18,12,7,0.98))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,225,174,0.08),transparent_22%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(255,225,174,0.08),transparent_24%)]" />

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <polyline
            points={[DRAG_START, ...DRAG_CHECKPOINTS, DRAG_GOAL_POINT].map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(255,225,174,0.18)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
            strokeDasharray="5 6"
          />
        </svg>

        {DRAG_CHECKPOINTS.map((checkpoint, index) => {
          const reached = index < nextCheckpoint
          const active = index === nextCheckpoint

          return (
            <div
              key={index}
              className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                reached
                  ? 'border-[rgba(205,255,170,0.66)] bg-[rgba(112,188,54,0.86)] text-[#14220b]'
                  : active
                    ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-secondary),0.82)] text-[#2a170b]'
                    : 'border-[rgba(var(--color-accent),0.28)] bg-[rgba(12,9,6,0.84)] text-[rgba(var(--color-accent),0.88)]'
              }`}
              style={{ left: `${checkpoint.x * 100}%`, top: `${checkpoint.y * 100}%` }}
            >
              {index + 1}
            </div>
          )
        })}

        <div
          className={`absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed text-[11px] font-bold uppercase tracking-[0.18em] ${
            nextCheckpoint === DRAG_CHECKPOINTS.length
              ? 'border-[rgba(205,255,170,0.92)] bg-[rgba(112,188,54,0.18)] text-[rgba(205,255,170,0.92)]'
              : 'border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-secondary),0.18)] text-[rgba(var(--color-accent),0.82)]'
          }`}
          style={{ left: `${DRAG_GOAL_POINT.x * 100}%`, top: `${DRAG_GOAL_POINT.y * 100}%` }}
        >
          Final
        </div>

        <button
          type="button"
          aria-label={game.tokenLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={`absolute flex items-center justify-center rounded-[1.4rem] border border-[rgba(var(--color-accent),0.54)] bg-[linear-gradient(145deg,rgba(255,225,174,0.96),rgba(214,134,76,0.92))] text-sm font-bold text-[#2b170b] shadow-[0_18px_36px_rgba(0,0,0,0.34)] ${isDragging ? 'scale-105' : 'hover:scale-105'}`}
          style={{
            width: `${DRAG_TOKEN_SIZE}px`,
            height: `${DRAG_TOKEN_SIZE}px`,
            left: `calc(${position.x * 100}% - ${position.x * DRAG_TOKEN_SIZE}px)`,
            top: `calc(${position.y * 100}% - ${position.y * DRAG_TOKEN_SIZE}px)`,
            touchAction: 'none',
          }}
        >
          {game.tokenLabel}
        </button>
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">{hint}</p>
    </GameShell>
  )
}
