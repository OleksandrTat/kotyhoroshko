'use client'

import type { Scene } from '@/content/scenes'

type Chapter = {
  start: number
  label: string
  mood: string
}

type Props = {
  chapters: readonly Chapter[]
  scenes: Scene[]
  activeSceneId: number
  onSelectScene: (sceneId: number) => void
}

export function ChapterProgressBar({ chapters, scenes, activeSceneId, onSelectScene }: Props) {
  const groups = chapters.map((chapter, index) => {
    const startIndex = chapter.start - 1
    const endIndex = index < chapters.length - 1 ? chapters[index + 1].start - 1 : scenes.length
    return {
      chapter,
      scenes: scenes.slice(startIndex, endIndex),
    }
  })

  return (
    <div className="chapter-progress-bar">
      <div className="flex items-center gap-3">
        {groups.map((group, groupIndex) => (
          <div key={group.chapter.start} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {group.scenes.map((scene) => {
                  const reached = scene.id < activeSceneId
                  const active = scene.id === activeSceneId
                  const stateClass = active ? 'active' : reached ? 'reached' : 'future'

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => onSelectScene(scene.id)}
                      className={`scene-dot ${stateClass} relative group`}
                      aria-label={`Ir a escena ${scene.id}: ${scene.title}`}
                    >
                      <span className="sr-only">Escena {scene.id}</span>
                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[rgba(255,225,174,0.2)] bg-[rgba(10,6,4,0.9)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[rgba(var(--color-accent),0.86)] opacity-0 shadow-[0_12px_24px_rgba(0,0,0,0.3)] transition-opacity duration-200 group-hover:opacity-100">
                        {scene.title}
                      </span>
                    </button>
                  )
                })}
              </div>
              <span className="text-[9px] uppercase tracking-[0.26em] text-[rgba(var(--color-accent),0.58)]">
                {group.chapter.label}
              </span>
            </div>
            {groupIndex < groups.length - 1 ? <span className="chapter-sep" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
