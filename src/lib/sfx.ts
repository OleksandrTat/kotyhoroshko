import { synthSfx } from './sfxSynth'

type SfxKey = 'interaction' | 'success' | 'narrator'

class SfxManager {
  private enabled = true

  // preload es un no-op porque la sintesis no requiere precarga
  preload(..._keys: SfxKey[]) {}

  play(key: SfxKey) {
    if (!this.enabled) return
    try {
      synthSfx[key]?.()
    } catch {
      // Ignorar errores de AudioContext (por ejemplo en SSR)
    }
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const sfx = new SfxManager()
