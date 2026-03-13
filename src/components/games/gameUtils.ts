export type GamePoint = { x: number; y: number }

export function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function distanceBetween(a: GamePoint, b: GamePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function distanceToSegment(point: GamePoint, start: GamePoint, end: GamePoint) {
  const dx = end.x - start.x
  const dy = end.y - start.y

  if (dx === 0 && dy === 0) {
    return distanceBetween(point, start)
  }

  const ratio = clampValue(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy),
    0,
    1,
  )

  return distanceBetween(point, {
    x: start.x + dx * ratio,
    y: start.y + dy * ratio,
  })
}

export function getNormalizedPoint(rect: DOMRect, clientX: number, clientY: number): GamePoint {
  return {
    x: clampValue((clientX - rect.left) / rect.width, 0, 1),
    y: clampValue((clientY - rect.top) / rect.height, 0, 1),
  }
}

export function toViewBoxPoint(point: GamePoint) {
  return `${point.x * 100},${point.y * 100}`
}
