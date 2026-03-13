import React from 'react'
import type { Scene } from '@/content/scenes'
import { THEME_META } from './sceneMeta'

export const SceneHud = React.memo(function SceneHud({
  scene,
  progressValue,
}: {
  scene: Scene
  progressValue: number
}) {
  const meta = THEME_META[scene.theme]
  const isInteractive = scene.media.kind === 'video' && Boolean(scene.videoGame)

  return (
    <div data-gsap="hud" className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex max-w-[min(28rem,calc(100vw-8.5rem))] flex-col gap-3">
      <div className="glass-panel rounded-[1.5rem] px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(var(--color-accent),0.42)] bg-[rgba(var(--color-secondary),0.2)] text-lg font-bold text-[rgba(var(--color-accent),0.96)]">
            <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(var(--color-primary),0.2),transparent_70%)]" />
            <span className="relative">{scene.id}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.62)]">
              {meta.label} В· {Math.round(progressValue)}%
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
})
