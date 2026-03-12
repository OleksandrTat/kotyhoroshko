import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useTextReveal(trigger: boolean) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!trigger || !ref.current) return
    const el = ref.current
    const words = el.innerText.split(' ')

    el.innerHTML = words
      .map((word) => `<span style="display:inline-block;opacity:0;transform:translateY(12px)">${word}&nbsp;</span>`)
      .join('')

    gsap.to(el.querySelectorAll('span'), {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power2.out',
      delay: 0.3,
    })
  }, [trigger])

  return ref
}
