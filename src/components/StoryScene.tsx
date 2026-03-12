'use client'

import { Suspense, lazy, useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { NextButton } from '@/components/NextButton'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import WeatherEffect from '@/components/WeatherEffect'
import { TOTAL_SCENES, type Scene, type SceneTheme, type VideoGame } from '@/content/scenes'
import { cancelBrowserNarration, speakWithBrowserVoice } from '@/lib/storyNarration'

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

type GamePoint = { x: number; y: number }

const COLLECT_TARGETS = [
  { x: 0.16, y: 0.24, ax: 0.08, ay: 0.06, speed: 1.35, phase: 0.15, size: 58 },
  { x: 0.32, y: 0.64, ax: 0.06, ay: 0.08, speed: 1.05, phase: 0.8, size: 64 },
  { x: 0.48, y: 0.36, ax: 0.09, ay: 0.05, speed: 1.55, phase: 1.4, size: 54 },
  { x: 0.62, y: 0.72, ax: 0.08, ay: 0.05, speed: 1.2, phase: 2.1, size: 60 },
  { x: 0.76, y: 0.24, ax: 0.07, ay: 0.08, speed: 1.45, phase: 2.8, size: 62 },
  { x: 0.84, y: 0.56, ax: 0.05, ay: 0.06, speed: 1.7, phase: 3.4, size: 56 },
] as const

const TRAIL_TARGETS = [
  { x: 0.14, y: 0.76 },
  { x: 0.3, y: 0.58 },
  { x: 0.46, y: 0.66 },
  { x: 0.6, y: 0.44 },
  { x: 0.78, y: 0.24 },
] as const

const DRAG_TOKEN_SIZE = 76
const DRAG_START = { x: 0.1, y: 0.74 } as const
const DRAG_CHECKPOINTS = [
  { x: 0.3, y: 0.68 },
  { x: 0.46, y: 0.44 },
  { x: 0.66, y: 0.56 },
] as const
const DRAG_GOAL_POINT = { x: 0.82, y: 0.22 } as const
const GAME_SECONDARY_BUTTON_CLASS =
  'inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-[rgba(var(--color-accent),0.24)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm font-semibold text-[rgba(var(--color-accent),0.9)] transition-all duration-300 hover:scale-[1.01] hover:bg-[rgba(255,255,255,0.08)]'
const GAME_PRIMARY_BUTTON_CLASS =
  'button-primary btn-glow inline-flex min-h-12 items-center justify-center rounded-[1.1rem] px-4 py-3 text-sm font-bold hover:scale-[1.02]'

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function distanceBetween(a: GamePoint, b: GamePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function distanceToSegment(point: GamePoint, start: GamePoint, end: GamePoint) {
  const dx = end.x - start.x
  const dy = end.y - start.y

  if (dx === 0 && dy === 0) {
    return distanceBetween(point, start)
  }

  const ratio = clampValue(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy),
    0,
    1,
  )

  return distanceBetween(point, {
    x: start.x + dx * ratio,
    y: start.y + dy * ratio,
  })
}

function getNormalizedPoint(rect: DOMRect, clientX: number, clientY: number): GamePoint {
  return {
    x: clampValue((clientX - rect.left) / rect.width, 0, 1),
    y: clampValue((clientY - rect.top) / rect.height, 0, 1),
  }
}

function toViewBoxPoint(point: GamePoint) {
  return `${point.x * 100},${point.y * 100}`
}

function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!active || !container) {
      return
    }

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))

    const focusables = getFocusable()
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    if (first) {
      first.focus()
    } else {
      container.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const activeElement = document.activeElement
      const firstElement = focusable[0]
      const lastElement = focusable[focusable.length - 1]

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active, containerRef])
}

const THEME_META: Record<
  SceneTheme,
  { label: string; mood: string; hint: string; moteClass: string }
> = {
  hearth: {
    label: 'Hogar',
    mood: 'La historia empieza junto al fuego.',
    hint: 'Lee con calma y mueve el texto si tapa la escena.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,214,132,0.95),rgba(214,134,76,0.18)_60%,transparent_100%)]',
  },
  field: {
    label: 'Campo',
    mood: 'Todo parece tranquilo antes del giro del cuento.',
    hint: 'Observa el trabajo del campo antes de continuar.',
    moteClass: 'bg-[radial-gradient(circle,rgba(232,212,140,0.92),rgba(168,138,72,0.16)_60%,transparent_100%)]',
  },
  forest: {
    label: 'Bosque',
    mood: 'El camino se vuelve incierto.',
    hint: 'Busca pistas en la imagen y en los movimientos del fondo.',
    moteClass: 'bg-[radial-gradient(circle,rgba(170,224,158,0.9),rgba(68,132,98,0.15)_60%,transparent_100%)]',
  },
  dragon: {
    label: 'Dragon',
    mood: 'La amenaza ya esta cerca.',
    hint: 'Cuando aparezca un reto, complétalo para seguir.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,162,122,0.94),rgba(168,58,34,0.16)_60%,transparent_100%)]',
  },
  dungeon: {
    label: 'Mazmorra',
    mood: 'La luz casi desaparece.',
    hint: 'Activa el modo lectura si quieres mas foco en el texto.',
    moteClass: 'bg-[radial-gradient(circle,rgba(180,197,240,0.88),rgba(88,100,144,0.16)_60%,transparent_100%)]',
  },
  wonder: {
    label: 'Magia',
    mood: 'El cuento respira asombro.',
    hint: 'Deja que la escena aparezca antes de tocar nada.',
    moteClass: 'bg-[radial-gradient(circle,rgba(197,245,192,0.92),rgba(124,170,114,0.15)_60%,transparent_100%)]',
  },
  forge: {
    label: 'Forja',
    mood: 'La fuerza se construye paso a paso.',
    hint: 'Cada escena prepara el combate final.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,190,138,0.92),rgba(170,92,42,0.16)_60%,transparent_100%)]',
  },
  sky: {
    label: 'Cielo',
    mood: 'Todo se vuelve mas grande.',
    hint: 'La historia sube de escala en estas escenas.',
    moteClass: 'bg-[radial-gradient(circle,rgba(188,214,255,0.9),rgba(92,122,180,0.14)_60%,transparent_100%)]',
  },
  trail: {
    label: 'Huella',
    mood: 'El viaje sigue marcado sobre la tierra.',
    hint: 'Sigue el recorrido sin perder el hilo.',
    moteClass: 'bg-[radial-gradient(circle,rgba(224,205,136,0.9),rgba(134,112,62,0.14)_60%,transparent_100%)]',
  },
  duel: {
    label: 'Duelo',
    mood: 'La tension ya no se puede detener.',
    hint: 'Cada escena aqui empuja la historia hacia el choque final.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,174,138,0.92),rgba(182,76,48,0.16)_60%,transparent_100%)]',
  },
  escape: {
    label: 'Huida',
    mood: 'Nada se queda quieto al final.',
    hint: 'Mantente atento: el peligro sigue en movimiento.',
    moteClass: 'bg-[radial-gradient(circle,rgba(198,208,255,0.9),rgba(112,124,182,0.14)_60%,transparent_100%)]',
  },
}

const MOTE_LAYOUT = [
  { top: '12%', left: '18%', size: 10, delay: '0.2s', duration: '9s' },
  { top: '22%', left: '72%', size: 8, delay: '1.4s', duration: '11s' },
  { top: '34%', left: '52%', size: 12, delay: '2.2s', duration: '10s' },
  { top: '58%', left: '16%', size: 7, delay: '3.3s', duration: '12s' },
  { top: '68%', left: '78%', size: 11, delay: '1s', duration: '8.5s' },
  { top: '80%', left: '38%', size: 9, delay: '2.8s', duration: '10.5s' },
] as const

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

function SceneMotes({ theme }: { theme: SceneTheme }) {
  const meta = THEME_META[theme]

  return (
    <div className="pointer-events-none absolute inset-0 z-[14] overflow-hidden">
      {MOTE_LAYOUT.map((mote, index) => (
        <span
          key={`${theme}-${index}`}
          className={`scene-mote absolute rounded-full blur-[1px] ${meta.moteClass}`}
          style={{
            top: mote.top,
            left: mote.left,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
    </div>
  )
}

function SceneTitleReveal({
  scene,
  visible,
}: {
  scene: Scene
  visible: boolean
}) {
  const meta = THEME_META[scene.theme]

  if (!visible) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[36] flex items-center justify-center p-6">
      <div className="animate-title-card rounded-[2rem] border border-[rgba(var(--color-accent),0.2)] bg-[linear-gradient(145deg,rgba(17,9,6,0.78),rgba(8,4,3,0.64))] px-8 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.34em] text-[rgba(var(--color-accent),0.6)]">
          Escena {scene.id} · {meta.label}
        </p>
        <h2 className="mt-4 text-4xl text-[rgba(var(--color-accent),0.98)] sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          {scene.title}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[rgba(var(--color-accent),0.66)] sm:text-base">
          {meta.mood}
        </p>
      </div>
    </div>
  )
}

function SceneHud({
  scene,
  progressValue,
}: {
  scene: Scene
  progressValue: number
}) {
  const meta = THEME_META[scene.theme]
  const isInteractive = scene.media.kind === 'video' && Boolean(scene.videoGame)

  return (
    <div className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex max-w-[min(28rem,calc(100vw-8.5rem))] animate-hud-slide flex-col gap-3">
      <div className="glass-panel rounded-[1.5rem] px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(var(--color-accent),0.42)] bg-[rgba(var(--color-secondary),0.2)] text-lg font-bold text-[rgba(var(--color-accent),0.96)]">
            <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(var(--color-primary),0.2),transparent_70%)]" />
            <span className="relative">{scene.id}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.62)]">
              {meta.label} · {Math.round(progressValue)}%
            </p>
            <p className="mt-1 text-base font-semibold text-[rgba(var(--color-accent),0.96)] sm:text-lg">
              {scene.title}
            </p>
            <p className="mt-1 text-sm text-[rgba(var(--color-accent),0.68)]">{meta.mood}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
            <span className="animate-soft-pulse rounded-full border border-[rgba(var(--color-accent),0.16)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">
              {scene.media.kind === 'video' ? 'Escena en movimiento' : 'Escena para leer'}
            </span>
          {isInteractive ? (
            <span className="rounded-full border border-[rgba(205,255,170,0.22)] bg-[rgba(112,188,54,0.14)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[rgba(205,255,170,0.86)]">
              Juego breve
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function StoryGuide({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div className="absolute bottom-[calc(7rem+env(safe-area-inset-bottom))] left-1/2 z-[37] w-[min(92vw,28rem)] -translate-x-1/2 animate-fade-in-up">
      <div className="glass-panel rounded-[1.35rem] border-[rgba(var(--color-accent),0.22)] px-4 py-3 text-[rgba(var(--color-accent),0.88)] shadow-[0_16px_36px_rgba(0,0,0,0.32)]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--color-secondary),0.26)] text-sm font-bold text-[rgba(var(--color-accent),0.95)]">
            i
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.62)]">Guia rapida</p>
            <p className="mt-1 text-sm leading-relaxed sm:text-base">{message}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(var(--color-accent),0.16)] bg-[rgba(255,255,255,0.03)] text-[rgba(var(--color-accent),0.74)] hover:bg-[rgba(255,255,255,0.08)]"
            aria-label="Cerrar ayuda"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

function SceneJourney({
  scene,
  progressValue,
}: {
  scene: Scene
  progressValue: number
}) {
  const meta = THEME_META[scene.theme]
  const milestones = [1, 7, 14, 21, 28]

  return (
    <div className="pointer-events-none absolute bottom-[calc(1.35rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] z-[34] hidden w-[min(28rem,calc(100vw-9rem))] lg:block">
      <div className="glass-panel rounded-[1.35rem] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.58)]">Recorrido</p>
            <p className="mt-1 truncate text-base text-[rgba(var(--color-accent),0.94)]">
              {meta.label} · {scene.title}
            </p>
          </div>
          <p className="text-sm text-[rgba(var(--color-accent),0.7)]">{Math.round(progressValue)}%</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {milestones.map((milestone) => {
            const active = scene.id >= milestone

            return (
              <span
                key={milestone}
                className={`h-2 flex-1 rounded-full ${
                  active
                    ? 'bg-[linear-gradient(90deg,rgba(255,225,174,0.92),rgba(214,134,76,0.9))]'
                    : 'bg-[rgba(255,255,255,0.08)]'
                }`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function GameShell({
  title,
  description,
  badge,
  status,
  successText,
  helperText = 'Ayuda a Kotyhoroshko con este reto corto. Si quieres, puedes volver a empezar o cerrar el juego y seguir el cuento.',
  progressValue,
  onRestart,
  onClose,
  closeLabel = 'Seguir sin jugar',
  children,
}: {
  title: string
  description: string
  badge: string
  status?: string
  successText?: string
  helperText?: string
  progressValue?: number
  onRestart?: () => void
  onClose?: () => void
  closeLabel?: string
  children: React.ReactNode
}) {
  const normalizedProgress =
    typeof progressValue === 'number' ? Math.min(Math.max(progressValue, 0), 100) : null

  return (
    <div className="pointer-events-auto w-full max-w-lg rounded-[1.9rem] border border-[rgba(var(--color-accent),0.34)] bg-[linear-gradient(145deg,rgba(35,21,13,0.94),rgba(18,10,7,0.92))] p-6 text-left shadow-[0_24px_70px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.2)] bg-[rgba(var(--color-secondary),0.22)] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.74)]">
            {badge}
          </span>
          <h2 className="mt-4 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar mini juego"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--color-accent),0.18)] bg-[rgba(255,255,255,0.04)] text-[rgba(var(--color-accent),0.88)] transition-all duration-300 hover:scale-105 hover:bg-[rgba(255,255,255,0.08)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        ) : null}
      </div>
      <p className="mt-4 text-base leading-relaxed text-[rgba(var(--color-accent),0.86)] sm:text-lg">{description}</p>
      <div className="mt-4 rounded-[1.35rem] border border-[rgba(var(--color-accent),0.14)] bg-[linear-gradient(145deg,rgba(255,225,174,0.08),rgba(255,255,255,0.02))] px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--color-secondary),0.24)] text-sm font-bold text-[rgba(var(--color-accent),0.95)]">
            *
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.62)]">Pausa de cuento</p>
            <p className="mt-2 text-sm leading-relaxed text-[rgba(var(--color-accent),0.84)] sm:text-base">{helperText}</p>
          </div>
        </div>

        {normalizedProgress !== null ? (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.62)]">
              <span>Progreso</span>
              <span>{Math.round(normalizedProgress)}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(255,236,204,0.98),rgba(244,188,85,0.96),rgba(214,134,76,0.94))] transition-[width] duration-300"
                style={{ width: `${normalizedProgress}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
      {status ? <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">{status}</p> : null}
      <div className="mt-5">{children}</div>
      {successText ? <p className="mt-5 text-sm uppercase tracking-[0.22em] text-[rgba(205,255,170,0.86)]">{successText}</p> : null}
      {onRestart || onClose ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {onRestart ? (
            <button type="button" onClick={onRestart} className={GAME_SECONDARY_BUTTON_CLASS}>
              Empezar de nuevo
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} className={onRestart ? GAME_SECONDARY_BUTTON_CLASS : GAME_PRIMARY_BUTTON_CLASS}>
              {closeLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function CollectGameOverlay({
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
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 650)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

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

function TrailGameOverlay({
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
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 650)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

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
        className="relative h-64 overflow-hidden rounded-[1.6rem] border border-[rgba(var(--color-accent),0.18)] bg-[linear-gradient(180deg,rgba(13,15,9,0.94),rgba(6,8,5,0.98))]"
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

function DragGameOverlay({
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
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 650)
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
          const active = index === nextCheckpoint && !isDone

          return (
            <div
              key={index}
              className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                reached
                  ? 'border-[rgba(205,255,170,0.92)] bg-[rgba(112,188,54,0.86)] shadow-[0_0_18px_rgba(152,226,79,0.55)]'
                  : active
                    ? 'animate-soft-pulse border-[rgba(var(--color-accent),0.82)] bg-[rgba(var(--color-secondary),0.72)]'
                    : 'border-[rgba(var(--color-accent),0.34)] bg-[rgba(255,255,255,0.05)]'
              }`}
              style={{ left: `${checkpoint.x * 100}%`, top: `${checkpoint.y * 100}%` }}
            />
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

function HoldGameOverlay({
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
    if (!isDone || completeRef.current) {
      return
    }

    completeRef.current = true
    const timeoutId = window.setTimeout(onComplete, 650)
    return () => window.clearTimeout(timeoutId)
  }, [isDone, onComplete])

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

function VideoChallengeOverlay({
  game,
  onComplete,
  onRestart,
  onClose,
}: {
  game: VideoGame
  onComplete: () => void
  onRestart: () => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

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

  useFocusTrap(true, dialogRef)

  return (
    <div
      ref={dialogRef}
      data-story-modal="true"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="animate-fade-in absolute inset-0 z-[58] flex items-center justify-center bg-[rgba(4,2,1,0.36)] p-4 backdrop-blur-[3px]"
    >
      {game.type === 'collect' ? <CollectGameOverlay game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'trail' ? <TrailGameOverlay game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'drag' ? <DragGameOverlay game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
      {game.type === 'hold' ? <HoldGameOverlay game={game} onComplete={onComplete} onRestart={onRestart} onClose={onClose} /> : null}
    </div>
  )
}

const LazyVideoChallengeOverlay = lazy(async () => ({ default: VideoChallengeOverlay }))

function EndedVideoOverlay({
  title,
  onReplay,
  onClose,
}: {
  title: string
  onReplay: () => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

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

  useFocusTrap(true, dialogRef)

  return (
    <div
      ref={dialogRef}
      data-story-modal="true"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
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

function DraggableStoryPanel({
  scene,
  visible,
}: {
  scene: Scene
  visible: boolean
}) {
  const meta = THEME_META[scene.theme]
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isNarrating, setIsNarrating] = useState(false)

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

  useEffect(() => {
    setExpanded(false)
    setIsNarrating(false)
    cancelBrowserNarration()
  }, [scene.id])

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

  const handleNarrate = useCallback(() => {
    if (isNarrating) {
      cancelBrowserNarration()
      setIsNarrating(false)
      return
    }

    cancelBrowserNarration()
    speakWithBrowserVoice({
      text: scene.text.join(' '),
      theme: scene.theme,
      onStart: () => setIsNarrating(true),
      onEnd: () => setIsNarrating(false),
    })
  }, [isNarrating, scene])

  const alignedClass =
    scene.panelAlign === 'right'
      ? 'md:left-auto md:right-[calc(2rem+env(safe-area-inset-right))]'
      : 'md:left-[calc(2rem+env(safe-area-inset-left))] md:right-auto'

  return (
    <div
      ref={panelRef}
      className={`absolute bottom-[calc(6.7rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-[26] transition-all duration-700 sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] ${position ? '' : alignedClass} ${
        visible ? 'animate-panel-rise opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto', width: 'min(92vw, 32rem)' } : undefined}
    >
      <div className={`story-panel depth-shadow relative rounded-[2rem] border border-[rgba(var(--color-accent),0.28)] bg-[linear-gradient(145deg,rgba(26,14,10,0.9),rgba(11,6,4,0.92))] p-5 sm:p-6 md:p-7 ${isDragging ? 'shadow-[0_34px_90px_rgba(0,0,0,0.62)]' : ''}`}>
        <span className="pointer-events-none absolute inset-y-4 left-0 w-[3px] rounded-full bg-[linear-gradient(180deg,rgba(255,236,204,0.9),rgba(214,134,76,0.6))]" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />

        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          aria-label="Arrastrar el cuadro de texto"
          className={`absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(var(--color-secondary),0.2)] px-4 py-1 text-[10px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.74)] ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:bg-[rgba(var(--color-secondary),0.3)]'}`}
          style={{ touchAction: 'none' }}
        >
          ⋮⋮⋮
        </button>

        <div className="relative flex items-start justify-between gap-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.68)]">Escena {scene.id} de {TOTAL_SCENES}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.52)]">{meta.label}</p>
            <h1 className="mt-3 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
              {scene.title}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(255,255,255,0.04)] text-xs text-[rgba(var(--color-accent),0.8)] hover:bg-[rgba(255,255,255,0.1)]"
            aria-pressed={expanded}
            aria-label={expanded ? 'Contraer panel de historia' : 'Expandir panel de historia'}
          >
            ↕
          </button>
        </div>

        <div className="relative mt-4 rounded-[1.25rem] border border-[rgba(var(--color-accent),0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[rgba(var(--color-accent),0.62)]">
          {meta.hint}
        </div>

        <div className={`relative mt-5 space-y-4 pr-2 ${expanded ? '' : 'story-scroll-mask max-h-[min(42svh,25rem)] overflow-y-auto'}`}>
          {scene.text.map((paragraph) => (
            <p key={paragraph} className="story-text text-left font-medium text-[rgba(var(--color-accent),0.95)]">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleNarrate}
            aria-pressed={isNarrating}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors duration-300 ${
              isNarrating
                ? 'border-[rgba(205,255,170,0.35)] bg-[rgba(50,98,52,0.35)] text-[rgba(231,255,230,0.92)]'
                : 'border-[rgba(var(--color-accent),0.22)] bg-[rgba(255,255,255,0.04)] text-[rgba(var(--color-accent),0.86)] hover:bg-[rgba(255,255,255,0.12)]'
            }`}
          >
            {isNarrating ? 'Detener narracion' : 'Narrar esto 🔊'}
          </button>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-xs uppercase tracking-[0.22em] text-[rgba(var(--color-accent),0.8)] hover:bg-[rgba(255,255,255,0.12)]"
          >
            {expanded ? 'Contraer' : 'Expandir'}
          </button>
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

  const handleRestartChallenge = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }

    setChallengeKey((current) => current + 1)
    setVideoStage('challenge')
  }, [])

  const handleCloseChallenge = useCallback(() => {
    setVideoStage('playing')
    playVideo()
  }, [playVideo])

  const handleCloseEnded = useCallback(() => {
    setVideoStage('playing')
  }, [])

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
        <Suspense
          fallback={
            <div className="absolute inset-0 z-[58] flex items-center justify-center bg-[rgba(5,3,2,0.35)] text-sm text-[rgba(var(--color-accent),0.82)]">
              Preparando el reto…
            </div>
          }
        >
          <LazyVideoChallengeOverlay
            key={challengeKey}
            game={game}
            onRestart={handleRestartChallenge}
            onClose={handleCloseChallenge}
            onComplete={() => {
              setVideoStage('playing')
              playVideo()
            }}
          />
        </Suspense>
      ) : null}

      {videoStage === 'ended' ? <EndedVideoOverlay title={scene.title} onReplay={handleReplay} onClose={handleCloseEnded} /> : null}
    </>
  )
}

export function StoryScene({ scene }: { scene: Scene }) {
  const [textVisible, setTextVisible] = useState(false)
  const [guideMessage, setGuideMessage] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [scene.id])

  useEffect(() => {
    return () => cancelBrowserNarration()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    const guideKey = scene.media.kind === 'video' && scene.videoGame ? 'story-guide-video' : 'story-guide-reading'
    const existingGuide = window.localStorage.getItem(guideKey)
    const rafId = window.requestAnimationFrame(() => {
      if (existingGuide) {
        setGuideMessage(null)
        return
      }

      const message =
        scene.media.kind === 'video' && scene.videoGame
          ? 'Esta escena se detiene para jugar un momento. Aqui puedes tocar, arrastrar o dibujar un camino antes de seguir con el cuento.'
          : 'Puedes arrastrar el cuadro de texto si tapa una parte importante de la ilustracion.'

      setGuideMessage(message)
      window.localStorage.setItem(guideKey, 'seen')
    })
    const timeoutId = window.setTimeout(() => setGuideMessage(null), 5600)
    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(timeoutId)
    }
  }, [scene.id, scene.media.kind, scene.videoGame])

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
        <SceneMotes theme={scene.theme} />

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

        <WeatherEffect type={scene.weather?.type ?? 'none'} intensity={scene.weather?.intensity ?? 'medium'} />

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[rgba(8,7,7,0.96)] via-[rgba(20,14,10,0.38)] to-[rgba(12,10,9,0.08)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(var(--color-accent),0.12),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_78%_82%,rgba(var(--color-primary),0.1),transparent_44%)]" />
      </div>

      <SceneHud scene={scene} progressValue={progressValue} />
      <SceneTitleReveal key={`title-${scene.id}`} scene={scene} visible={!prefersReducedMotion} />

      <DraggableStoryPanel scene={scene} visible={textVisible} />
      {guideMessage ? <StoryGuide message={guideMessage} onDismiss={() => setGuideMessage(null)} /> : null}
      <SceneJourney scene={scene} progressValue={progressValue} />

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
