'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'

type Props = {
  nextSceneId?: number
  href?: string
  label?: string
  direction?: 'forward' | 'backward'
}

const ACTIVATION_KEYS = new Set(['ArrowRight', 'Enter', ' '])

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(target.closest('button, a, input, textarea, select, [contenteditable="true"]'))
}

function hasOpenStoryModal() {
  if (typeof document === 'undefined') {
    return false
  }

  return Boolean(document.querySelector('[data-story-modal="true"]'))
}

export function NextButton({
  nextSceneId,
  href,
  label = 'Continuar',
  direction = 'forward',
}: Props) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const targetPath = href ?? (typeof nextSceneId === 'number' ? `/scene/${nextSceneId}` : null)

  useEffect(() => {
    if (!targetPath) {
      return
    }

    router.prefetch(targetPath)
  }, [targetPath, router])

  const handleNavigate = useCallback(() => {
    if (isNavigating || !targetPath) {
      return
    }

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    setIsNavigating(true)
    navigateWithPageTurn(() => {
      router.push(targetPath)
    }, { direction })
  }, [direction, isNavigating, router, targetPath])

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
      if (hasOpenStoryModal()) {
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
      className="button-primary btn-glow group absolute z-40 inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold shadow-2xl shadow-black/55 transition-all duration-300 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-75 sm:px-9 sm:py-4"
      style={{
        bottom: 'calc(2rem + env(safe-area-inset-bottom))',
        right: 'calc(1.25rem + env(safe-area-inset-right))',
        fontFamily: 'var(--font-body)',
      }}
      aria-label={label}
      aria-keyshortcuts="ArrowRight Enter Space"
      title={`${label} (ArrowRight, Enter, Space)`}
      disabled={isNavigating || !targetPath}
      type="button"
    >
      <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="animate-accent-sweep absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-70" />
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
