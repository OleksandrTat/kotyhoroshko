'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { distanceBetween, distanceToSegment, getNormalizedPoint, type GamePoint, toViewBoxPoint } from './gameUtils'
import { sfx } from '@/lib/sfx'

type TrailGame = Extract<VideoGame, { type: 'trail' }>

const TRAIL_TARGETS = [
  { x: 0.14, y: 0.76 },
  { x: 0.3, y: 0.58 },
  { x: 0.46, y: 0.66 },
  { x: 0.6, y: 0.44 },
  { x: 0.78, y: 0.24 },
] as const

export function TrailGame({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: TrailGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const completeRef = useRef(false)
  const [nextStep, setNextStep] = useState(1)
  const [hint, setHint] = useState('Empieza en la primera huella y desliza el dedo hasta la siguiente.')
  const [isTracing, setIsTracing] = useState(false)
  const [pointerPoint, setPointerPoint] = useState<GamePoint | null>(null)
  const lastIndex = TRAIL_TARGETS.length - 1
  const isDone = nextStep > lastIndex

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

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const board = boardRef.current
    if (!board || isDone) {
      return
    }

    const point = getNormalizedPoint(board.getBoundingClientRect(), clientX, clientY)
    const start = TRAIL_TARGETS[nextStep - 1]
    const target = TRAIL_TARGETS[nextStep]

    if (!start || !target) {
      return
    }

    if (distanceToSegment(point, start, target) > 0.18) {
      setHint('Sigue el caminito brillante y no te vayas al bosque.')
      return
    }

    setPointerPoint(point)

    if (distanceBetween(point, target) <= 0.095) {
      const nextValue = nextStep + 1
      setNextStep(nextValue)
      setPointerPoint(null)
      setIsTracing(false)
      setHint(nextValue > lastIndex ? 'Camino encontrado.' : `Muy bien. Ahora ve a la huella ${nextValue + 1}.`)
    }
  }, [isDone, lastIndex, nextStep])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDone) {
      return
    }

    const board = boardRef.current
    if (!board) {
      return
    }

    const point = getNormalizedPoint(board.getBoundingClientRect(), event.clientX, event.clientY)
    const start = TRAIL_TARGETS[nextStep - 1]
    if (!start || distanceBetween(point, start) > 0.11) {
      setHint(`Empieza desde la huella ${nextStep}.`)
      return
    }

    setIsTracing(true)
    setPointerPoint(point)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [isDone, nextStep])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isTracing) {
      return
    }

    updatePointer(event.clientX, event.clientY)
  }, [isTracing, updatePointer])

  const handlePointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setIsTracing(false)
    setPointerPoint(null)
  }, [])

  const completedPoints = TRAIL_TARGETS.slice(0, isDone ? TRAIL_TARGETS.length : nextStep)
  const livePoints =
    isTracing && pointerPoint
      ? [...TRAIL_TARGETS.slice(0, nextStep), pointerPoint]
      : completedPoints
  const progressValue = ((Math.min(nextStep - 1, lastIndex)) / lastIndex) * 100

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Senda magica"
      status={isDone ? 'Camino listo' : `Huella ${nextStep} de ${lastIndex}`}
      successText={isDone ? 'Camino listo. Ya podeis seguir la pista.' : undefined}
      helperText="Esta vez no solo tocas: arrastras el dedo de huella en huella para descubrir el camino."
      progressValue={progressValue}
      onRestart={onRestart}
      onClose={onClose}
    >
      <div
        ref={boardRef}
        className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(25,16,10,0.92),rgba(11,7,5,0.96))]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(188,236,164,0.08),transparent_22%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(255,225,174,0.08),transparent_24%)]" />

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <polyline
            points={TRAIL_TARGETS.map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(255,225,174,0.16)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
            strokeDasharray="4 5"
          />
          <polyline
            points={completedPoints.map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(205,255,170,0.86)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5.5"
          />
          {livePoints.length > 1 ? (
            <polyline
              points={livePoints.map(toViewBoxPoint).join(' ')}
              fill="none"
              stroke="rgba(255,225,174,0.9)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
            />
          ) : null}
        </svg>

        {TRAIL_TARGETS.map((target, index) => {
          const completed = index < nextStep
          const active = index === nextStep && !isDone

          return (
            <div
              key={index}
              className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-base font-bold transition-all duration-300 ${
                completed
                  ? 'border-[rgba(205,255,170,0.66)] bg-[rgba(112,188,54,0.86)] text-[#14220b]'
                  : active
                    ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-secondary),0.82)] text-[#2a170b]'
                    : 'border-[rgba(var(--color-accent),0.28)] bg-[rgba(12,9,6,0.84)] text-[rgba(var(--color-accent),0.88)]'
              }`}
              style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
            >
              {index + 1}
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">{hint}</p>
    </GameShell>
  )
}
