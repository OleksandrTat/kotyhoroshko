import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { gsap } from 'gsap'

type TapOptions = {
  soundFn?: () => void
  onTap?: () => void
  haptic?: boolean
}

type TapHandlers = {
  onPointerDown: (event: ReactPointerEvent) => void
}

export function useTapInteraction(options: TapOptions = {}) {
  const ref = useRef<HTMLElement | null>(null)

  const handleTap = useCallback(
    (event: ReactPointerEvent) => {
      event.stopPropagation()
      const element = ref.current
      if (!element) {
        return
      }

      options.soundFn?.()
      if (options.haptic && 'vibrate' in navigator) {
        navigator.vibrate(40)
      }

      gsap
        .timeline()
        .to(element, { scale: 1.25, duration: 0.12, ease: 'power2.out' })
        .to(element, { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.5)' })

      spawnCelebrationParticles(event.clientX, event.clientY)
      options.onTap?.()
    },
    [options],
  )

  return { ref, handlers: { onPointerDown: handleTap } satisfies TapHandlers }
}

function spawnCelebrationParticles(x: number, y: number) {
  const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎈', '❤️', '🌈']

  Array.from({ length: 6 + Math.floor(Math.random() * 4) }).forEach((_, index) => {
    const particle = document.createElement('span')
    particle.textContent = emojis[index % emojis.length]
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${20 + Math.random() * 20}px;
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(particle)

    gsap.to(particle, {
      x: -60 + Math.random() * 120,
      y: -80 - Math.random() * 100,
      opacity: 0,
      scale: 0.5,
      duration: 1.2 + Math.random() * 0.6,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    })
  })
}
