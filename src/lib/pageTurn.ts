export const PAGE_TURN_DURATION = 350

export async function transitionForward(): Promise<void> {
  return runTransition()
}

export async function transitionBackward(): Promise<void> {
  return runTransition()
}

async function runTransition(): Promise<void> {
  if (typeof document === 'undefined') {
    return
  }

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity ${PAGE_TURN_DURATION * 0.4}ms ease;
  `
  document.body.appendChild(overlay)

  await tick()
  overlay.style.opacity = '0.35'

  await wait(PAGE_TURN_DURATION * 0.4)
  overlay.style.transition = `opacity ${PAGE_TURN_DURATION * 0.6}ms ease`
  overlay.style.opacity = '0'

  await wait(PAGE_TURN_DURATION * 0.6)
  overlay.remove()
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function tick() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve))
}
