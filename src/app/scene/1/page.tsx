'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NextButton } from '@/components/NextButton'
import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'

export default function Scene1Page() {
  const router = useRouter()
  const [textVisible, setTextVisible] = useState(false)
  const [useVideo, setUseVideo] = useState(true)

  useEffect(() => {
    router.prefetch('/scene/2')
  }, [router])

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 850)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncVideoState = () => setUseVideo(!mediaQuery.matches)

    syncVideoState()
    mediaQuery.addEventListener('change', syncVideoState)
    return () => mediaQuery.removeEventListener('change', syncVideoState)
  }, [])

  return (
    <SceneContainer>
      {useVideo ? (
        <SceneLayer
          media="video"
          src="/scenes/scene-1/video.mp4"
          poster="/scenes/scene-1/background.jpeg"
          alt="Інтерʼєр української хати у мʼякому вечірньому світлі"
          className="z-0 scale-[1.03] animate-fade-in-slow"
          priority
        />
      ) : (
        <SceneLayer
          src="/scenes/scene-1/background.jpeg"
          alt="Інтерʼєр української хати у мʼякому вечірньому світлі"
          className="z-0 scale-[1.05] animate-ken-burns"
          priority
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[rgba(18,11,7,0.92)] via-[rgba(42,23,11,0.4)] to-[rgba(42,23,11,0.12)]" />
      <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_26%_20%,rgba(var(--color-accent),0.18),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 z-[25] bg-[radial-gradient(circle_at_74%_14%,rgba(var(--color-primary),0.12),transparent_40%)]" />

      <SceneLayer
        src="/scenes/scene-1/foreground.png"
        alt="Родина за столом у вечірній хаті"
        className="z-20 animate-fade-in-slow drop-shadow-[0_28px_54px_rgba(0,0,0,0.56)]"
      />

      <div className="pointer-events-none absolute inset-0 z-[25] opacity-30">
        <div className="animate-pulse-slow absolute left-[24%] top-0 h-full w-[2px] bg-gradient-to-b from-[rgba(var(--color-accent),0.4)] to-transparent blur-2xl" />
        <div
          className="animate-pulse-slow absolute right-[28%] top-0 h-full w-[2px] bg-gradient-to-b from-[rgba(var(--color-primary),0.36)] to-transparent blur-2xl"
          style={{ animationDelay: '1.2s' }}
        />
      </div>

      <div className="absolute left-[calc(1rem+env(safe-area-inset-left))] top-[calc(1rem+env(safe-area-inset-top))] z-40 flex items-center gap-3 animate-fade-in">
        <div className="relative h-12 w-12 rounded-full border border-[rgba(var(--color-accent),0.56)] bg-[rgba(var(--color-secondary),0.42)] shadow-lg shadow-black/45">
          <div className="animate-pulse-slow absolute inset-0 rounded-full bg-[rgba(var(--color-primary),0.24)]" />
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[rgba(var(--color-accent),0.98)]">1</span>
        </div>
        <div className="rounded-full border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-3 py-1.5 backdrop-blur-sm">
          <p className="text-sm font-semibold text-[rgba(var(--color-accent),0.94)]">Початок історії</p>
        </div>
      </div>

      <div
        className={`story-panel-wrap absolute bottom-[calc(6.7rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] right-[calc(1rem+env(safe-area-inset-right))] z-30 transition-all duration-700 sm:left-[calc(1.5rem+env(safe-area-inset-left))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] md:left-[calc(3rem+env(safe-area-inset-left))] md:right-auto ${
          textVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="story-panel depth-shadow relative p-5 sm:p-6 md:p-7">
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(var(--color-accent),0.08),transparent_45%,rgba(var(--color-primary),0.08))]" />
          <p className="story-text relative text-left font-medium text-[rgba(var(--color-accent),0.95)]">
            Жили собі чоловік та жінка. Було в них семеро синів і одна донька.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-40 h-2 bg-[rgba(18,11,7,0.7)] backdrop-blur-sm">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={10}
          aria-label="Прогрес історії: 10 відсотків"
          className="animate-progress h-full bg-[linear-gradient(to_right,rgba(var(--color-secondary),0.96),rgba(var(--color-primary),0.98),rgba(var(--color-secondary),0.96))]"
          style={{ width: '10%' }}
        />
      </div>

      <NextButton nextSceneId={2} />

      <div className="pointer-events-none absolute bottom-[calc(7rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-30 animate-bounce-slow text-[rgba(var(--color-accent),0.72)]">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
        </svg>
      </div>
    </SceneContainer>
  )
}
