'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import {
  distanceBetween,
  distanceToSegment,
  getNormalizedPoint,
  type GamePoint,
  toViewBoxPoint,
} from './gameUtils'
import { sfx } from '@/lib/sfx'

type TrailGame = Extract<VideoGame, { type: 'trail' }>

const TRAIL_TARGETS = [
  { x: 0.14, y: 0.76 },
  { x: 0.30, y: 0.58 },
  { x: 0.46, y: 0.66 },
  { x: 0.60, y: 0.44 },
  { x: 0.78, y: 0.24 },
] as const

// Emojis de huellas para cada paso (dirección alternada)
const STEP_EMOJIS = ['👣', '👟', '👣', '👟', '👣']

// Mensajes para cada paso completado
const STEP_MESSAGES = [
  '¡Primera huella!',
  '¡Buen paso!',
  '¡A mitad del camino!',
  '¡Ya casi llegas!',
  '¡Camino completo! 🎉',
]

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
  const boardRef     = useRef<HTMLDivElement>(null)
  const completeRef  = useRef(false)
  const [nextStep, setNextStep]       = useState(1)
  const [hint, setHint]               = useState('Empieza en la primera huella y arrastra el dedo hasta la siguiente.')
  const [isTracing, setIsTracing]     = useState(false)
  const [pointerPoint, setPointerPoint] = useState<GamePoint | null>(null)
  const [stepMsg, setStepMsg]         = useState<string | null>(null)
  const lastIndex = TRAIL_TARGETS.length - 1
  const isDone = nextStep > lastIndex

  // Completar
  useEffect(() => {
    if (!isDone || completeRef.current) return
    completeRef.current = true
    sfx.play('success')
    const id = window.setTimeout(onComplete, 700)
    return () => window.clearTimeout(id)
  }, [isDone, onComplete])

  // Limpiar mensaje de paso
  useEffect(() => {
    if (!stepMsg) return
    const id = window.setTimeout(() => setStepMsg(null), 1200)
    return () => window.clearTimeout(id)
  }, [stepMsg])

  const updatePointer = useCallback((clientX: number, clientY: number) => {
    const board = boardRef.current
    if (!board || isDone) return

    const point  = getNormalizedPoint(board.getBoundingClientRect(), clientX, clientY)
    const start  = TRAIL_TARGETS[nextStep - 1]
    const target = TRAIL_TARGETS[nextStep]
    if (!start || !target) return

    // ¿Se salió del camino?
    if (distanceToSegment(point, start, target) > 0.20) {
      setHint('¡Por el camino brillante! No te vayas al bosque.')
      return
    }

    setPointerPoint(point)

    if (distanceBetween(point, target) <= 0.10) {
      const nextValue = nextStep + 1
      setNextStep(nextValue)
      setPointerPoint(null)
      setIsTracing(false)
      setStepMsg(STEP_MESSAGES[nextStep] ?? '¡Bien!')
      setHint(nextValue > lastIndex
        ? '¡Camino completo!'
        : `¡Sigue al paso ${nextValue + 1}!`)
      sfx.play('interaction')
    }
  }, [isDone, lastIndex, nextStep])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDone) return
    const board = boardRef.current
    if (!board)  return

    const point = getNormalizedPoint(board.getBoundingClientRect(), event.clientX, event.clientY)
    const start = TRAIL_TARGETS[nextStep - 1]
    if (!start || distanceBetween(point, start) > 0.14) {
      setHint(`Empieza tocando la huella ${nextStep}.`)
      return
    }
    setIsTracing(true)
    setPointerPoint(point)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [isDone, nextStep])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isTracing) return
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
  const progressValue = (Math.min(nextStep - 1, lastIndex) / lastIndex) * 100

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Senda mágica"
      status={isDone ? '¡Camino encontrado! 🎉' : `Huella ${nextStep} de ${lastIndex + 1}`}
      successText={isDone ? '¡Encontraste el camino! Ya podéis seguir.' : undefined}
      helperText="Arrastra el dedo de huella en huella para descubrir el camino secreto."
      progressValue={progressValue}
      onRestart={onRestart}
      onClose={onClose}
    >
      {/* ── Tablero ── */}
      <div
        ref={boardRef}
        className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(25,16,10,0.92),rgba(11,7,5,0.96))] select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ touchAction: 'none' }}
        aria-label="Tablero de huellas"
      >
        {/* Fondo bosque */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(62,100,38,0.18),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(255,225,174,0.08),transparent_24%)]" />
        {/* Árboles decorativos */}
        <span className="pointer-events-none absolute left-2 top-2 text-3xl opacity-30 select-none" aria-hidden>🌲</span>
        <span className="pointer-events-none absolute right-3 top-3 text-2xl opacity-25 select-none" aria-hidden>🌳</span>
        <span className="pointer-events-none absolute bottom-4 right-6 text-2xl opacity-20 select-none" aria-hidden>🌿</span>

        {/* ── SVG de caminos ── */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {/* Camino guía punteado */}
          <polyline
            points={TRAIL_TARGETS.map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(255,225,174,0.18)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
            strokeDasharray="4 5"
          />
          {/* Segmento ya recorrido */}
          <polyline
            points={completedPoints.map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(205,255,170,0.9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          />
          {/* Línea viva mientras arrastra */}
          {livePoints.length > 1 ? (
            <polyline
              points={livePoints.map(toViewBoxPoint).join(' ')}
              fill="none"
              stroke="rgba(255,225,174,0.92)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              strokeDasharray="3 4"
            />
          ) : null}
        </svg>

        {/* ── Huellas ── */}
        {TRAIL_TARGETS.map((target, index) => {
          const completed = index < nextStep
          const active    = index === nextStep && !isDone

          return (
            <div
              key={index}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                completed
                  ? 'border-[rgba(205,255,170,0.8)] bg-[rgba(112,188,54,0.85)] shadow-[0_0_12px_rgba(112,188,54,0.5)]'
                  : active
                    ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.8)] bg-[rgba(var(--color-secondary),0.8)]'
                    : 'border-[rgba(var(--color-accent),0.3)] bg-[rgba(12,9,6,0.8)]'
              }`}
              style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
            >
              <span className="text-2xl leading-none select-none" aria-hidden>
                {completed ? '✅' : STEP_EMOJIS[index]}
              </span>
              <span className={`mt-0.5 text-[10px] font-bold ${
                completed ? 'text-[#14220b]' : 'text-[rgba(var(--color-accent),0.9)]'
              }`}>
                {index + 1}
              </span>
            </div>
          )
        })}

        {/* Mensaje de paso completado */}
        {stepMsg ? (
          <div
            key={stepMsg + nextStep}
            className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-fade-in text-center"
          >
            <span className="rounded-2xl bg-[rgba(0,0,0,0.7)] px-4 py-2 text-base font-bold text-[rgba(var(--color-accent),0.98)]">
              {stepMsg}
            </span>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-sm text-[rgba(var(--color-accent),0.76)]">{hint}</p>
    </GameShell>
  )
}