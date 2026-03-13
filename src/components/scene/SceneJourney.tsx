import React from 'react'
import type { Scene } from '@/content/scenes'
import { THEME_META } from './sceneMeta'

export const SceneJourney = React.memo(function SceneJourney({
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
              {meta.label} В· {scene.title}
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
})
