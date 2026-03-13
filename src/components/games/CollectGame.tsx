'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { clampValue } from './gameUtils'
import { sfx } from '@/lib/sfx'

type CollectGame = Extract<VideoGame, { type: 'collect' }>

const COLLECT_TARGETS = [
  { x: 0.16, y: 0.24, ax: 0.08, ay: 0.06, speed: 1.35, phase: 0.15, size: 72 },
  { x: 0.32, y: 0.64, ax: 0.06, ay: 0.08, speed: 1.05, phase: 0.8,  size: 80 },
  { x: 0.48, y: 0.36, ax: 0.09, ay: 0.05, speed: 1.55, phase: 1.4,  size: 68 },
  { x: 0.62, y: 0.72, ax: 0.08, ay: 0.05, speed: 1.2,  phase: 2.1,  size: 76 },
  { x: 0.76, y: 0.24, ax: 0.07, ay: 0.08, speed: 1.45, phase: 2.8,  size: 78 },
  { x: 0.84, y: 0.56, ax: 0.05, ay: 0.06, speed: 1.7,  phase: 3.4,  size: 70 },
] as const

// Emoji temáticos por tipo de juego
const THEME_EMOJIS: Record<string, string[]> = {
  spark:   ['🔥', '⚡', '✨', '💥', '🌟', '⭐'],
  firefly: ['🌟', '✨', '💫', '⭐', '🔆', '🌙'],
  pea:     ['🌿', '💚', '🌱', '🍃', '🫛', '🌾'],
}

// Mensajes de ánimo al atrapar una luz
const CHEER_MESSAGES = ['¡Genial!', '¡Bravo!', '¡Sí!', '¡Bien!', '¡Ole!', '¡Yupi!']

type PopParticle = {
  id: number
  x: number
  y: number
  emoji: string
  angle: number
}

export function CollectGame({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: CollectGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const [collected, setCollected]     = useState<number[]>([])
  const [time, setTime]               = useState(0)
  const [popParticles, setPopParticles] = useState<PopParticle[]>([])
  const [cheerMsg, setCheerMsg]       = useState<string | null>(null)
  const [wobbleIndex, setWobbleIndex] = useState<number | null>(null)
  const completeRef  = useRef(false)
  const nextParticleId = useRef(0)
  const isDone = collected.length === COLLECT_TARGETS.length

  const emojis = THEME_EMOJIS[game.theme] ?? THEME_EMOJIS.firefly

  const gradient =
    game.theme === 'spark'
      ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,244,232,0.96),rgba(255,137,66,0.96)_52%,rgba(136,31,9,0.96)_100%)] shadow-[0_0_34px_rgba(255,122,66,0.5)]'
      : game.theme === 'firefly'
        ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,252,226,0.98),rgba(255,214,79,0.96)_56%,rgba(176,96,9,0.95)_100%)] shadow-[0_0_34px_rgba(255,213,79,0.52)]'
        : 'bg-[radial-gradient(circle_at_30%_30%,rgba(227,255,198,0.95),rgba(149,226,69,0.94)_58%,rgba(62,130,26,0.96)_100%)] shadow-[0_0_30px_rgba(152,226,79,0.55)]'

  // ─── RAF para animar posiciones ───────────────────────────────────────────
  useEffect(() => {
    let frameId = 0
    const start = performance.now()
    const animate = (now: number) => {
      setTime((now - start) / 1000)
      frameId = window.requestAnimationFrame(animate)
    }
    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [])

  // ─── Limpiar partículas de explosión después de 800 ms ────────────────────
  useEffect(() => {
    if (popParticles.length === 0) return
    const id = window.setTimeout(() => setPopParticles([]), 800)
    return () => window.clearTimeout(id)
  }, [popParticles])

  // ─── Limpiar mensaje de ánimo ─────────────────────────────────────────────
  useEffect(() => {
    if (!cheerMsg) return
    const id = window.setTimeout(() => setCheerMsg(null), 900)
    return () => window.clearTimeout(id)
  }, [cheerMsg])

  // ─── Completar juego ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDone || completeRef.current) return
    completeRef.current = true
    sfx.play('success')
    const id = window.setTimeout(onComplete, 700)
    return () => window.clearTimeout(id)
  }, [isDone, onComplete])

  // ─── Atrapar una luz ──────────────────────────────────────────────────────
  const handleCollect = useCallback((index: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    setCollected((prev) => (prev.includes(index) ? prev : [...prev, index]))

    // Mensaje de ánimo aleatorio
    setCheerMsg(CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)])

    // Partículas de explosión alrededor del punto de toque
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = ((rect.left + rect.right) / 2 - event.currentTarget.closest<HTMLElement>('[data-game-board]')!.getBoundingClientRect().left)
    const cy = ((rect.top  + rect.bottom) / 2 - event.currentTarget.closest<HTMLElement>('[data-game-board]')!.getBoundingClientRect().top)

    const particles: PopParticle[] = Array.from({ length: 6 }, (_, i) => ({
      id:    nextParticleId.current++,
      x:     cx,
      y:     cy,
      emoji: emojis[i % emojis.length],
      angle: (360 / 6) * i,
    }))
    setPopParticles(particles)
    setWobbleIndex(index)
    window.setTimeout(() => setWobbleIndex(null), 300)

    sfx.play('interaction')
  }, [emojis])

  const remaining = COLLECT_TARGETS.length - collected.length

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Caza de luces"
      status={isDone ? '¡Todas atrapadas! 🎉' : `Quedan ${remaining} luz${remaining !== 1 ? 'es' : ''}`}
      successText={isDone ? '¡Atrapaste todas las luces! La escena puede seguir.' : undefined}
      helperText="Las luces mágicas no se quedan quietas. ¡Tócalas antes de que escapen!"
      progressValue={(collected.length / COLLECT_TARGETS.length) * 100}
      onRestart={onRestart}
      onClose={onClose}
    >
      {/* ── Tablero de juego ────────────────────────────────────────────────── */}
      <div
        data-game-board
        className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(18,11,7,0.92),rgba(9,5,3,0.96))]"
      >
        {/* Atmósfera */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,225,174,0.16),transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.06),transparent_26%)]" />

        {/* ── Estrellas de progreso ── */}
        <div className="absolute left-4 top-3 flex items-center gap-1.5">
          {COLLECT_TARGETS.map((_, i) => (
            <span
              key={i}
              className={`text-xl transition-all duration-300 ${
                collected.includes(i)
                  ? 'drop-shadow-[0_0_6px_rgba(255,220,50,0.9)] scale-110'
                  : 'opacity-25'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* ── Mensaje de ánimo ── */}
        {cheerMsg ? (
          <div
            key={cheerMsg + Date.now()}
            className="pointer-events-none absolute left-1/2 top-10 z-50 -translate-x-1/2 animate-fade-in-up text-2xl font-bold text-[rgba(var(--color-accent),0.98)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {cheerMsg}
          </div>
        ) : null}

        {/* ── Partículas de explosión ── */}
        {popParticles.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute z-40 text-xl"
            style={{
              left: p.x,
              top:  p.y,
              transform: `translate(-50%, -50%)`,
              animation: `popFly 0.8s ease-out forwards`,
              '--angle': `${p.angle}deg`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}

        {/* ── Luces flotantes ── */}
        {COLLECT_TARGETS.map((target, index) => {
          const hidden = collected.includes(index)
          const isWobbling = wobbleIndex === index
          const left = clampValue(
            target.x + Math.sin(time * target.speed + target.phase) * target.ax,
            0.08, 0.92,
          )
          const top = clampValue(
            target.y + Math.cos(time * target.speed * 1.15 + target.phase) * target.ay,
            0.16, 0.82,
          )

          return (
            <button
              key={index}
              type="button"
              onPointerDown={(e) => !hidden && handleCollect(index, e)}
              aria-label={`${game.targetLabel} ${index + 1}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(255,255,255,0.5)] transition-all duration-300 ${gradient} ${
                hidden
                  ? 'pointer-events-none scale-0 opacity-0'
                  : isWobbling
                    ? 'scale-125'
                    : 'hover:scale-110 active:scale-95'
              }`}
              style={{
                top:    `${top  * 100}%`,
                left:   `${left * 100}%`,
                width:  `${target.size}px`,
                height: `${target.size}px`,
              }}
            >
              {/* Brillo interior */}
              <span className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(255,255,255,0.9),transparent_42%)]" />
              {/* Halo pulsante */}
              <span className="absolute inset-[-10px] animate-ping-slow rounded-full border border-white/25" />
              {/* Emoji central */}
              <span
                className="absolute inset-0 flex items-center justify-center text-2xl"
                aria-hidden="true"
              >
                {emojis[index % emojis.length]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pista textual */}
      <p className="mt-4 text-center text-sm text-[rgba(var(--color-accent),0.76)]">
        {isDone
          ? '¡Lo conseguiste! Eres increíble. 🌟'
          : '¡Toca las luces antes de que vuelen demasiado rápido!'}
      </p>

      {/* CSS de la animación popFly (inyectado inline) */}
      <style>{`
        @keyframes popFly {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% {
            transform: translate(
              calc(-50% + cos(var(--angle)) * 55px),
              calc(-50% + sin(var(--angle)) * 55px)
            ) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </GameShell>
  )
}
