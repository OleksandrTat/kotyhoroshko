import type { ReactNode } from 'react'

export const GAME_SECONDARY_BUTTON_CLASS =
  'inline-flex min-h-12 items-center justify-center rounded-[1.1rem] border border-[rgba(var(--color-accent),0.24)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm font-semibold text-[rgba(var(--color-accent),0.9)] transition-all duration-300 hover:scale-[1.01] hover:bg-[rgba(255,255,255,0.08)]'
export const GAME_PRIMARY_BUTTON_CLASS =
  'button-primary btn-glow inline-flex min-h-12 items-center justify-center rounded-[1.1rem] px-4 py-3 text-sm font-bold hover:scale-[1.02]'

export function GameShell({
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
  children: ReactNode
}) {
  const normalizedProgress =
    typeof progressValue === 'number' ? Math.min(Math.max(progressValue, 0), 100) : null

  return (
    <div className="pointer-events-auto w-full max-w-lg rounded-[1.9rem] border border-[rgba(var(--color-accent),0.34)] bg-[linear-gradient(145deg,rgba(35,21,13,0.94),rgba(18,10,7,0.92))] p-6 text-left shadow-[0_24px_70px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-7">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>
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
