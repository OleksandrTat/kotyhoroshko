'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { NextButton } from '@/components/NextButton'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { TOTAL_SCENES, type Scene, type SceneTheme, type VideoGame } from '@/content/scenes'

type VideoSceneMedia = Extract<Scene['media'], { kind: 'video' }>
type VideoStage = 'intro' | 'challenge' | 'playing' | 'ended'
type CollectGame = Extract<VideoGame, { type: 'collect' }>
type TrailGame = Extract<VideoGame, { type: 'trail' }>
type DragGame = Extract<VideoGame, { type: 'drag' }>
type HoldGame = Extract<VideoGame, { type: 'hold' }>

const THEME_STYLES: Record<
  SceneTheme,
  { base: string; glowA: string; glowB: string; veil: string }
> = {
  hearth: {
    base: 'bg-[linear-gradient(180deg,#28170f_0%,#140d08_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_22%_20%,rgba(244,188,85,0.34),transparent_42%)]',
    glowB: 'bg-[radial-gradient(circle_at_78%_78%,rgba(214,134,76,0.2),transparent_48%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.72)_100%)]',
  },
  field: {
    base: 'bg-[linear-gradient(180deg,#1b1e16_0%,#0d110d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_12%,rgba(255,215,128,0.22),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_18%_78%,rgba(122,89,44,0.28),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(2,3,1,0.7)_100%)]',
  },
  forest: {
    base: 'bg-[linear-gradient(180deg,#122018_0%,#09120d_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_18%_24%,rgba(109,151,102,0.24),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_80%_74%,rgba(36,85,64,0.22),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.76)_100%)]',
  },
  dragon: {
    base: 'bg-[linear-gradient(180deg,#29110e_0%,#120707_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_76%_18%,rgba(224,92,60,0.34),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_78%,rgba(244,188,85,0.18),transparent_46%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.76)_100%)]',
  },
  dungeon: {
    base: 'bg-[linear-gradient(180deg,#15171d_0%,#06070b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_24%_26%,rgba(119,142,189,0.16),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_74%_78%,rgba(84,98,129,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_14%,rgba(0,0,0,0.82)_100%)]',
  },
  wonder: {
    base: 'bg-[linear-gradient(180deg,#15201f_0%,#08100f_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_32%_20%,rgba(162,229,180,0.26),transparent_36%)]',
    glowB: 'bg-[radial-gradient(circle_at_72%_74%,rgba(244,188,85,0.18),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.72)_100%)]',
  },
  forge: {
    base: 'bg-[linear-gradient(180deg,#23130e_0%,#0f0806_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_68%_18%,rgba(244,114,52,0.3),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_82%,rgba(255,225,174,0.12),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.78)_100%)]',
  },
  sky: {
    base: 'bg-[linear-gradient(180deg,#132033_0%,#090e16_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_50%_14%,rgba(161,196,255,0.22),transparent_30%)]',
    glowB: 'bg-[radial-gradient(circle_at_22%_82%,rgba(244,188,85,0.16),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_16%,rgba(0,0,0,0.74)_100%)]',
  },
  trail: {
    base: 'bg-[linear-gradient(180deg,#1a1a14_0%,#0e0d0b_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_74%_20%,rgba(200,171,101,0.24),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_24%_78%,rgba(98,112,72,0.22),transparent_42%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.74)_100%)]',
  },
  duel: {
    base: 'bg-[linear-gradient(180deg,#1b0d11_0%,#090407_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_72%_18%,rgba(255,119,82,0.26),transparent_34%)]',
    glowB: 'bg-[radial-gradient(circle_at_26%_76%,rgba(255,225,174,0.14),transparent_40%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
  escape: {
    base: 'bg-[linear-gradient(180deg,#171826_0%,#08090e_100%)]',
    glowA: 'bg-[radial-gradient(circle_at_70%_16%,rgba(181,194,255,0.2),transparent_32%)]',
    glowB: 'bg-[radial-gradient(circle_at_20%_84%,rgba(221,102,83,0.2),transparent_44%)]',
    veil: 'bg-[radial-gradient(ellipse_at_center,transparent_12%,rgba(0,0,0,0.8)_100%)]',
  },
}

const COLLECT_TARGETS = [
  { top: '18%', left: '16%' },
  { top: '28%', left: '72%' },
  { top: '66%', left: '28%' },
] as const

const TRAIL_TARGETS = [
  { top: '64%', left: '14%' },
  { top: '44%', left: '44%' },
  { top: '24%', left: '76%' },
] as const

const DRAG_TOKEN_SIZE = 76
const DRAG_GOAL = { left: 0.72, top: 0.18, width: 0.18, height: 0.24 } as const

function AmbientBackdrop({ theme }: { theme: SceneTheme }) {
  const style = THEME_STYLES[theme]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className={`absolute inset-0 ${style.base}`} />
      <div className={`animate-float absolute inset-0 ${style.glowA}`} />
      <div className={`animate-float absolute inset-0 ${style.glowB}`} style={{ animationDelay: '1.2s' }} />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,225,174,0.14)_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className={`absolute inset-0 ${style.veil}`} />
    </div>
  )
}

function GameShell({
  title,
  description,
  badge,
  status,
  successText,
  children,
}: {
  title: string
  description: string
  badge: string
  status?: string
  successText?: string
  children: React.ReactNode
}) {
  return (
    <div className="pointer-events-auto w-full max-w-lg rounded-[1.9rem] border border-[rgba(var(--color-accent),0.34)] bg-[linear-gradient(145deg,rgba(35,21,13,0.94),rgba(18,10,7,0.92))] p-6 text-left shadow-[0_24px_70px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-7">
      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.2)] bg-[rgba(var(--color-secondary),0.22)] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.74)]">
        {badge}
      </span>
      <h2 className="mt-4 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-[rgba(var(--color-accent),0.86)] sm:text-lg">{description}</p>
      {status ? <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">{status}</p> : null}
      <div className="mt-5">{children}</div>
      {successText ? <p className="mt-5 text-sm uppercase tracking-[0.22em] text-[rgba(205,255,170,0.86)]">{successText}</p> : null}
    </div>
  )
}

function CollectGameOverlay({
  game,
  onComplete,
}: {
  game: CollectGame
  onComplete: () => void
}) {
  const [collected, setCollected] = useState<number[]>([])
  const completeRef = useRef(false)
  const isDone = collected.length === COLLECT_TARGETS.length
  const gradient =
    game.theme === 'spark'
      ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,244,232,0.96),rgba(255,137,66,0.96)_52%,rgba(136,31,9,0.96)_100%)] shadow-[0_0_34px_rgba(255,122,66,0.5)]'
      : game.theme === 'firefly'
        ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,252,226,0.98),rgba(255,214,79,0.96)_56%,rgba(176,96,9,0.95)_100%)] shadow-[0_0_34px_rgba(255,213,79,0.52)]'
        : 'bg-[radial-gradient(circle_at_30%_30%,rgba(227,255,198,0.95),rgba(149,226,69,0.94)_58%,rgba(62,130,26,0.96)_100%)] shadow-[0_0_30px_rgba(152,226,79,0.55)]'

  useEffect(() => {
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 280)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

  const handleCollect = useCallback((index: number) => {
    setCollected((current) => (current.includes(index) ? current : [...current, index]))
  }, [])

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Juego corto"
      status={`${collected.length} / ${COLLECT_TARGETS.length}`}
      successText={isDone ? 'Muy bien. La escena ya puede seguir.' : undefined}
    >
      <div className="relative h-56 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(18,11,7,0.92),rgba(9,5,3,0.96))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,225,174,0.12),transparent_34%)]" />
        {COLLECT_TARGETS.map((target, index) => {
          const hidden = collected.includes(index)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCollect(index)}
              aria-label={`${game.targetLabel} ${index + 1}`}
              className={`absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.4)] transition-all duration-300 ${gradient} ${
                hidden ? 'pointer-events-none scale-0 opacity-0' : 'animate-float hover:scale-110'
              }`}
              style={{ top: target.top, left: target.left, animationDelay: `${index * 0.2}s` }}
            >
              <span className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.94),transparent_40%)]" />
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">Toca cada brillo para despertar la escena.</p>
    </GameShell>
  )
}

function TrailGameOverlay({
  game,
  onComplete,
}: {
  game: TrailGame
  onComplete: () => void
}) {
  const [nextStep, setNextStep] = useState(0)
  const [hint, setHint] = useState('Empieza por la huella número 1.')
  const completeRef = useRef(false)
  const isDone = nextStep === TRAIL_TARGETS.length

  useEffect(() => {
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 320)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

  const handleTap = useCallback((index: number) => {
    setNextStep((current) => {
      if (index !== current) {
        setHint('Ups. Vuelve a empezar desde la primera huella.')
        return 0
      }

      const nextValue = current + 1
      setHint(nextValue === TRAIL_TARGETS.length ? 'Camino encontrado.' : `Muy bien. Sigue con la huella número ${nextValue + 1}.`)
      return nextValue
    })
  }, [])

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Sigue el camino"
      status={isDone ? 'Camino listo' : `Paso ${Math.min(nextStep + 1, TRAIL_TARGETS.length)} de ${TRAIL_TARGETS.length}`}
      successText={isDone ? 'Los hermanos ya ven por dónde seguir.' : undefined}
    >
      <div className="relative h-56 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(13,15,9,0.94),rgba(6,8,5,0.98))]">
        <div className="absolute left-[14%] top-[64%] h-1 w-[34%] -rotate-[18deg] rounded-full bg-[rgba(var(--color-accent),0.24)]" />
        <div className="absolute left-[44%] top-[44%] h-1 w-[34%] -rotate-[18deg] rounded-full bg-[rgba(var(--color-accent),0.24)]" />
        {TRAIL_TARGETS.map((target, index) => {
          const completed = index < nextStep
          const active = index === nextStep

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleTap(index)}
              aria-label={`${game.stepLabel} ${index + 1}`}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-lg font-bold transition-all duration-300 ${
                completed
                  ? 'border-[rgba(205,255,170,0.66)] bg-[rgba(112,188,54,0.86)] text-[#14220b]'
                  : active
                    ? 'border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-secondary),0.82)] text-[#2a170b]'
                    : 'border-[rgba(var(--color-accent),0.28)] bg-[rgba(12,9,6,0.84)] text-[rgba(var(--color-accent),0.88)]'
              }`}
              style={{ top: target.top, left: target.left }}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">{hint}</p>
    </GameShell>
  )
}

function DragGameOverlay({
  game,
  onComplete,
}: {
  game: DragGame
  onComplete: () => void
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
  const completeRef = useRef(false)
  const [position, setPosition] = useState({ x: 0.08, y: 0.68 })
  const [isDragging, setIsDragging] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [hint, setHint] = useState('Arrastra el arado hasta el aro brillante.')

  useEffect(() => {
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 320)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

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
    setPosition({ x: nextX / maxX, y: nextY / maxY })
  }, [])

  const finishDrag = useCallback(() => {
    const board = boardRef.current
    if (!board) {
      return
    }

    const rect = board.getBoundingClientRect()
    const maxX = Math.max(rect.width - DRAG_TOKEN_SIZE, 1)
    const maxY = Math.max(rect.height - DRAG_TOKEN_SIZE, 1)
    const centerX = (position.x * maxX + DRAG_TOKEN_SIZE / 2) / rect.width
    const centerY = (position.y * maxY + DRAG_TOKEN_SIZE / 2) / rect.height

    setIsDragging(false)

    if (
      centerX >= DRAG_GOAL.left &&
      centerX <= DRAG_GOAL.left + DRAG_GOAL.width &&
      centerY >= DRAG_GOAL.top &&
      centerY <= DRAG_GOAL.top + DRAG_GOAL.height
    ) {
      setHint('Perfecto. El surco ya está trazado.')
      setIsDone(true)
      return
    }

    setHint('Casi. Llévalo hasta el aro brillante del final.')
  }, [position.x, position.y])

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
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    finishDrag()
  }, [finishDrag])

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Arrastra"
      status={isDone ? 'Listo' : isDragging ? 'Moviendo el arado' : 'Lleva la pieza al final'}
      successText={isDone ? 'Ya puedes ver cómo sigue el trabajo.' : undefined}
    >
      <div ref={boardRef} className="relative h-56 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(42,30,18,0.94),rgba(18,12,7,0.98))]">
        <div className="absolute inset-y-0 left-[22%] w-[10%] -skew-x-12 bg-[rgba(74,44,19,0.65)]" />
        <div className="absolute inset-y-0 left-[46%] w-[8%] -skew-x-12 bg-[rgba(98,62,29,0.5)]" />
        <div className="absolute left-[72%] top-[18%] h-[24%] w-[18%] rounded-[1.4rem] border-2 border-dashed border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-secondary),0.18)]" />
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

function HoldGameOverlay({
  game,
  onComplete,
}: {
  game: HoldGame
  onComplete: () => void
}) {
  const completeRef = useRef(false)
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const isDone = progress >= 100

  useEffect(() => {
    if (!holding || isDone) {
      return
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 7))
    }, 80)

    return () => window.clearInterval(intervalId)
  }, [holding, isDone])

  useEffect(() => {
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 320)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

  const stopHolding = useCallback(() => setHolding(false), [])

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Mantén pulsado"
      status={isDone ? 'Roca levantada' : `Fuerza ${Math.round(progress)}%`}
      successText={isDone ? 'Kotyhoroshko ya puede levantar la roca.' : undefined}
    >
      <div className="rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(24,12,8,0.94),rgba(9,5,4,0.98))] p-5">
        <div className="h-4 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,225,174,0.98),rgba(214,134,76,0.96))] transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          aria-label={game.actionLabel}
          onPointerDown={(event) => {
            if (isDone) {
              return
            }
            setHolding(true)
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={(event) => {
            stopHolding()
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={stopHolding}
          onLostPointerCapture={stopHolding}
          className={`mt-5 flex h-36 w-full items-center justify-center rounded-[1.5rem] border border-[rgba(var(--color-accent),0.42)] bg-[radial-gradient(circle_at_top,rgba(255,225,174,0.26),rgba(84,46,23,0.82)_62%,rgba(28,14,8,0.96)_100%)] text-2xl font-bold text-[rgba(var(--color-accent),0.96)] shadow-[0_20px_50px_rgba(0,0,0,0.34)] ${holding && !isDone ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
        >
          {isDone ? 'Muy bien' : holding ? 'Sigue así' : game.actionLabel}
        </button>
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">Mantén el dedo pulsado unos segundos para llenar toda la barra.</p>
    </GameShell>
  )
}

function VideoChallengeOverlay({ game, onComplete }: { game: VideoGame; onComplete: () => void }) {
  return (
    <div className="absolute inset-0 z-[58] flex items-center justify-center bg-[rgba(4,2,1,0.36)] p-4 backdrop-blur-[3px]">
      {game.type === 'collect' ? <CollectGameOverlay game={game} onComplete={onComplete} /> : null}
      {game.type === 'trail' ? <TrailGameOverlay game={game} onComplete={onComplete} /> : null}
      {game.type === 'drag' ? <DragGameOverlay game={game} onComplete={onComplete} /> : null}
      {game.type === 'hold' ? <HoldGameOverlay game={game} onComplete={onComplete} /> : null}
    </div>
  )
}

function EndedVideoOverlay({ title, onReplay }: { title: string; onReplay: () => void }) {
  return (
    <div className="absolute inset-0 z-[62] flex items-center justify-center bg-[rgba(5,3,2,0.42)] p-4 backdrop-blur-[3px]">
      <GameShell title="Escena completada" description={`Has terminado "${title}". Si quieres, puedes volver a verla desde el principio.`} badge="Pop-up">
        <button type="button" onClick={onReplay} className="button-primary btn-glow inline-flex items-center justify-center rounded-[1.2rem] px-6 py-3 text-base font-bold hover:scale-[1.03]">
          Ver otra vez
        </button>
      </GameShell>
    </div>
  )
}

function DraggableStoryPanel({
  scene,
  visible,
}: {
  scene: Scene
  visible: boolean
}) {
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
      className={`absolute bottom-[calc(6.7rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-[26] transition-all duration-700 sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] ${position ? '' : alignedClass} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto', width: 'min(92vw, 32rem)' } : undefined}
    >
      <div className={`story-panel depth-shadow relative rounded-[2rem] border border-[rgba(var(--color-accent),0.28)] bg-[linear-gradient(145deg,rgba(26,14,10,0.9),rgba(11,6,4,0.92))] p-5 sm:p-6 md:p-7 ${isDragging ? 'shadow-[0_34px_90px_rgba(0,0,0,0.62)]' : ''}`}>
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">Escena {scene.id} de {TOTAL_SCENES}</p>
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
        <div className="relative mt-5 space-y-4">
          {scene.text.map((paragraph) => (
            <p key={paragraph} className="story-text text-left font-medium text-[rgba(var(--color-accent),0.95)]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

function InteractiveVideoLayer({
  scene,
  prefersReducedMotion,
}: {
  scene: Scene
  prefersReducedMotion: boolean
}) {
  const media = scene.media as VideoSceneMedia
  const game = scene.videoGame
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const introPausedRef = useRef(false)
  const [challengeKey, setChallengeKey] = useState(0)
  const [videoStage, setVideoStage] = useState<VideoStage>('intro')

  const playVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const playPromise = video.play()
    if (playPromise) {
      playPromise.catch(() => {})
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    introPausedRef.current = false
    video.currentTime = 0
    setVideoStage(prefersReducedMotion ? 'challenge' : 'intro')

    if (prefersReducedMotion) {
      video.pause()
      return
    }

    playVideo()
  }, [playVideo, prefersReducedMotion])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || videoStage !== 'intro' || introPausedRef.current) {
      return
    }

    const stopAt = Math.min(1.1, Math.max(0.8, video.duration ? video.duration * 0.2 : 1))
    if (video.currentTime >= stopAt) {
      introPausedRef.current = true
      video.pause()
      setVideoStage('challenge')
    }
  }, [videoStage])

  const handleReplay = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    setChallengeKey((current) => current + 1)
    introPausedRef.current = false
    video.currentTime = 0

    if (prefersReducedMotion) {
      video.pause()
      setVideoStage('challenge')
      return
    }

    setVideoStage('intro')
    playVideo()
  }, [playVideo, prefersReducedMotion])

  return (
    <>
      <SceneLayer
        media="video"
        src={media.src}
        poster={media.poster}
        alt={media.alt}
        className="z-10 scale-[1.03] animate-fade-in-slow"
        autoPlay={false}
        loop={false}
        priority
        videoRef={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setVideoStage('ended')}
      />

      {game && videoStage === 'challenge' ? (
        <VideoChallengeOverlay
          key={challengeKey}
          game={game}
          onComplete={() => {
            setVideoStage('playing')
            playVideo()
          }}
        />
      ) : null}

      {videoStage === 'ended' ? <EndedVideoOverlay title={scene.title} onReplay={handleReplay} /> : null}
    </>
  )
}

export function StoryScene({ scene }: { scene: Scene }) {
  const [textVisible, setTextVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [scene.id])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (scene.media.kind !== 'layered') {
      return
    }

    const root = parallaxRef.current
    if (!root) {
      return
    }

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frameId = 0

    const setParallaxVariables = () => {
      root.style.setProperty('--parallax-x-s', `${current.x * 0.2}px`)
      root.style.setProperty('--parallax-y-s', `${current.y * 0.2}px`)
      root.style.setProperty('--parallax-x-m', `${current.x * 0.5}px`)
      root.style.setProperty('--parallax-y-m', `${current.y * 0.5}px`)
      root.style.setProperty('--parallax-x-l', `${current.x * 0.85}px`)
      root.style.setProperty('--parallax-y-l', `${current.y * 0.85}px`)
    }

    const resetParallax = () => {
      target.x = 0
      target.y = 0
    }

    const updateParallax = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      setParallaxVariables()
      frameId = window.requestAnimationFrame(updateParallax)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return
      }

      const normalizedX = event.clientX / window.innerWidth - 0.5
      const normalizedY = event.clientY / window.innerHeight - 0.5
      target.x = normalizedX * 24
      target.y = normalizedY * 16
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) {
        return
      }

      const normalizedX = touch.clientX / window.innerWidth - 0.5
      const normalizedY = touch.clientY / window.innerHeight - 0.5
      target.x = normalizedX * 18
      target.y = normalizedY * 12
    }

    const enableParallax = () => {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', resetParallax)
      window.addEventListener('blur', resetParallax)
      frameId = window.requestAnimationFrame(updateParallax)
    }

    const disableParallax = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', resetParallax)
      window.removeEventListener('blur', resetParallax)
      window.cancelAnimationFrame(frameId)
      resetParallax()
      current.x = 0
      current.y = 0
      setParallaxVariables()
    }

    if (prefersReducedMotion) {
      setParallaxVariables()
      return
    }

    enableParallax()
    return disableParallax
  }, [prefersReducedMotion, scene.media.kind])

  const progressValue = (scene.id / TOTAL_SCENES) * 100
  const progressLabel = `Progreso del cuento: ${Math.round(progressValue)} por ciento`

  return (
    <SceneContainer>
      <div className="absolute inset-0 overflow-hidden">
        <AmbientBackdrop theme={scene.theme} />

        {scene.media.kind === 'layered' ? (
          <div ref={parallaxRef} className="parallax-root absolute inset-0 z-10">
            <div className="parallax-layer-back absolute inset-0">
              <SceneLayer
                src={scene.media.background}
                alt={scene.media.altBackground}
                className="animate-ken-burns"
                priority
              />
            </div>
            <div className="parallax-layer-mid absolute inset-0">
              <SceneLayer
                src={scene.media.midground}
                alt={scene.media.altMidground}
                className="animate-fade-in-slow"
                priority
              />
            </div>
            <div className="parallax-layer-front absolute inset-0">
              <SceneLayer
                src={scene.media.foreground}
                alt={scene.media.altForeground}
                className="animate-fade-in-slow drop-shadow-[0_20px_44px_rgba(0,0,0,0.48)]"
                priority
              />
            </div>
          </div>
        ) : null}

        {scene.media.kind === 'image' ? (
          <SceneLayer
            src={scene.media.src}
            alt={scene.media.alt}
            className="z-10 scale-[1.03] animate-ken-burns"
            priority
          />
        ) : null}

        {scene.media.kind === 'video' ? <InteractiveVideoLayer scene={scene} prefersReducedMotion={prefersReducedMotion} /> : null}

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[rgba(8,7,7,0.96)] via-[rgba(20,14,10,0.38)] to-[rgba(12,10,9,0.08)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(var(--color-accent),0.12),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_78%_82%,rgba(var(--color-primary),0.1),transparent_44%)]" />
      </div>

      <div className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex items-center gap-3 animate-fade-in">
        <div className="relative h-12 w-12 rounded-full border border-[rgba(var(--color-accent),0.56)] bg-[rgba(var(--color-secondary),0.42)] shadow-lg shadow-black/45">
          <div className="animate-pulse-slow absolute inset-0 rounded-full bg-[rgba(var(--color-primary),0.24)]" />
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[rgba(var(--color-accent),0.98)]">
            {scene.id}
          </span>
        </div>
        <div className="rounded-full border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-3 py-1.5 backdrop-blur-sm">
          <p className="text-sm font-semibold text-[rgba(var(--color-accent),0.94)]">Escena {scene.id}</p>
        </div>
      </div>

      <DraggableStoryPanel scene={scene} visible={textVisible} />

      <div className="absolute bottom-0 left-0 right-0 z-[32] h-2 bg-[rgba(18,11,7,0.7)] backdrop-blur-sm">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressValue)}
          aria-label={progressLabel}
          className="animate-progress h-full bg-[linear-gradient(to_right,rgba(var(--color-secondary),0.96),rgba(var(--color-primary),0.98),rgba(var(--color-secondary),0.96))]"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      {scene.id < TOTAL_SCENES ? (
        <NextButton nextSceneId={scene.id + 1} />
      ) : (
        <NextButton href="/" label="Volver al inicio" direction="backward" />
      )}
    </SceneContainer>
  )
}
