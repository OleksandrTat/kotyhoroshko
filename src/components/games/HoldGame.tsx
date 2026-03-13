'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { VideoGame } from '@/content/scenes'
import { GameShell } from './GameShell'
import { sfx } from '@/lib/sfx'

type HoldGame = Extract<VideoGame, { type: 'hold' }>

// Expresiones del héroe según el nivel de fuerza
const HERO_EXPRESSIONS = [
  { emoji: '😴', label: 'Durmiendo' },  // 0–25
  { emoji: '😤', label: 'Intentando' }, // 26–50
  { emoji: '💪', label: 'Empujando' },  // 51–75
  { emoji: '🦸', label: '¡Héroe!'    }, // 76–99
  { emoji: '🏆', label: '¡Victoria!' }, // 100
]

const COMBO_LABELS = ['', '¡x2!', '¡x3!', '¡x4!', '¡x5! 🔥']

function getExpression(progress: number, isDone: boolean) {
  if (isDone) return HERO_EXPRESSIONS[4]
  if (progress < 26)  return HERO_EXPRESSIONS[0]
  if (progress < 51)  return HERO_EXPRESSIONS[1]
  if (progress < 76)  return HERO_EXPRESSIONS[2]
  return HERO_EXPRESSIONS[3]
}

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
  const completeRef  = useRef(false)
  const lastTapRef   = useRef(0)
  const [progress, setProgress]   = useState(0)
  const [tapCount, setTapCount]   = useState(0)
  const [combo, setCombo]         = useState(0)
  const [shake, setShake]         = useState(false)
  const [flash, setFlash]         = useState(false)
  const isDone = progress >= 100

  // Caída pasiva de la barra
  useEffect(() => {
    if (isDone) return
    const id = window.setInterval(() => {
      setProgress((p) => Math.max(0, p - 3))
    }, 140)
    return () => window.clearInterval(id)
  }, [isDone])

  // Completar
  useEffect(() => {
    if (!isDone || completeRef.current) return
    completeRef.current = true
    sfx.play('success')
    const id = window.setTimeout(onComplete, 700)
    return () => window.clearTimeout(id)
  }, [isDone, onComplete])

  // Tap / golpe
  const handleBoost = useCallback(() => {
    if (isDone) return

    const now = Date.now()
    const gap = now - lastTapRef.current
    lastTapRef.current = now

    // Combo si toca en menos de 500 ms
    const newCombo = gap < 500 ? Math.min(combo + 1, 4) : 0
    setCombo(newCombo)

    const boost = 14 + newCombo * 4 // más fuerza con combo
    setTapCount((c) => c + 1)
    setProgress((p) => Math.min(100, p + boost))
    setShake(true)
    setFlash(true)
    window.setTimeout(() => setShake(false), 120)
    window.setTimeout(() => setFlash(false), 100)
    sfx.play('interaction')
  }, [isDone, combo])

  const expression  = getExpression(progress, isDone)
  const comboLabel  = COMBO_LABELS[Math.min(combo, 4)]
  const rockLift    = isDone ? -32 : -(progress * 0.28)  // px hacia arriba

  // Etiqueta de fuerza
  const strengthLabel =
    isDone        ? '¡Roca levantada! 🏆'
    : progress < 26  ? 'La roca casi no se mueve…'
    : progress < 51  ? 'La roca empieza a ceder'
    : progress < 76  ? '¡Ya casi la levantas!'
    : '¡Un poco más!'

  return (
    <GameShell
      title={game.title}
      description={game.description}
      badge="Empujón heroico"
      status={isDone ? '¡Roca levantada! 🏆' : strengthLabel}
      successText={isDone ? '¡Increíble! Kotyhoroshko puede levantar la roca.' : undefined}
      helperText="Da golpes rápidos para llenar la barra. ¡Cuanto más rápido, más fuerza ganas!"
      progressValue={progress}
      onRestart={onRestart}
      onClose={onClose}
    >
      <div className="rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(24,12,8,0.94),rgba(9,5,4,0.98))] p-5">

        {/* ── Barra de fuerza ── */}
        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-widest text-[rgba(var(--color-accent),0.62)]">
          <span>Fuerza</span>
          <span className="text-base font-bold text-[rgba(var(--color-accent),0.9)]">{Math.round(progress)}%</span>
        </div>
        <div className="h-5 overflow-hidden rounded-full border border-[rgba(var(--color-accent),0.18)] bg-[rgba(255,255,255,0.06)]">
          <div
            className={`h-full rounded-full transition-[width] duration-150 ${
              isDone
                ? 'bg-[linear-gradient(90deg,rgba(205,255,170,0.98),rgba(112,188,54,0.96))]'
                : 'bg-[linear-gradient(90deg,rgba(255,225,174,0.98),rgba(244,188,85,0.96),rgba(214,134,76,0.94))]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Héroe + Roca ── */}
        <div className="relative mt-4 flex h-36 items-end justify-center overflow-hidden rounded-[1.2rem] border border-[rgba(var(--color-accent),0.12)] bg-[linear-gradient(180deg,rgba(40,22,12,0.7),rgba(14,8,5,0.95))]">

          {/* Fondo tierra */}
          <div className="absolute bottom-0 left-0 right-0 h-8 rounded-b-[1.2rem] bg-[linear-gradient(180deg,rgba(62,38,20,0.6),rgba(38,22,12,0.9))]" />

          {/* Flash de impacto */}
          {flash ? (
            <div className="pointer-events-none absolute inset-0 rounded-[1.2rem] bg-[rgba(255,225,174,0.12)]" />
          ) : null}

          {/* Héroe con expresión dinámica */}
          <div
            className={`absolute left-[18%] bottom-6 flex flex-col items-center transition-transform duration-100 ${shake ? '-translate-y-1' : ''}`}
          >
            <span className="text-5xl leading-none select-none" role="img" aria-label={expression.label}>
              {expression.emoji}
            </span>
            {comboLabel ? (
              <span
                key={tapCount}
                className="mt-1 text-xs font-bold text-[rgba(255,225,174,0.95)] animate-fade-in"
              >
                {comboLabel}
              </span>
            ) : null}
          </div>

          {/* Roca que se levanta */}
          <div
            className="absolute right-[22%] bottom-6 transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${rockLift}px)` }}
          >
            <div
              className={`flex h-20 w-24 items-center justify-center rounded-[45%] border border-[rgba(var(--color-accent),0.22)] bg-[linear-gradient(180deg,rgba(123,110,102,0.92),rgba(70,59,54,0.98))] shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-200 ${
                isDone ? 'shadow-[0_0_20px_rgba(205,255,170,0.4)]' : ''
              }`}
            >
              <div className="absolute inset-[14%] rounded-[45%] bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.18),transparent_30%)]" />
              <span className="relative z-10 text-3xl select-none" aria-hidden="true">
                {isDone ? '🪨✨' : '🪨'}
              </span>
            </div>

            {/* Destello de victoria */}
            {isDone ? (
              <div className="absolute -inset-3 animate-ping-slow rounded-full border-2 border-[rgba(205,255,170,0.5)]" />
            ) : null}
          </div>
        </div>

        {/* ── Botón de golpe ── */}
        <button
          type="button"
          aria-label={game.actionLabel}
          onPointerDown={handleBoost}
          disabled={isDone}
          className={`mt-4 flex h-24 w-full select-none items-center justify-center gap-3 rounded-[1.4rem] border text-2xl font-bold transition-all duration-100 active:scale-95 ${
            isDone
              ? 'cursor-default border-[rgba(205,255,170,0.4)] bg-[rgba(112,188,54,0.2)] text-[rgba(205,255,170,0.9)]'
              : 'border-[rgba(var(--color-accent),0.42)] bg-[radial-gradient(circle_at_top,rgba(255,225,174,0.26),rgba(84,46,23,0.82)_62%,rgba(28,14,8,0.96)_100%)] text-[rgba(var(--color-accent),0.96)] hover:scale-[1.01]'
          }`}
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="text-4xl">{isDone ? '🏆' : '👊'}</span>
          <span>{isDone ? '¡Lo lograste!' : '¡Golpea!'}</span>
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-[rgba(var(--color-accent),0.72)]">
        {combo >= 2
          ? `¡Combo x${combo + 1}! Sigue así 🔥`
          : `Golpes: ${tapCount}. ¡No pares, que la barra baja sola!`}
      </p>
    </GameShell>
  )
}