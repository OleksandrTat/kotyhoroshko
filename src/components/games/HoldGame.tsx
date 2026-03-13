'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { sfx } from '@/lib/sfx'

type HoldGame = Extract<VideoGame, { type: 'hold' }>

export function HoldGame({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: HoldGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const completeRef = useRef(false)
  const [progress, setProgress] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const isDone = progress >= 100

  useEffect(() => {
    if (isDone) {
      return
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => Math.max(0, current - 3))
    }, 140)

    return () => window.clearInterval(intervalId)
  }, [isDone])

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

  const handleBoost = useCallback(() => {
    if (isDone) {
      return
    }

    setTapCount((current) => current + 1)
    setProgress((current) => Math.min(100, current + 14))
  }, [isDone])

  const strengthLabel =
    progress < 34
      ? 'La roca casi no se mueve'
      : progress < 68
        ? 'La roca ya empieza a ceder'
        : 'Ya casi la levantas'

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Empujon heroico"
      status={isDone ? 'Roca levantada' : strengthLabel}
      successText={isDone ? 'Muy bien. Kotyhoroshko ya puede levantar la roca.' : undefined}
      helperText="Aqui la fuerza se gana con empujones rapidos. Toca sin parar y no dejes que la barra baje."
      progressValue={progress}
      onRestart={onRestart}
      onClose={onClose}
    >
      <div className="rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(24,12,8,0.94),rgba(9,5,4,0.98))] p-5">
        <div className="h-4 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,225,174,0.98),rgba(214,134,76,0.96))] transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="relative mt-5 h-32 overflow-hidden rounded-[1.4rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(54,31,18,0.82),rgba(19,10,6,0.96))]">
          <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,rgba(32,17,9,0),rgba(32,17,9,0.95))]" />
          <div className="absolute left-1/2 top-[14%] h-14 w-14 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,225,174,0.2),transparent_70%)]" />
          <div
            className="absolute left-1/2 top-[30%] h-16 w-40 -translate-x-1/2 rounded-[45%] border border-[rgba(var(--color-accent),0.22)] bg-[linear-gradient(180deg,rgba(123,110,102,0.92),rgba(70,59,54,0.98))] shadow-[0_18px_30px_rgba(0,0,0,0.32)] transition-transform duration-150"
            style={{ transform: `translateX(-50%) translateY(${28 - progress * 0.22}px)` }}
          >
            <div className="absolute inset-[12%] rounded-[45%] bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(145,131,123,0.88),rgba(84,71,66,0.94))]" />
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {[0, 1, 2].map((spark) => (
              <span
                key={spark}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  progress > spark * 30 + 8
                    ? 'bg-[rgba(255,225,174,0.96)] shadow-[0_0_14px_rgba(255,225,174,0.55)]'
                    : 'bg-[rgba(255,255,255,0.12)]'
                }`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          aria-label={game.actionLabel}
          onPointerDown={handleBoost}
          className="mt-5 flex h-28 w-full items-center justify-center rounded-[1.5rem] border border-[rgba(var(--color-accent),0.42)] bg-[radial-gradient(circle_at_top,rgba(255,225,174,0.26),rgba(84,46,23,0.82)_62%,rgba(28,14,8,0.96)_100%)] text-2xl font-bold text-[rgba(var(--color-accent),0.96)] shadow-[0_20px_50px_rgba(0,0,0,0.34)] hover:scale-[1.01] active:scale-[0.99]"
        >
          {isDone ? 'Muy bien' : 'Toca rapido'}
        </button>
      </div>
      <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.76)]">Empujones dados: {tapCount}. Si te paras mucho, la fuerza vuelve a bajar.</p>
    </GameShell>
  )
}
