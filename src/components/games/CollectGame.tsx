'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { clampValue } from './gameUtils'
import { sfx } from '@/lib/sfx'

type CollectGame = Extract<VideoGame, { type: 'collect' }>

const COLLECT_TARGETS = [
  { x: 0.16, y: 0.24, ax: 0.08, ay: 0.06, speed: 1.35, phase: 0.15, size: 58 },
  { x: 0.32, y: 0.64, ax: 0.06, ay: 0.08, speed: 1.05, phase: 0.8, size: 64 },
  { x: 0.48, y: 0.36, ax: 0.09, ay: 0.05, speed: 1.55, phase: 1.4, size: 54 },
  { x: 0.62, y: 0.72, ax: 0.08, ay: 0.05, speed: 1.2, phase: 2.1, size: 60 },
  { x: 0.76, y: 0.24, ax: 0.07, ay: 0.08, speed: 1.45, phase: 2.8, size: 62 },
  { x: 0.84, y: 0.56, ax: 0.05, ay: 0.06, speed: 1.7, phase: 3.4, size: 56 },
] as const

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
  const [collected, setCollected] = useState<number[]>([])
  const [time, setTime] = useState(0)
  const completeRef = useRef(false)
  const isDone = collected.length === COLLECT_TARGETS.length
  const gradient =
    game.theme === 'spark'
      ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,244,232,0.96),rgba(255,137,66,0.96)_52%,rgba(136,31,9,0.96)_100%)] shadow-[0_0_34px_rgba(255,122,66,0.5)]'
      : game.theme === 'firefly'
        ? 'bg-[radial-gradient(circle_at_35%_35%,rgba(255,252,226,0.98),rgba(255,214,79,0.96)_56%,rgba(176,96,9,0.95)_100%)] shadow-[0_0_34px_rgba(255,213,79,0.52)]'
        : 'bg-[radial-gradient(circle_at_30%_30%,rgba(227,255,198,0.95),rgba(149,226,69,0.94)_58%,rgba(62,130,26,0.96)_100%)] shadow-[0_0_30px_rgba(152,226,79,0.55)]'

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

  const handleCollect = useCallback((index: number) => {
    setCollected((current) => (current.includes(index) ? current : [...current, index]))
  }, [])

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Caza de luces"
      status={isDone ? 'Todas atrapadas' : `Atrapa ${COLLECT_TARGETS.length - collected.length} luces mas`}
      successText={isDone ? 'Atrapaste todas las luces. La escena ya puede seguir.' : undefined}
      helperText="Las luces magicas no se quedan quietas. Tocarlas mientras bailan es mucho mas divertido."
      progressValue={(collected.length / COLLECT_TARGETS.length) * 100}
      onRestart={onRestart}
      onClose={onClose}
    >
      <div className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(18,11,7,0.92),rgba(9,5,3,0.96))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,225,174,0.16),transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.06),transparent_26%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.05),transparent_24%)]" />

        <div className="absolute left-4 top-4 flex gap-2">
          {COLLECT_TARGETS.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                collected.includes(index)
                  ? 'bg-[rgba(205,255,170,0.92)] shadow-[0_0_16px_rgba(152,226,79,0.6)]'
                  : 'bg-[rgba(255,255,255,0.14)]'
              }`}
            />
          ))}
        </div>

        {COLLECT_TARGETS.map((target, index) => {
          const hidden = collected.includes(index)
          const left = clampValue(
            target.x + Math.sin(time * target.speed + target.phase) * target.ax,
            0.08,
            0.92,
          )
          const top = clampValue(
            target.y + Math.cos(time * target.speed * 1.15 + target.phase) * target.ay,
            0.12,
            0.84,
          )

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCollect(index)}
              aria-label={`${game.targetLabel} ${index + 1}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(var(--color-accent),0.4)] transition-all duration-300 ${gradient} ${
                hidden ? 'pointer-events-none scale-0 opacity-0' : 'hover:scale-110 active:scale-95'
              }`}
              style={{
                top: `${top * 100}%`,
                left: `${left * 100}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
              }}
            >
              <span className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.94),transparent_40%)]" />
              <span className="absolute inset-0 animate-ping-slow rounded-full border border-white/30" />
              <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_65%)]" />
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">Las luces flotan por toda la escena. Si una se te escapa, espera un momento y vuelve a atraparla.</p>
    </GameShell>
  )
}
