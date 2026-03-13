'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { distanceBetween, type GamePoint, toViewBoxPoint } from './gameUtils'
import { sfx } from '@/lib/sfx'

type DragGame = Extract<VideoGame, { type: 'drag' }>

const DRAG_TOKEN_SIZE  = 84   // px — más grande para deditos infantiles
const DRAG_START       = { x: 0.10, y: 0.74 } as const
const DRAG_CHECKPOINTS = [
  { x: 0.30, y: 0.68 },
  { x: 0.46, y: 0.44 },
  { x: 0.66, y: 0.56 },
] as const
const DRAG_GOAL_POINT  = { x: 0.82, y: 0.22 } as const

// Mensajes de ánimo al pasar cada marca
const CHECKPOINT_MESSAGES = [
  '¡Primera marca! 🌟',
  '¡A mitad del surco! 💪',
  '¡Ya casi llegas! ⭐',
  '¡Lleva el arado al final!',
]

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
  const boardRef     = useRef<HTMLDivElement>(null)
  const dragRef      = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
  const completeRef  = useRef(false)
  const [position, setPosition]         = useState<GamePoint>(DRAG_START)
  const [nextCheckpoint, setNextCheckpoint] = useState(0)
  const [isDragging, setIsDragging]     = useState(false)
  const [checkMsg, setCheckMsg]         = useState<string | null>(null)
  const [hint, setHint]                 = useState('Toca el arado y arrástralo por las marcas doradas.')
  const isDone = nextCheckpoint > DRAG_CHECKPOINTS.length

  // Completar
  useEffect(() => {
    if (!isDone || completeRef.current) return
    completeRef.current = true
    sfx.play('success')
    const id = window.setTimeout(onComplete, 700)
    return () => window.clearTimeout(id)
  }, [isDone, onComplete])

  // Limpiar mensaje de checkpoint
  useEffect(() => {
    if (!checkMsg) return
    const id = window.setTimeout(() => setCheckMsg(null), 1100)
    return () => window.clearTimeout(id)
  }, [checkMsg])

  const updatePosition = useCallback((clientX: number, clientY: number, offsetX: number, offsetY: number) => {
    const board = boardRef.current
    if (!board) return

    const rect = board.getBoundingClientRect()
    const maxX = Math.max(rect.width  - DRAG_TOKEN_SIZE, 1)
    const maxY = Math.max(rect.height - DRAG_TOKEN_SIZE, 1)
    const nx   = Math.min(Math.max(clientX - rect.left - offsetX, 0), maxX)
    const ny   = Math.min(Math.max(clientY - rect.top  - offsetY, 0), maxY)
    const pos  = { x: nx / maxX, y: ny / maxY }
    setPosition(pos)

    if (nextCheckpoint < DRAG_CHECKPOINTS.length) {
      if (distanceBetween(pos, DRAG_CHECKPOINTS[nextCheckpoint]) <= 0.12) {
        const nv = nextCheckpoint + 1
        setNextCheckpoint(nv)
        setCheckMsg(CHECKPOINT_MESSAGES[nextCheckpoint] ?? '¡Bien!')
        setHint(
          nv === DRAG_CHECKPOINTS.length
            ? '¡Ahora lleva el arado al gran círculo final!'
            : `¡Genial! Busca la marca ${nv + 1}.`,
        )
        sfx.play('interaction')
      }
      return
    }

    if (distanceBetween(pos, DRAG_GOAL_POINT) <= 0.13) {
      setNextCheckpoint(DRAG_CHECKPOINTS.length + 1)
      setCheckMsg('¡Surco completo! 🎉')
      sfx.play('interaction')
    }
  }, [nextCheckpoint])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (isDone) return
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX:   event.clientX - rect.left,
      offsetY:   event.clientY - rect.top,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [isDone])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current
    if (!d || d.pointerId !== event.pointerId) return
    updatePosition(event.clientX, event.clientY, d.offsetX, d.offsetY)
  }, [updatePosition])

  const handlePointerEnd = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current
    if (!d || d.pointerId !== event.pointerId) return
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
          ? '¡Surco completo! 🎉'
          : nextCheckpoint === DRAG_CHECKPOINTS.length
            ? '¡Lleva el arado al círculo final!'
            : `Marca ${nextCheckpoint + 1} de ${DRAG_CHECKPOINTS.length}`
      }
      successText={isDone ? '¡Perfecto! El surco ya está listo.' : undefined}
      helperText="Toca el arado con el dedo y arrástralo por las marcas brillantes."
      progressValue={progressValue}
      onRestart={onRestart}
      onClose={onClose}
    >
      {/* ── Tablero ── */}
      <div
        ref={boardRef}
        className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(42,30,18,0.94),rgba(18,12,7,0.98))]"
      >
        {/* Ambiente campo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(100,180,60,0.1),transparent_26%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(255,225,174,0.08),transparent_24%)]" />
        <span className="pointer-events-none absolute bottom-2 left-4 text-2xl opacity-20 select-none" aria-hidden>🌾</span>
        <span className="pointer-events-none absolute top-3 right-5 text-xl opacity-15 select-none" aria-hidden>☀️</span>

        {/* ── SVG de caminos y marcas ── */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {/* Camino completo punteado */}
          <polyline
            points={[DRAG_START, ...DRAG_CHECKPOINTS, DRAG_GOAL_POINT].map(toViewBoxPoint).join(' ')}
            fill="none"
            stroke="rgba(255,225,174,0.20)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="7"
            strokeDasharray="5 6"
          />
          {/* Flecha de inicio */}
          <text
            x={DRAG_START.x * 100 + 6}
            y={DRAG_START.y * 100 - 4}
            fill="rgba(255,225,174,0.55)"
            fontSize="7"
            fontFamily="sans-serif"
          >
            ➜
          </text>
        </svg>

        {/* ── Marcas de checkpoint ── */}
        {DRAG_CHECKPOINTS.map((cp, index) => {
          const reached = index < nextCheckpoint
          const active  = index === nextCheckpoint

          return (
            <div
              key={index}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 transition-all duration-300 ${
                reached
                  ? 'border-[rgba(205,255,170,0.8)] bg-[rgba(112,188,54,0.85)] shadow-[0_0_12px_rgba(112,188,54,0.4)]'
                  : active
                    ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.8)] bg-[rgba(var(--color-secondary),0.8)]'
                    : 'border-[rgba(var(--color-accent),0.28)] bg-[rgba(12,9,6,0.8)]'
              }`}
              style={{ left: `${cp.x * 100}%`, top: `${cp.y * 100}%` }}
            >
              <span className="text-xl leading-none select-none" aria-hidden>
                {reached ? '✅' : '🌟'}
              </span>
              <span className={`text-[10px] font-bold ${reached ? 'text-[#14220b]' : 'text-[rgba(var(--color-accent),0.9)]'}`}>
                {index + 1}
              </span>
            </div>
          )
        })}

        {/* ── Meta final ── */}
        <div
          className={`absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-dashed transition-all duration-300 ${
            nextCheckpoint === DRAG_CHECKPOINTS.length
              ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.8)] bg-[rgba(var(--color-secondary),0.3)]'
              : isDone
                ? 'border-[rgba(205,255,170,0.8)] bg-[rgba(112,188,54,0.3)] shadow-[0_0_18px_rgba(112,188,54,0.5)]'
                : 'border-[rgba(var(--color-accent),0.35)] bg-[rgba(12,9,6,0.7)]'
          }`}
          style={{ left: `${DRAG_GOAL_POINT.x * 100}%`, top: `${DRAG_GOAL_POINT.y * 100}%` }}
        >
          <span className="text-2xl leading-none select-none" aria-hidden>
            {isDone ? '🏁' : '🎯'}
          </span>
          <span className="text-[10px] font-bold text-[rgba(var(--color-accent),0.9)]">Meta</span>
        </div>

        {/* ── Token del arado (arrastrable) ── */}
        <button
          type="button"
          aria-label={game.tokenLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={`absolute flex flex-col items-center justify-center rounded-[1.4rem] border-2 border-[rgba(var(--color-accent),0.7)] bg-[linear-gradient(145deg,rgba(255,225,174,0.96),rgba(214,134,76,0.92))] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-transform duration-100 select-none ${
            isDragging ? 'scale-110 shadow-[0_12px_32px_rgba(0,0,0,0.5)]' : 'hover:scale-105'
          } ${isDone ? 'opacity-60' : ''}`}
          style={{
            width:      `${DRAG_TOKEN_SIZE}px`,
            height:     `${DRAG_TOKEN_SIZE}px`,
            left:       `calc(${position.x * 100}% - ${position.x * DRAG_TOKEN_SIZE}px)`,
            top:        `calc(${position.y * 100}% - ${position.y * DRAG_TOKEN_SIZE}px)`,
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span className="text-2xl leading-none select-none" aria-hidden>🪚</span>
          <span className="mt-0.5 text-[10px] font-bold text-[#2b170b] leading-none">
            {game.tokenLabel}
          </span>
        </button>

        {/* Mensaje de checkpoint */}
        {checkMsg ? (
          <div
            key={checkMsg + nextCheckpoint}
            className="pointer-events-none absolute inset-x-0 top-10 z-50 flex justify-center"
          >
            <span className="animate-fade-in rounded-2xl bg-[rgba(0,0,0,0.75)] px-4 py-2 text-sm font-bold text-[rgba(var(--color-accent),0.98)]">
              {checkMsg}
            </span>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-sm text-[rgba(var(--color-accent),0.76)]">{hint}</p>
    </GameShell>
  )
}