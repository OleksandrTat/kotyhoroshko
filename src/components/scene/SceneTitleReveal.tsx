import React from 'react'
import type { Scene } from '@/content/scenes'
import { THEME_META } from './sceneMeta'

export const SceneTitleReveal = React.memo(function SceneTitleReveal({
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
      <div data-gsap="title" className="animate-title-card rounded-[2rem] border border-[rgba(var(--color-accent),0.2)] bg-[linear-gradient(145deg,rgba(17,9,6,0.78),rgba(8,4,3,0.64))] px-8 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.34em] text-[rgba(var(--color-accent),0.6)]">
          Escena {scene.id} В· {meta.label}
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
})
