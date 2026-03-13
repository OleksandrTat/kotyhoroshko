// Genera efectos de sonido simples con Web Audio API - sin ficheros externos

type SynthKey = 'interaction' | 'success' | 'narrator'

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!(window as Window & { __audioCtx?: AudioContext }).__audioCtx) {
    ;(window as Window & { __audioCtx?: AudioContext }).__audioCtx = new AudioContext()
  }
  return (window as Window & { __audioCtx?: AudioContext }).__audioCtx ?? null
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.25,
) {
  const ctx = getContext()
  if (!ctx) return

  // Reanudar contexto si estaba suspendido (politica autoplay de navegadores)
  void ctx.resume()

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration)

  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

export const synthSfx: Record<SynthKey, () => void> = {
  interaction: () => {
    playTone(660, 0.12, 'sine', 0.2)
    setTimeout(() => playTone(880, 0.1, 'sine', 0.15), 80)
  },
  success: () => {
    playTone(523, 0.1, 'sine', 0.2)
    setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 100)
    setTimeout(() => playTone(784, 0.18, 'sine', 0.25), 200)
  },
  narrator: () => {
    playTone(440, 0.08, 'sine', 0.15)
  },
}
