type ViewTransition = {
  finished: Promise<void>
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void | Promise<void>) => ViewTransition
}

type PageTurnDirection = 'forward' | 'backward'

type PageTurnOptions = {
  direction?: PageTurnDirection
  durationMs?: number
}

export function navigateWithPageTurn(navigate: () => void, options: PageTurnOptions = {}) {
  if (typeof window === 'undefined') {
    navigate()
    return
  }

  const direction = options.direction ?? 'forward'
  const root = document.documentElement
  root.dataset.pageTurn = direction

  if (options.durationMs) {
    root.style.setProperty('--page-turn-duration', `${options.durationMs}ms`)
  } else {
    root.style.removeProperty('--page-turn-duration')
  }

  const cleanup = () => {
    delete root.dataset.pageTurn
    root.style.removeProperty('--page-turn-duration')
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const viewDoc = document as ViewTransitionDocument

  if (!viewDoc.startViewTransition || prefersReducedMotion) {
    navigate()
    cleanup()
    return
  }

  try {
    const transition = viewDoc.startViewTransition(() => {
      navigate()
    })

    void transition.finished.finally(() => {
      cleanup()
    })
  } catch {
    navigate()
    cleanup()
  }
}
