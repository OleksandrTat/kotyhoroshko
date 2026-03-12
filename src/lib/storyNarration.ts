import type { SceneTheme } from '@/content/scenes'

type NarrationOptions = {
  text: string
  theme: SceneTheme
  onStart?: () => void
  onEnd?: () => void
}

const PREFERRED_VOICE_HINTS = [
  'microsoft sabina',
  'microsoft helena',
  'microsoft elvira',
  'monica',
  'paulina',
  'helena',
  'sabina',
  'google espanol',
  'google español',
  'google us spanish',
  'lucia',
  'dalia',
]

function scoreVoice(voice: SpeechSynthesisVoice) {
  const normalizedName = `${voice.name} ${voice.lang}`.toLowerCase()
  let score = 0

  if (voice.lang.toLowerCase().startsWith('es')) {
    score += 10
  }

  if (voice.localService) {
    score += 3
  }

  const matchIndex = PREFERRED_VOICE_HINTS.findIndex((hint) => normalizedName.includes(hint))
  if (matchIndex >= 0) {
    score += 12 - matchIndex
  }

  if (normalizedName.includes('online') || normalizedName.includes('natural')) {
    score += 2
  }

  return score
}

export function selectPreferredSpanishVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) {
    return null
  }

  return [...voices].sort((left, right) => scoreVoice(right) - scoreVoice(left))[0] ?? null
}

function pitchForTheme(theme: SceneTheme) {
  if (theme === 'dragon' || theme === 'duel' || theme === 'dungeon') {
    return 0.94
  }

  if (theme === 'wonder' || theme === 'sky') {
    return 1.12
  }

  return 1.02
}

function rateForTheme(theme: SceneTheme) {
  if (theme === 'dragon' || theme === 'duel') {
    return 0.9
  }

  if (theme === 'field' || theme === 'trail') {
    return 0.98
  }

  return 0.94
}

export function speakWithBrowserVoice({ text, theme, onStart, onEnd }: NarrationOptions) {
  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  utterance.pitch = pitchForTheme(theme)
  utterance.rate = rateForTheme(theme)
  utterance.volume = 1

  const voice = selectPreferredSpanishVoice()
  if (voice) {
    utterance.voice = voice
  }

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()

  synth.speak(utterance)
}

export function cancelBrowserNarration() {
  window.speechSynthesis.cancel()
}

export async function requestPremiumNarration(text: string, signal?: AbortSignal) {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
    signal,
  })

  if (!response.ok) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('audio/')) {
    return null
  }

  return response.blob()
}
