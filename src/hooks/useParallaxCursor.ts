import { useEffect, type RefObject } from 'react'

export function useParallaxCursor(
  containerRef: RefObject<HTMLElement>,
  layers: Array<RefObject<HTMLElement>>,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let rafId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetX = (event.clientX - rect.left - rect.width / 2) / rect.width
      targetY = (event.clientY - rect.top - rect.height / 2) / rect.height
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06

      layers.forEach((layerRef, index) => {
        const layer = layerRef.current
        if (!layer) {
          return
        }
        const depth = (index + 1) * 6
        layer.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`
      })

      rafId = window.requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', onMove)
    rafId = window.requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('mousemove', onMove)
      window.cancelAnimationFrame(rafId)
    }
  }, [containerRef, layers])
}
