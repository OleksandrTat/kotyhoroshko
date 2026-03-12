import * as Tone from 'tone'
import type { SceneInteraction, SceneTheme } from '@/content/scenes'

type ThemeScore = {
  bpm: number
  pad: string[]
  bells: string[]
  bass: string[]
  texture: 'wind' | 'rain' | 'embers' | 'magic' | 'soft'
  cutoff: number
  musicGain: number
}

const THEME_SCORE: Record<SceneTheme, ThemeScore> = {
  hearth: {
    bpm: 74,
    pad: ['C4', 'E4', 'G4'],
    bells: ['E5', 'G5', 'C6'],
    bass: ['C2', 'G2'],
    texture: 'embers',
    cutoff: 2600,
    musicGain: 0.22,
  },
  field: {
    bpm: 82,
    pad: ['G4', 'B4', 'D5'],
    bells: ['D5', 'G5', 'A5'],
    bass: ['G2', 'D2'],
    texture: 'wind',
    cutoff: 3200,
    musicGain: 0.18,
  },
  forest: {
    bpm: 70,
    pad: ['D4', 'F4', 'A4'],
    bells: ['A4', 'C5', 'E5'],
    bass: ['D2', 'A1'],
    texture: 'wind',
    cutoff: 1900,
    musicGain: 0.16,
  },
  dragon: {
    bpm: 62,
    pad: ['D4', 'F4', 'A4'],
    bells: ['F4', 'A4', 'C5'],
    bass: ['D2', 'C2'],
    texture: 'embers',
    cutoff: 1300,
    musicGain: 0.16,
  },
  dungeon: {
    bpm: 58,
    pad: ['A3', 'C4', 'E4'],
    bells: ['C5', 'E5', 'A5'],
    bass: ['A1', 'E2'],
    texture: 'rain',
    cutoff: 1000,
    musicGain: 0.14,
  },
  wonder: {
    bpm: 88,
    pad: ['C4', 'F4', 'A4'],
    bells: ['G5', 'A5', 'C6'],
    bass: ['F2', 'C2'],
    texture: 'magic',
    cutoff: 3400,
    musicGain: 0.24,
  },
  forge: {
    bpm: 78,
    pad: ['E4', 'G4', 'B4'],
    bells: ['B4', 'D5', 'G5'],
    bass: ['E2', 'B1'],
    texture: 'embers',
    cutoff: 2200,
    musicGain: 0.18,
  },
  sky: {
    bpm: 92,
    pad: ['G4', 'B4', 'D5'],
    bells: ['D5', 'F#5', 'A5'],
    bass: ['G2', 'D2'],
    texture: 'soft',
    cutoff: 3800,
    musicGain: 0.2,
  },
  trail: {
    bpm: 80,
    pad: ['D4', 'G4', 'A4'],
    bells: ['A4', 'D5', 'F#5'],
    bass: ['D2', 'A1'],
    texture: 'wind',
    cutoff: 2600,
    musicGain: 0.18,
  },
  duel: {
    bpm: 66,
    pad: ['D4', 'G4', 'A4'],
    bells: ['A4', 'C5', 'D5'],
    bass: ['D2', 'A1'],
    texture: 'embers',
    cutoff: 1500,
    musicGain: 0.16,
  },
  escape: {
    bpm: 86,
    pad: ['B3', 'D4', 'F#4'],
    bells: ['F#5', 'A5', 'B5'],
    bass: ['B1', 'F#2'],
    texture: 'rain',
    cutoff: 1800,
    musicGain: 0.18,
  },
}

export type StoryAudioEngine = Awaited<ReturnType<typeof createStoryAudioEngine>>

export async function createStoryAudioEngine(initialTheme: SceneTheme) {
  await Tone.start()

  const destination = Tone.getDestination()
  destination.volume.value = -10

  const master = new Tone.Gain(0.52).toDestination()
  const musicBus = new Tone.Gain(0.86).connect(master)
  const fxBus = new Tone.Gain(0.92).connect(master)

  const reverb = new Tone.Reverb({ decay: 3.8, preDelay: 0.04, wet: 0.24 })
  await reverb.ready
  reverb.connect(musicBus)

  const delay = new Tone.FeedbackDelay('8n', 0.16).connect(musicBus)
  delay.wet.value = 0.18

  const chorus = new Tone.Chorus({ frequency: 0.16, delayTime: 2.4, depth: 0.18, wet: 0.18 }).connect(musicBus).start()
  const textureFilter = new Tone.Filter(2200, 'lowpass').connect(fxBus)

  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle4' },
    envelope: { attack: 1.4, decay: 0.6, sustain: 0.42, release: 3.6 },
    volume: -12,
  }).connect(chorus)

  const bells = new Tone.FMSynth({
    harmonicity: 2.3,
    modulationIndex: 7,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.16, sustain: 0, release: 1.8 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.02, decay: 0.18, sustain: 0, release: 1.3 },
    volume: -15,
  }).connect(delay)

  const bass = new Tone.MonoSynth({
    oscillator: { type: 'triangle2' },
    filter: { Q: 1.5, type: 'lowpass', rolloff: -24 },
    envelope: { attack: 0.05, decay: 0.25, sustain: 0.28, release: 1.2 },
    filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.18, release: 0.8, baseFrequency: 90, octaves: 2.2 },
    volume: -12,
  }).connect(reverb)

  const pluck = new Tone.PluckSynth({
    attackNoise: 0.7,
    dampening: 2800,
    resonance: 0.88,
  }).connect(delay)

  const impact = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 4,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 0.28, sustain: 0, release: 0.16 },
    volume: -18,
  }).connect(reverb)

  const shimmer = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.14, release: 0.05 },
    harmonicity: 5.1,
    modulationIndex: 20,
    resonance: 3200,
    octaves: 1.2,
    volume: -28,
  }).connect(delay)
  shimmer.frequency.value = 240

  const windNoise = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.02, decay: 0.24, sustain: 0, release: 0.16 },
    volume: -26,
  }).connect(textureFilter)

  const rainNoise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.04 },
    volume: -30,
  }).connect(textureFilter)

  const transport = Tone.getTransport()
  transport.bpm.value = THEME_SCORE[initialTheme].bpm

  let currentTheme = initialTheme
  let step = 0

  const padLoop = new Tone.Loop((time) => {
    const score = THEME_SCORE[currentTheme]
    pad.triggerAttackRelease(score.pad, '2m', time, score.musicGain)
  }, '2m').start(0)

  const bellLoop = new Tone.Loop((time) => {
    const score = THEME_SCORE[currentTheme]
    const note = score.bells[step % score.bells.length]
    bells.triggerAttackRelease(note, '8n', time, score.texture === 'magic' ? 0.2 : 0.12)
  }, '2n').start('0:2')

  const bassLoop = new Tone.Loop((time) => {
    const score = THEME_SCORE[currentTheme]
    bass.triggerAttackRelease(score.bass[step % score.bass.length], '1n', time, score.musicGain + 0.06)
    step += 1
  }, '1m').start(0)

  const textureLoop = new Tone.Loop((time) => {
    const score = THEME_SCORE[currentTheme]

    if (score.texture === 'magic') {
      pluck.triggerAttack(score.bells[(step + 1) % score.bells.length], time)
      shimmer.triggerAttackRelease('16n', time, 0.05)
      return
    }

    if (score.texture === 'embers') {
      shimmer.triggerAttackRelease('16n', time, 0.04)
      return
    }

    if (score.texture === 'wind') {
      windNoise.triggerAttackRelease('8n', time, 0.05)
      return
    }

    if (score.texture === 'rain') {
      rainNoise.triggerAttackRelease('16n', time, 0.05)
    }
  }, '4n').start(0)

  transport.start()

  const setTheme = (theme: SceneTheme) => {
    currentTheme = theme
    const score = THEME_SCORE[theme]
    transport.bpm.rampTo(score.bpm, 1.2)
    textureFilter.frequency.rampTo(score.cutoff, 1.2)
    musicBus.gain.rampTo(theme === 'dragon' || theme === 'duel' ? 0.72 : 0.86, 0.8)
  }

  const duckNarration = (active: boolean) => {
    musicBus.gain.rampTo(active ? 0.42 : 0.86, 0.25)
  }

  const playInteraction = (effect: SceneInteraction['effect']) => {
    const now = Tone.now()

    if (effect === 'shake') {
      impact.triggerAttackRelease('D2', '8n', now, 0.48)
      shimmer.triggerAttackRelease('16n', now + 0.05, 0.04)
      return
    }

    if (effect === 'trail') {
      pluck.triggerAttack('D5', now)
      pluck.triggerAttack('A5', now + 0.08)
      bells.triggerAttackRelease('D6', '16n', now + 0.12, 0.16)
      return
    }

    if (effect === 'sparkle') {
      bells.triggerAttackRelease('G5', '16n', now, 0.18)
      shimmer.triggerAttackRelease('16n', now + 0.06, 0.06)
      return
    }

    if (effect === 'sway') {
      windNoise.triggerAttackRelease('8n', now, 0.06)
      bells.triggerAttackRelease('D5', '16n', now + 0.06, 0.08)
      return
    }

    if (effect === 'pulse') {
      bells.triggerAttackRelease('A5', '8n', now, 0.16)
      bass.triggerAttackRelease('A2', '8n', now + 0.04, 0.12)
      return
    }

    bells.triggerAttackRelease('E5', '8n', now, 0.14)
  }

  const suspend = async () => {
    transport.pause()
    master.gain.rampTo(0.0001, 0.2)
  }

  const resume = async () => {
    await Tone.start()
    master.gain.rampTo(0.52, 0.3)
    if (transport.state !== 'started') {
      transport.start()
    }
  }

  const dispose = async () => {
    transport.stop()
    padLoop.dispose()
    bellLoop.dispose()
    bassLoop.dispose()
    textureLoop.dispose()
    pad.dispose()
    bells.dispose()
    bass.dispose()
    pluck.dispose()
    impact.dispose()
    shimmer.dispose()
    windNoise.dispose()
    rainNoise.dispose()
    textureFilter.dispose()
    chorus.dispose()
    delay.dispose()
    reverb.dispose()
    musicBus.dispose()
    fxBus.dispose()
    master.dispose()
    await Tone.getContext().dispose()
  }

  setTheme(initialTheme)

  return {
    setTheme,
    duckNarration,
    playInteraction,
    suspend,
    resume,
    dispose,
  }
}
