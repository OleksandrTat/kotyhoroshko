'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { navigateWithPageTurn } from '@/lib/pageTurn'
import { SceneTransition } from '@/components/SceneTransition'

type Props = {
  children: React.ReactNode
}

type TextSize = 'normal' | 'large' | 'xlarge'

const TEXT_SIZE_OPTIONS: Array<{ id: TextSize; label: string; ariaLabel: string }> = [
  { id: 'normal', label: 'A', ariaLabel: 'Звичайний розмір тексту' },
  { id: 'large', label: 'A+', ariaLabel: 'Збільшений розмір тексту' },
  { id: 'xlarge', label: 'A++', ariaLabel: 'Дуже великий розмір тексту' },
]

export function SceneContainer({ children }: Props) {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [textSize, setTextSize] = useState<TextSize>('normal')
  const [readingMode, setReadingMode] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    router.prefetch('/')
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedSize = window.localStorage.getItem('story-text-size')
    const storedReading = window.localStorage.getItem('story-reading-mode')
    const rafId = window.requestAnimationFrame(() => {
      if (storedSize === 'normal' || storedSize === 'large' || storedSize === 'xlarge') {
        setTextSize(storedSize)
      }
      if (storedReading === 'true' || storedReading === 'false') {
        setReadingMode(storedReading === 'true')
      }
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem('story-text-size', textSize)
  }, [textSize])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem('story-reading-mode', String(readingMode))
  }, [readingMode])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.textSize = textSize
    root.dataset.reading = readingMode ? 'on' : 'off'

    return () => {
      delete root.dataset.textSize
      delete root.dataset.reading
    }
  }, [textSize, readingMode])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleGoHome = useCallback(() => {
    navigateWithPageTurn(() => {
      router.push('/')
    }, { direction: 'backward' })
  }, [router])

  return (
    <div
      className={`relative min-h-[100svh] w-full overflow-hidden bg-black transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
      <SceneTransition />

      {readingMode ? (
        <div className="pointer-events-none absolute inset-0 z-[25] bg-black/40 backdrop-blur-[1px]" />
      ) : null}

      <div className="absolute right-[calc(1.1rem+env(safe-area-inset-right))] top-[calc(1.1rem+env(safe-area-inset-top))] z-50 flex items-center gap-3">
        <button
          onClick={handleGoHome}
          className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-[rgba(var(--color-accent),0.92)] transition-transform duration-300 hover:scale-110"
          aria-label="Повернутися на головну сторінку"
          title="На головну"
          type="button"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
            />
          </svg>
        </button>

        <button
          onClick={() => setMenuOpen((value) => !value)}
          className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-[rgba(var(--color-accent),0.92)] transition-transform duration-300 hover:scale-110"
          aria-expanded={menuOpen}
          aria-controls="scene-settings"
          aria-label="Відкрити налаштування читання"
          title="Налаштування читання"
          type="button"
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      <section
        id="scene-settings"
        className={`glass-panel absolute right-[calc(1.1rem+env(safe-area-inset-right))] top-[calc(4.9rem+env(safe-area-inset-top))] z-[70] w-[22rem] max-w-[calc(100vw-2.2rem)] rounded-2xl border-[rgba(var(--color-accent),0.3)] p-5 transition-all duration-300 ${
          menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
        aria-hidden={!menuOpen}
        aria-label="Панель налаштувань читання"
      >
        <h2
          className="text-2xl text-[rgba(var(--color-accent),0.96)]"
          style={{ fontFamily: "'Marck Script', cursive" }}
        >
          Налаштування читання
        </h2>

        <div className="mt-4 space-y-5 text-[rgba(var(--color-accent),0.86)]" style={{ fontFamily: "'Philosopher', sans-serif" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[rgba(var(--color-accent),0.95)]">Режим читання</p>
              <p className="text-xs text-[rgba(var(--color-accent),0.74)]">Менше яскравості, більше фокусу на тексті</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={readingMode}
              aria-label="Увімкнути або вимкнути режим читання"
              onClick={() => setReadingMode((value) => !value)}
              className={`relative h-7 w-14 rounded-full border transition-colors duration-300 ${
                readingMode
                  ? 'border-[rgba(var(--color-accent),0.7)] bg-[rgba(var(--color-primary),0.86)]'
                  : 'border-[rgba(var(--color-accent),0.28)] bg-[rgba(var(--color-secondary),0.35)]'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-[rgba(var(--color-accent),0.98)] shadow transition-transform duration-300 ${
                  readingMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[rgba(var(--color-accent),0.62)]">Розмір тексту</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {TEXT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTextSize(option.id)}
                  aria-pressed={textSize === option.id}
                  aria-label={option.ariaLabel}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                    textSize === option.id
                      ? 'border-[rgba(var(--color-accent),0.72)] bg-[rgba(var(--color-secondary),0.45)] text-[rgba(var(--color-accent),0.98)]'
                      : 'border-[rgba(var(--color-accent),0.3)] bg-[rgba(var(--color-secondary),0.2)] text-[rgba(var(--color-accent),0.78)] hover:border-[rgba(var(--color-accent),0.58)] hover:text-[rgba(var(--color-accent),0.95)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[rgba(var(--color-accent),0.66)]">
            <span>Швидкі клавіші:</span>
            <span className="rounded border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-2 py-0.5">→</span>
            <span className="rounded border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-2 py-0.5">Enter</span>
            <span className="rounded border border-[rgba(var(--color-accent),0.32)] bg-[rgba(var(--color-secondary),0.28)] px-2 py-0.5">Space</span>
          </div>

          <button
            onClick={handleGoHome}
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(var(--color-accent),0.42)] bg-[rgba(var(--color-secondary),0.34)] px-4 py-2.5 text-sm font-semibold text-[rgba(var(--color-accent),0.95)] transition-colors duration-300 hover:bg-[rgba(var(--color-secondary),0.45)]"
            aria-label="Повернутися на головну сторінку"
          >
            На головну
          </button>
        </div>
      </section>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Закрити панель налаштувань"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 z-[60] bg-black/45"
        />
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-[80] bg-black transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-[rgba(var(--color-accent),0.24)] border-t-[rgba(var(--color-accent),0.95)]" />
            <div className="animate-spin-reverse absolute inset-1 rounded-full border-2 border-[rgba(var(--color-primary),0.28)] border-b-[rgba(var(--color-primary),0.9)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
