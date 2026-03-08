'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'

type Props = {
  nextSceneId: number
  label?: string
}

const ACTIVATION_KEYS = new Set(['ArrowRight', 'Enter', ' '])

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return Boolean(
    target.closest('button, a, input, textarea, select, [contenteditable="true"]'),
  )
}

export function NextButton({ nextSceneId, label = 'Продовжити' }: Props) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const nextScenePath = `/scene/${nextSceneId}`

  useEffect(() => {
    router.prefetch(nextScenePath)
  }, [nextScenePath, router])

  const handleNavigate = useCallback(() => {
    if (isNavigating) {
      return
    }

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    setIsNavigating(true)
    navigateWithPageTurn(() => {
      router.push(nextScenePath)
    }, { direction: 'forward' })
  }, [isNavigating, nextScenePath, router])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }
      if (!ACTIVATION_KEYS.has(event.key)) {
        return
      }
      if (isInteractiveTarget(event.target)) {
        return
      }

      event.preventDefault()
      handleNavigate()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNavigate])

  return (
    <button
      onClick={handleNavigate}
      className="btn-glow group absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-[rgba(var(--color-accent),0.45)] bg-[linear-gradient(135deg,rgba(var(--color-secondary),0.95),rgba(var(--color-primary),0.96),rgba(var(--color-secondary),0.95))] px-8 py-4 text-lg font-bold text-[#2a170b] shadow-2xl shadow-black/55 transition-all duration-300 hover:scale-[1.04] hover:border-[rgba(var(--color-accent),0.75)] disabled:cursor-not-allowed disabled:opacity-75 sm:px-9 sm:py-4"
      style={{ fontFamily: "'Philosopher', sans-serif" }}
      aria-label="Перейти до наступної сцени"
      aria-keyshortcuts="ArrowRight Enter Space"
      title="Продовжити (→, Enter, Space)"
      disabled={isNavigating}
      type="button"
    >
      <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative z-10">{label}</span>
      <svg
        className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:scale-110 sm:h-6 sm:w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M13 7l5 5m0 0-5 5m5-5H6" />
      </svg>
    </button>
  )
}
