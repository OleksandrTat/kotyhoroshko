'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SceneHotspots from '@/components/SceneHotspots'
import { SceneLayer } from '@/components/SceneLayer'
import WeatherEffect from '@/components/WeatherEffect'
import { ScrollHint } from '@/components/ScrollHint'
import { NarratorCharacter } from '@/components/NarratorCharacter'
import { DialogueBubbleComponent } from '@/components/DialogueBubble'
import { useTextReveal } from '@/hooks/useTextReveal'
import { TOTAL_SCENES, type Scene, type SceneInteraction, type SceneTheme } from '@/content/scenes'
import { createStoryAudioEngine, type StoryAudioEngine } from '@/lib/storyAudioEngine'
import { cancelBrowserNarration, requestPremiumNarration, speakWithBrowserVoice } from '@/lib/storyNarration'
import { useParallaxCursor } from '@/hooks/useParallaxCursor'

type Props = {
  scenes: Scene[]
}

type UiMode = 'clean' | 'theater'

const THEME_SURFACE: Record<SceneTheme, string> = {
  hearth: 'from-[#2d170d]/40 via-[#160d08]/30 to-[#090503]/45',
  field: 'from-[#122113]/38 via-[#11100d]/28 to-[#050403]/44',
  forest: 'from-[#112217]/42 via-[#09120c]/32 to-[#030403]/45',
  dragon: 'from-[#31130e]/42 via-[#180806]/30 to-[#050303]/45',
  dungeon: 'from-[#12141d]/44 via-[#090a10]/32 to-[#020203]/46',
  wonder: 'from-[#13211d]/40 via-[#09120f]/30 to-[#040504]/44',
  forge: 'from-[#26150e]/42 via-[#120906]/32 to-[#050302]/45',
  sky: 'from-[#122136]/38 via-[#0b121c]/28 to-[#040507]/44',
  trail: 'from-[#1b180f]/40 via-[#0f0e0a]/30 to-[#040403]/44',
  duel: 'from-[#220d10]/42 via-[#100608]/30 to-[#040203]/45',
  escape: 'from-[#141625]/42 via-[#090a12]/32 to-[#030304]/45',
}

const THEME_GLOW: Record<SceneTheme, string> = {
  hearth: 'bg-[radial-gradient(circle_at_22%_22%,rgba(255,211,144,0.34),transparent_28%),radial-gradient(circle_at_78%_76%,rgba(214,134,76,0.22),transparent_30%)]',
  field: 'bg-[radial-gradient(circle_at_16%_26%,rgba(233,212,140,0.18),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(158,186,111,0.16),transparent_26%)]',
  forest: 'bg-[radial-gradient(circle_at_22%_18%,rgba(156,220,169,0.14),transparent_26%),radial-gradient(circle_at_74%_78%,rgba(89,145,110,0.14),transparent_28%)]',
  dragon: 'bg-[radial-gradient(circle_at_20%_20%,rgba(255,173,127,0.22),transparent_24%),radial-gradient(circle_at_78%_74%,rgba(221,93,62,0.18),transparent_30%)]',
  dungeon: 'bg-[radial-gradient(circle_at_24%_18%,rgba(162,182,232,0.14),transparent_26%),radial-gradient(circle_at_72%_82%,rgba(89,106,145,0.14),transparent_30%)]',
  wonder: 'bg-[radial-gradient(circle_at_24%_18%,rgba(184,244,189,0.18),transparent_24%),radial-gradient(circle_at_78%_78%,rgba(255,214,140,0.14),transparent_28%)]',
  forge: 'bg-[radial-gradient(circle_at_24%_18%,rgba(255,183,129,0.18),transparent_22%),radial-gradient(circle_at_78%_76%,rgba(229,109,56,0.16),transparent_26%)]',
  sky: 'bg-[radial-gradient(circle_at_50%_14%,rgba(182,209,255,0.18),transparent_22%),radial-gradient(circle_at_24%_80%,rgba(255,225,174,0.12),transparent_28%)]',
  trail: 'bg-[radial-gradient(circle_at_24%_20%,rgba(220,196,130,0.18),transparent_24%),radial-gradient(circle_at_80%_76%,rgba(136,146,95,0.14),transparent_28%)]',
  duel: 'bg-[radial-gradient(circle_at_22%_18%,rgba(255,177,137,0.2),transparent_22%),radial-gradient(circle_at_78%_78%,rgba(214,94,74,0.16),transparent_28%)]',
  escape: 'bg-[radial-gradient(circle_at_24%_20%,rgba(191,205,255,0.18),transparent_24%),radial-gradient(circle_at_78%_76%,rgba(196,114,90,0.14),transparent_30%)]',
}

const HOTSPOT_PLACEMENT: Array<{ top: string; left: string }> = [
  { top: '24%', left: '72%' },
  { top: '58%', left: '77%' },
  { top: '40%', left: '78%' },
  { top: '62%', left: '20%' },
]

const ATMOSPHERE_PARTICLES: Record<Scene['atmosphere'], number> = {
  embers: 14,
  mist: 8,
  wind: 10,
  rain: 14,
  magic: 12,
  starlight: 12,
}

const STORY_CHAPTERS = [
  { start: 1, label: 'Hogar', mood: 'La calma antes del cuento' },
  { start: 6, label: 'Bosque', mood: 'La perdida y la busqueda' },
  { start: 10, label: 'Magia', mood: 'El nacimiento del heroe' },
  { start: 15, label: 'Forja', mood: 'Preparar la gran fuerza' },
  { start: 20, label: 'Viaje', mood: 'El camino hacia el dragon' },
  { start: 23, label: 'Final', mood: 'El golpe decisivo' },
] as const


const EFFECT_ICONS: Record<SceneInteraction['effect'], string> = {
  glow: '✦',
  shake: '⚡',
  sparkle: '✸',
  sway: '〜',
  pulse: '◎',
  trail: '➿',
}

const BOOKMARK_KEY = 'kotyhoroshko-bookmark'
const SCROLL_HINT_KEY = 'kotyhoroshko-hint-seen'
const INTRO_SEEN_KEY = 'kotyhoroshko-intro-seen'


function getChapterForScene(sceneId: number) {
  return [...STORY_CHAPTERS].reverse().find((chapter) => sceneId >= chapter.start) ?? STORY_CHAPTERS[0]
}

function interactionIcon(effect: SceneInteraction['effect']) {
  return EFFECT_ICONS[effect] ?? '\u2726'
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(target.closest('button, a, input, textarea, select, [contenteditable="true"]'))
}

function hasOpenStoryModal() {
  if (typeof document === 'undefined') {
    return false
  }

  return Boolean(document.querySelector('[data-story-modal="true"]'))
}

// ─── INTRO SCREEN ────────────────────────────────────────────────────────────

function IntroScreen({
  scenes,
  savedBookmark,
  onStart,
  onContinue,
}: {
  scenes: Scene[]
  savedBookmark: number | null
  onStart: () => void
  onContinue: (sceneId: number) => void
}) {
  const coverScene = scenes[0]
  const bookmarkScene = savedBookmark ? scenes.find((scene) => scene.id === savedBookmark) : null
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(44,23,11,0.98) 0%, rgba(11,10,8,0.99) 60%, rgba(4,3,2,1) 100%)',
      }}
    >
      {coverScene.media.kind === 'image' ? (
        <div className="absolute inset-0 opacity-[0.14]">
          <img src={coverScene.media.src} alt="" className="h-full w-full object-cover" aria-hidden="true" />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(244,188,85,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute -bottom-1/4 right-1/4 h-[50vh] w-[50vh] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(214,134,76,0.4) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${5 + (index % 4) * 3}px`,
              height: `${5 + (index % 4) * 3}px`,
              left: `${10 + index * 11}%`,
              top: `${20 + ((index * 17) % 60)}%`,
              background: 'radial-gradient(circle, rgba(255,225,174,0.9) 0%, rgba(244,188,85,0.3) 60%, transparent 80%)',
              animation: `float ${6 + index * 0.7}s ease-in-out ${index * 0.4}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(244,188,85,0.6))]" />
          <span className="text-[rgba(244,188,85,0.7)] text-lg">{'\u2726'}</span>
          <div className="h-px w-16 bg-[linear-gradient(90deg,rgba(244,188,85,0.6),transparent)]" />
        </div>

        <p
          className="mb-4 text-[10px] uppercase tracking-[0.38em] text-[rgba(255,225,174,0.55)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Cuento interactivo infantil
        </p>

        <h1
          className="mb-2 text-6xl leading-none text-[rgba(255,236,204,0.97)] sm:text-7xl"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 80px rgba(244,188,85,0.4), 0 4px 24px rgba(0,0,0,0.8)',
          }}
        >
          Kotyhoroshko
        </h1>

        <p
          className="mt-3 max-w-[26rem] text-base leading-relaxed text-[rgba(255,225,174,0.68)]"
          style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
        >
          La historia del pequeño héroe que venció al dragón con un guisante y mucho valor.
        </p>

        <p
          className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[rgba(255,225,174,0.4)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {TOTAL_SCENES} escenas · 6 capítulos
        </p>

        <div className="my-8 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(244,188,85,0.28))]" />
          <span className="text-xs text-[rgba(244,188,85,0.5)]">{'\u2726'} {'\u2726'} {'\u2726'}</span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(244,188,85,0.28),transparent)]" />
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <button
            type="button"
            onClick={onStart}
            className="button-primary btn-glow group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold text-[#2a170b] shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
            <span className="relative flex items-center justify-center gap-2">
              Empezar el cuento
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          {bookmarkScene ? (
            <button
              type="button"
              onClick={() => onContinue(bookmarkScene.id)}
              className="rounded-2xl border border-[rgba(255,225,174,0.22)] bg-[rgba(255,255,255,0.04)] px-8 py-3.5 text-sm font-semibold text-[rgba(255,225,174,0.86)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:scale-[1.01]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="mb-1 block text-xs uppercase tracking-[0.22em] text-[rgba(255,225,174,0.5)]">
                Continuar donde lo dejé
              </span>
              <span>Escena {bookmarkScene.id}: {bookmarkScene.title}</span>
            </button>
          ) : null}
        </div>

        <p
          className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[rgba(255,225,174,0.3)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Usa {'\u2190'} {'\u2192'} o desliza para navegar
        </p>
      </div>
    </div>
  )
}

type VisualLayerRefs = {
  background: RefObject<HTMLDivElement>
  midground: RefObject<HTMLDivElement>
  foreground: RefObject<HTMLDivElement>
}

function SceneVisual({
  scene,
  priority,
  layerRefs,
}: {
  scene: Scene
  priority: boolean
  layerRefs?: VisualLayerRefs
}) {
  if (scene.media.kind === 'layered') {
    return (
      <>
        <div ref={layerRefs?.background} className="absolute inset-0">
          <SceneLayer src={scene.media.background} alt={scene.media.altBackground} priority={priority} />
        </div>
        <div ref={layerRefs?.midground} className="absolute inset-0">
          <SceneLayer src={scene.media.midground} alt={scene.media.altMidground} priority={priority} />
        </div>
        <div ref={layerRefs?.foreground} className="absolute inset-0">
          <SceneLayer src={scene.media.foreground} alt={scene.media.altForeground} priority={priority} />
        </div>
      </>
    )
  }

  if (scene.media.kind === 'video') {
    return (
      <SceneLayer
        src={scene.media.src}
        alt={scene.media.alt}
        poster={scene.media.poster}
        media="video"
        autoPlay
        muted
        loop
        playsInline
        priority={priority}
      />
    )
  }

  if (scene.media.kind === 'image') {
    return <SceneLayer src={scene.media.src} alt={scene.media.alt} priority={priority} />
  }

  return <div className="absolute inset-0 bg-black" aria-hidden="true" />
}


function StoryAtmosphere({ scene }: { scene: Scene }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const particleCount = isMobile ? 0 : ATMOSPHERE_PARTICLES[scene.atmosphere]
  const particles = useMemo(() => Array.from({ length: particleCount }, (_, index) => index), [particleCount])

  if (particleCount === 0) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      {particles.map((particle) => (
        <span
          key={`${scene.id}-${particle}`}
          className={`story-atmosphere story-atmosphere-${scene.atmosphere} absolute`}
          style={
            {
              '--delay': `${(particle % 6) * 0.45}s`,
              '--duration': `${6 + (particle % 5) * 1.35}s`,
              '--left': `${6 + ((particle * 11) % 86)}%`,
              '--top': `${6 + ((particle * 17) % 82)}%`,
              '--size': `${scene.atmosphere === 'mist' ? 140 + (particle % 4) * 36 : 8 + (particle % 5) * 4}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function StorySection({
  scene,
  index,
  activeSceneIndex,
  activated,
  uiMode,
  onActivate,
  onShare,
  sectionRef,
}: {
  scene: Scene
  index: number
  activeSceneIndex: number
  activated: boolean
  uiMode: UiMode
  onActivate: (scene: Scene, source?: HTMLElement | null) => void
  onShare: (scene: Scene) => void
  sectionRef: (element: HTMLElement | null) => void
}) {
  const chapter = getChapterForScene(scene.id)
  const isClean = uiMode === 'clean'
  const isTheater = uiMode === 'theater'
  const sectionElementRef = useRef<HTMLElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const midgroundRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)
  const parallaxLayers = useMemo(() => [backgroundRef, midgroundRef, foregroundRef], [])

  const setSectionNode = useCallback(
    (node: HTMLElement | null) => {
      sectionElementRef.current = node
      sectionRef(node)
    },
    [sectionRef],
  )

  const fallbackHotspots = useMemo(() => {
    const placement = HOTSPOT_PLACEMENT[index % HOTSPOT_PLACEMENT.length]
    return [
      {
        x: Number.parseFloat(placement.left),
        y: Number.parseFloat(placement.top),
        icon: interactionIcon(scene.interaction.effect),
        tooltip: scene.interaction.label,
      },
    ]
  }, [index, scene.interaction.effect, scene.interaction.label])

  const hotspots = scene.hotspots && scene.hotspots.length > 0 ? scene.hotspots : fallbackHotspots

  useParallaxCursor(sectionElementRef, parallaxLayers)
  const revealRef = useTextReveal(activeSceneIndex === index)

  return (
    <section
      id={`scene-${scene.id}`}
      ref={setSectionNode}
      className="story-section scene-section relative flex h-[100svh] min-h-[100svh] snap-start snap-always items-stretch overflow-hidden"
      aria-label={`Escena ${scene.id}: ${scene.title}`}
      style={
        {
          '--scene-bg': scene.bgColor ?? '#0d0a0f',
          willChange: Math.abs(index - activeSceneIndex) <= 1 ? 'transform' : 'auto',
        } as CSSProperties
      }
    >
      <div data-scene-visual className="absolute inset-0 z-0">
        <SceneVisual
          scene={scene}
          priority={scene.id <= 2}
          layerRefs={{
            background: backgroundRef,
            midground: midgroundRef,
            foreground: foregroundRef,
          }}
        />
        <StoryAtmosphere scene={scene} />
        <WeatherEffect type={scene.weather?.type ?? 'none'} intensity={scene.weather?.intensity ?? 'medium'} />
        <div className={`absolute inset-0 bg-gradient-to-br ${THEME_SURFACE[scene.theme]}`} />
        <div className={`absolute inset-0 ${THEME_GLOW[scene.theme]}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,5,4,0.05)_0%,rgba(8,5,4,0.12)_42%,rgba(5,3,2,0.52)_100%)]" />
      </div>

      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.4))' }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex w-full flex-col justify-between px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-7 lg:px-12">
        {!isTheater ? (
          <SceneHotspots
            hotspots={hotspots}
            onActivate={(_, element) => onActivate(scene, element)}
          />
        ) : null}

        {isTheater ? (
          <div className="relative z-20 mt-auto pb-8">
            <div className="mx-auto w-[min(92vw,62rem)] rounded-[1.8rem] bg-[rgba(8,5,4,0.7)] px-6 py-4 text-center text-[clamp(1.1rem,1.6vw,1.8rem)] leading-relaxed text-[rgba(var(--color-accent),0.96)] shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p ref={revealRef} className="mt-2 first:mt-0">
                {scene.text[0]}
              </p>
              {scene.text.slice(1).map((paragraph) => (
                <p key={paragraph} className="mt-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className={`relative z-20 mt-auto grid items-end gap-4 ${isClean ? 'pb-8' : 'pb-12 lg:grid-cols-[minmax(0,1.1fr)_auto] lg:gap-6'}`}>
            {isClean ? (
              <div
                data-animate="rise"
                className="story-panel story-panel-wrap w-full max-w-[min(40rem,92vw)] rounded-[1.6rem] border border-[rgba(var(--color-accent),0.22)] bg-[rgba(12,7,5,0.78)] p-4 shadow-[0_22px_54px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.58)]">
                  Escena {scene.id}/{TOTAL_SCENES} - {chapter.label}
                </p>
                <h2 className="mt-3 text-3xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-4xl">{scene.title}</h2>
                <p ref={revealRef} className="mt-3 text-base leading-relaxed text-[rgba(var(--color-accent),0.9)] sm:text-lg">{scene.text[0]}</p>
                {scene.text[1] ? (
                  <p className="mt-2 text-sm leading-relaxed text-[rgba(var(--color-accent),0.74)] sm:text-base">{scene.text[1]}</p>
                ) : null}
                <p className="mt-4 text-sm text-[rgba(var(--color-accent),0.78)]">
                  {scene.narrator.name}: {scene.narrator.line}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.6)]">{scene.interaction.label}</p>
                <div className={`mt-2 rounded-[1rem] border px-3 py-2 text-sm leading-relaxed shadow-inner transition-all duration-500 ${
                  activated
                    ? 'border-[rgba(203,255,199,0.28)] bg-[rgba(50,98,52,0.26)] text-[rgba(231,255,230,0.92)]'
                    : 'border-[rgba(var(--color-accent),0.14)] bg-[rgba(255,255,255,0.03)] text-[rgba(var(--color-accent),0.7)]'
                }`}>
                  {activated ? scene.interaction.response : scene.interaction.prompt}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onShare(scene)}
                    data-cursor="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.8)] hover:bg-[rgba(255,255,255,0.08)]"
                  >
                    Compartir escena 📤
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  data-animate="rise"
                  className="max-w-[min(34rem,92vw)] rounded-[2rem] border border-[rgba(var(--color-accent),0.22)] bg-[linear-gradient(145deg,rgba(20,11,8,0.88),rgba(8,5,4,0.86))] p-5 shadow-[0_28px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[rgba(255,225,174,0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.58)]">
                      {chapter.label}
                    </span>
                    <span className="rounded-full border border-[rgba(var(--color-accent),0.22)] bg-[rgba(var(--color-secondary),0.16)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.7)]">
                      {scene.title}
                    </span>
                    {scene.media.kind === 'video' ? (
                      <span className="rounded-full border border-[rgba(200,255,205,0.24)] bg-[rgba(90,166,87,0.18)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[rgba(220,255,220,0.78)]">
                        Escena animada
                      </span>
                    ) : null}
                    {scene.videoGame ? (
                      <span className="rounded-full border border-[rgba(181,218,255,0.24)] bg-[rgba(58,100,168,0.18)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[rgba(226,239,255,0.78)]">
                        Juego tactil extra
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-4xl leading-none text-[rgba(var(--color-accent),0.98)] sm:text-5xl">{scene.title}</h2>
                  <p ref={revealRef} className="mt-4 max-w-[30rem] text-lg leading-relaxed text-[rgba(var(--color-accent),0.92)] sm:text-xl">{scene.text[0]}</p>
                  {scene.text[1] ? (
                    <p className="mt-3 max-w-[28rem] text-base leading-relaxed text-[rgba(var(--color-accent),0.72)] sm:text-lg">{scene.text[1]}</p>
                  ) : null}

                  <div className="mt-5 h-px w-full bg-[linear-gradient(90deg,rgba(255,225,174,0.34),transparent)]" />

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[rgba(var(--color-accent),0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-sm text-[rgba(var(--color-accent),0.88)]">
                      {scene.interaction.label}
                    </span>
                    <span className="text-sm text-[rgba(var(--color-accent),0.6)]">{scene.interaction.prompt}</span>
                  </div>

                  <div className={`mt-4 rounded-[1.3rem] border px-4 py-3 text-sm leading-relaxed shadow-inner transition-all duration-500 sm:text-base ${
                    activated
                      ? 'border-[rgba(203,255,199,0.28)] bg-[rgba(50,98,52,0.26)] text-[rgba(231,255,230,0.92)]'
                      : 'border-[rgba(var(--color-accent),0.14)] bg-[rgba(255,255,255,0.03)] text-[rgba(var(--color-accent),0.62)]'
                  }`}>
                    {activated ? scene.interaction.response : 'Toca el punto brillante para provocar una pequena reaccion visual y sonora.'}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onShare(scene)}
                      data-cursor="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--color-accent),0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[rgba(var(--color-accent),0.8)] hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      Compartir escena 📤
                    </button>
                  </div>
                </div>

                <div data-animate="rise" className="hidden min-w-[15rem] rounded-[1.7rem] border border-[rgba(var(--color-accent),0.18)] bg-[rgba(13,8,6,0.74)] px-4 py-4 text-sm text-[rgba(var(--color-accent),0.72)] shadow-[0_18px_42px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:block">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(var(--color-accent),0.56)]">Ritmo del cuento</p>
                  <p className="mt-1 text-xs text-[rgba(var(--color-accent),0.54)]">{chapter.mood}</p>
                  <div className="mt-4 grid gap-2">
                    {Array.from({ length: TOTAL_SCENES }, (_, dotIndex) => {
                      const reached = dotIndex + 1 <= scene.id
                      return (
                        <span
                          key={`dot-${scene.id}-${dotIndex}`}
                          className={`h-1.5 rounded-full ${reached ? 'bg-[linear-gradient(90deg,rgba(255,225,174,0.95),rgba(214,134,76,0.88))]' : 'bg-[rgba(255,255,255,0.08)]'}`}
                        />
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {scene.dialogue.length ? (
        <div className="pointer-events-none absolute bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-30 flex max-w-[85vw] flex-col items-end gap-6 md:right-8 md:max-w-[420px]">
          {scene.dialogue.map((bubble, bubbleIndex) => (
            <DialogueBubbleComponent
              key={`${scene.id}-${bubble.speaker}-${bubble.text}`}
              bubble={bubble}
              delay={bubbleIndex * 0.12}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function MinimalHUD({
  activeScene,
  totalScenes,
  audioEnabled,
  onToggleAudio,
  onGoToIntro,
}: {
  activeScene: number
  totalScenes: number
  audioEnabled: boolean
  onToggleAudio: () => void
  onGoToIntro: () => void
}) {
  return (
    <>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${(activeScene / totalScenes) * 100}%` }} />
      </div>

      <div style={{
        position: 'fixed',
        top: 12,
        right: 16,
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontFamily: 'monospace',
        zIndex: 100,
        letterSpacing: '0.1em',
      }}>
        {activeScene}/{totalScenes}
      </div>

      <button
        onClick={onToggleAudio}
        style={{
          position: 'fixed',
          top: 12,
          left: 16,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 24,
          cursor: 'pointer',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={audioEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
        type="button"
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      <button
        onClick={onGoToIntro}
        style={{
          position: 'fixed',
          top: 12,
          left: 80,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 24,
          cursor: 'pointer',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Головна"
        type="button"
      >
        🏠
      </button>
    </>
  )
}

gsap.registerPlugin(ScrollTrigger)

export function InteractiveStoryBook({ scenes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLElement | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const sectionRefs = useRef<Array<HTMLElement | null>>([])
  const audioEngineRef = useRef<StoryAudioEngine | null>(null)
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null)
  const narrationAbortRef = useRef<AbortController | null>(null)
  const narrationCacheRef = useRef(new Map<number, string>())
  const swipeStateRef = useRef<{ pointerId: number; startX: number; startY: number; startTime: number } | null>(null)
  const [activeSceneId, setActiveSceneId] = useState(1)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [activatedScenes, setActivatedScenes] = useState<Record<number, boolean>>({})
  const [chapterTransition, setChapterTransition] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [savedBookmark, setSavedBookmark] = useState<number | null>(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const uiMode: UiMode = 'clean'

  useEffect(() => {
    setIsReady(true)

    try {
      const raw = window.localStorage.getItem(BOOKMARK_KEY)
      if (raw) {
        const parsed = Number(raw)
        if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_SCENES) {
          setSavedBookmark(parsed)
        }
      }
    } catch {
      // ignore
    }

    try {
      const seen = window.sessionStorage.getItem(INTRO_SEEN_KEY)
      if (seen) {
        setShowIntro(false)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!isReady || showIntro) {
      return
    }
    try {
      window.localStorage.setItem(BOOKMARK_KEY, String(activeSceneId))
    } catch {
      // ignore
    }
  }, [activeSceneId, isReady, showIntro])

  useEffect(() => {
    if (showIntro) {
      return
    }
    try {
      const seen = window.localStorage.getItem(SCROLL_HINT_KEY)
      if (seen) {
        return
      }
      setShowScrollHint(true)
      window.localStorage.setItem(SCROLL_HINT_KEY, '1')
      const id = window.setTimeout(() => setShowScrollHint(false), 4000)
      return () => window.clearTimeout(id)
    } catch {
      // ignore
    }
  }, [showIntro])

  const stopNarration = useCallback(() => {
    narrationAbortRef.current?.abort()
    narrationAbortRef.current = null
    cancelBrowserNarration()

    const playingAudio = narrationAudioRef.current
    if (playingAudio) {
      playingAudio.pause()
      playingAudio.src = ''
      narrationAudioRef.current = null
    }

    audioEngineRef.current?.duckNarration(false)
  }, [])

  const playSceneNarration = useCallback(async (scene: Scene) => {
    stopNarration()

    const engine = audioEngineRef.current
    engine?.duckNarration(true)

    const controller = new AbortController()
    narrationAbortRef.current = controller

    try {
      let narrationUrl = narrationCacheRef.current.get(scene.id) ?? null

      if (!narrationUrl) {
        const premiumAudio = await requestPremiumNarration(scene.narrator.line, controller.signal)
        if (premiumAudio) {
          narrationUrl = URL.createObjectURL(premiumAudio)
          narrationCacheRef.current.set(scene.id, narrationUrl)
        }
      }

      if (controller.signal.aborted) {
        engine?.duckNarration(false)
        return
      }

      if (narrationUrl) {
        const audio = new Audio(narrationUrl)
        audio.preload = 'auto'
        audio.onended = () => {
          audioEngineRef.current?.duckNarration(false)
        }
        audio.onerror = () => {
          audioEngineRef.current?.duckNarration(false)
        }

        narrationAudioRef.current = audio
        await audio.play()
        return
      }
    } catch {
      // Fallback to the best browser voice when premium TTS is unavailable.
    }

    speakWithBrowserVoice({
      text: scene.narrator.line,
      theme: scene.theme,
      onStart: () => {
        audioEngineRef.current?.duckNarration(true)
      },
      onEnd: () => {
        audioEngineRef.current?.duckNarration(false)
      },
    })
  }, [stopNarration])

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8)
    }
  }, [])

  const scrollToScene = useCallback(
    (sceneId: number, options?: { duration?: number; immediate?: boolean; haptic?: boolean }) => {
      const index = Math.min(Math.max(sceneId, 1), scenes.length) - 1
      const target = sectionRefs.current[index]
      if (!target || !lenisRef.current) {
        return
      }

      if (options?.haptic) {
        triggerHaptic()
      }

      const targetOffset = target.offsetTop
      lenisRef.current.scrollTo(targetOffset, {
        duration: options?.duration ?? 0.5,
        immediate: options?.immediate ?? false,
      })
    },
    [scenes.length, triggerHaptic],
  )

  const handleStartStory = useCallback(() => {
    setShowIntro(false)
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // ignore
    }
  }, [])

  const handleContinueFromBookmark = useCallback((sceneId: number) => {
    setShowIntro(false)
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // ignore
    }
    window.setTimeout(() => scrollToScene(sceneId, { immediate: true }), 120)
  }, [scrollToScene])

  const handleGoToIntro = useCallback(() => {
    stopNarration()
    setShowIntro(true)
    try {
      window.sessionStorage.removeItem(INTRO_SEEN_KEY)
    } catch {
      // ignore
    }
  }, [stopNarration])

  const handleSwipeStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      return
    }
    if (isInteractiveTarget(event.target) || hasOpenStoryModal()) {
      return
    }

    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: Date.now(),
    }
  }, [])

  const handleSwipeMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current
    if (!swipeState || swipeState.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - swipeState.startX
    const deltaY = event.clientY - swipeState.startY

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      event.preventDefault()
    }
  }, [])

  const handleSwipeEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current
    if (!swipeState || swipeState.pointerId !== event.pointerId) {
      return
    }

    swipeStateRef.current = null
    const deltaX = event.clientX - swipeState.startX
    const deltaY = event.clientY - swipeState.startY
    const elapsed = Math.max(Date.now() - swipeState.startTime, 1)
    const velocity = Math.abs(deltaY) / elapsed

    if (Math.abs(deltaY) < 40 && velocity < 0.3) {
      return
    }
    if (Math.abs(deltaY) < Math.abs(deltaX)) {
      return
    }

    if (deltaY > 0) {
      scrollToScene(activeSceneId + 1, { haptic: true })
    } else {
      scrollToScene(activeSceneId - 1, { haptic: true })
    }
  }, [activeSceneId, scrollToScene])

  useEffect(() => {
    document.documentElement.dataset.storyMode = 'scroll'

    if (!containerRef.current || !scrollContentRef.current) {
      return
    }

    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: scrollContentRef.current,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,
      duration: 1.2,
      snap: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    let snapTimer = 0
    let latestScroll = 0
    const handleLenisScroll = (lenisInstance: Lenis) => {
      const { scroll } = lenisInstance
      latestScroll = scroll
      ScrollTrigger.update()

      if (snapTimer) {
        window.clearTimeout(snapTimer)
      }
      snapTimer = window.setTimeout(() => {
        const sectionHeight = Math.max(containerRef.current?.clientHeight ?? window.innerHeight, 1)
        const nearestIndex = Math.round(latestScroll / sectionHeight)
        const targetOffset = nearestIndex * sectionHeight
        if (Math.abs(latestScroll - targetOffset) < 2) {
          return
        }
        const target = sectionRefs.current[nearestIndex]
        if (target) {
          lenis.scrollTo(target, { duration: 0.25, immediate: false })
        }
      }, 40)
    }

    lenis.on('scroll', handleLenisScroll)
    rafId = window.requestAnimationFrame(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.defaults({ scroller: containerRef.current })

    const context = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) {
          return
        }

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSceneId(index + 1),
          onEnterBack: () => setActiveSceneId(index + 1),
        })
      })
    }, containerRef)

    const hash = window.location.hash
    let hashTimer = 0
    if (hash.startsWith('#scene-')) {
      hashTimer = window.setTimeout(() => {
        const target = document.querySelector<HTMLElement>(hash)
        if (target) {
          lenis.scrollTo(target, { immediate: true })
        }
      }, 80)
    }

    return () => {
      delete document.documentElement.dataset.storyMode
      lenisRef.current = null
      context.revert()
      lenis.off('scroll', handleLenisScroll)
      lenis.destroy()
      window.clearTimeout(hashTimer)
      window.clearTimeout(snapTimer)
      window.cancelAnimationFrame(rafId)
    }
  }, [scenes.length])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) {
          return
        }

        const distance = Math.abs(index - (activeSceneId - 1))
        if (distance > 2) {
          return
        }

        gsap.fromTo(
          section,
          { opacity: 0.6, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: section,
              scroller: containerRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 0.3,
            },
          },
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [activeSceneId])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) {
        return
      }
      if (isInteractiveTarget(event.target) || hasOpenStoryModal()) {
        return
      }
      if (showIntro && event.key === 'Enter') {
        handleStartStory()
        return
      }
      if (event.key === 'Escape' && !showIntro) {
        handleGoToIntro()
        return
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        scrollToScene(activeSceneId + 1, { haptic: true })
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        scrollToScene(activeSceneId - 1, { haptic: true })
      }
      if (event.key === 'm' || event.key === 'M') {
        event.preventDefault()
        setAudioEnabled((current) => !current)
      }
      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault()
        const scene = scenes[activeSceneId - 1]
        if (scene) {
          if (!audioEnabled) {
            setAudioEnabled(true)
          } else {
            void playSceneNarration(scene)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeSceneId, audioEnabled, handleGoToIntro, handleStartStory, playSceneNarration, scenes, scrollToScene, showIntro])

  useEffect(() => {
    const synth = window.speechSynthesis
    const primeVoices = () => {
      synth.getVoices()
    }

    primeVoices()
    synth.addEventListener('voiceschanged', primeVoices)

    return () => synth.removeEventListener('voiceschanged', primeVoices)
  }, [])

  useEffect(() => {
    const scene = scenes[activeSceneId - 1]
    if (!scene) {
      return
    }

    window.history.replaceState(null, '', `#scene-${scene.id}`)

    if (!audioEnabled) {
      return
    }

    let cancelled = false

    const syncAudio = async () => {
      if (!audioEngineRef.current) {
        audioEngineRef.current = await createStoryAudioEngine(scene.theme)
      } else {
        await audioEngineRef.current.resume()
      }

      if (cancelled || !audioEngineRef.current) {
        return
      }

      audioEngineRef.current.setTheme(scene.theme)
      await playSceneNarration(scene)
    }

    void syncAudio()

    return () => {
      cancelled = true
    }
  }, [activeSceneId, audioEnabled, playSceneNarration, scenes])

  useEffect(() => {
    const scene = scenes[activeSceneId - 1]
    if (!scene) {
      return
    }

    const preloadViaLink = (src: string) => {
      if (!src || typeof document === 'undefined') {
        return
      }

      const href = encodeURI(src)
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
        return
      }
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = href
      document.head.appendChild(link)
    }

    const preloadScene = (target: Scene) => {
      if (target.media.kind === 'image') {
        const img = new Image()
        img.src = target.media.src
        preloadViaLink(target.media.src)
      }
      if (target.media.kind === 'video' && target.media.poster) {
        const img = new Image()
        img.src = target.media.poster
        preloadViaLink(target.media.poster)
      }
      if (target.media.kind === 'layered') {
        const imgs = [target.media.background, target.media.midground, target.media.foreground]
        imgs.forEach((src) => {
          const img = new Image()
          img.src = src
          preloadViaLink(src)
        })
      }
    }

    const nextScene = scenes[activeSceneId]
    const prevScene = scenes[activeSceneId - 2]
    if (nextScene) {
      preloadScene(nextScene)
    }
    if (prevScene) {
      preloadScene(prevScene)
    }
  }, [activeSceneId, scenes])

  useEffect(() => {
    if (audioEnabled) {
      return
    }

    stopNarration()

    if (!audioEngineRef.current) {
      return
    }

    void audioEngineRef.current.suspend()
  }, [audioEnabled, stopNarration])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioEngineRef.current?.suspend()
        stopNarration()
        return
      }

      if (audioEnabled) {
        void audioEngineRef.current?.resume()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [audioEnabled, stopNarration])

  useEffect(() => {
    const narrationCache = narrationCacheRef.current

    return () => {
      stopNarration()
      narrationCache.forEach((url) => URL.revokeObjectURL(url))
      narrationCache.clear()

      if (!audioEngineRef.current) {
        return
      }

      void audioEngineRef.current.dispose()
    }
  }, [stopNarration])

  const handleActivate = (scene: Scene, source?: HTMLElement | null) => {
    setActivatedScenes((current) => ({
      ...current,
      [scene.id]: true,
    }))

    const section = sectionRefs.current[scene.id - 1]
    const visual = section?.querySelector<HTMLElement>('[data-scene-visual]')

    if (source) {
      gsap.fromTo(
        source,
        { scale: 1, rotate: 0 },
        {
          scale: 1.14,
          rotate: scene.interaction.effect === 'shake' ? 4 : 0,
          duration: 0.18,
          repeat: 1,
          yoyo: true,
          ease: 'power1.out',
        },
      )
    }

    if (visual) {
      gsap.fromTo(
        visual,
        { filter: 'brightness(1) saturate(1)' },
        {
          filter:
            scene.interaction.effect === 'shake'
              ? 'brightness(1.16) saturate(1.08)'
              : 'brightness(1.1) saturate(1.12)',
          duration: 0.22,
          repeat: 1,
          yoyo: true,
          ease: 'power1.out',
        },
      )
    }

    if (audioEnabled) {
      audioEngineRef.current?.playInteraction(scene.interaction.effect)
    }
  }

  const handleShareScene = useCallback(async (scene: Scene) => {
    if (typeof window === 'undefined') {
      return
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}#scene-${scene.id}`
    const shareData = {
      title: `Kotyhoroshko · ${scene.title}`,
      text: scene.text[0] ?? scene.narrator.line,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // Ignore and fallback to clipboard.
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
    }
  }, [])

  const activeChapter = useMemo(() => getChapterForScene(activeSceneId), [activeSceneId])
  const activeScene = scenes[activeSceneId - 1]

  const previousChapterRef = useRef(activeChapter)

  useEffect(() => {
    const previous = previousChapterRef.current
    if (previous.start !== activeChapter.start) {
      setChapterTransition(true)
      const timer = window.setTimeout(() => setChapterTransition(false), 380)
      previousChapterRef.current = activeChapter
      return () => window.clearTimeout(timer)
    }

    previousChapterRef.current = activeChapter
  }, [activeChapter])

  return (
    <>
      {showIntro ? (
        <IntroScreen
          scenes={scenes}
          savedBookmark={savedBookmark}
          onStart={handleStartStory}
          onContinue={handleContinueFromBookmark}
        />
      ) : null}

      <div
        ref={containerRef}
        className={`story-scroll scroll-container relative min-h-[100svh] bg-[#080604] text-white ${isReady ? 'storybook-enter' : 'opacity-0'}`}
        onPointerDown={handleSwipeStart}
        onPointerMove={handleSwipeMove}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={handleSwipeEnd}
      >
        <MinimalHUD
          activeScene={activeSceneId}
          totalScenes={scenes.length}
          audioEnabled={audioEnabled}
          onToggleAudio={() => setAudioEnabled((current) => !current)}
          onGoToIntro={handleGoToIntro}
        />

        <main
          ref={(node) => {
            scrollContentRef.current = node
          }}
          className={`scenes-container ${chapterTransition ? 'chapter-enter' : ''}`}
        >
          {scenes.map((scene, index) => (
            <StorySection
              key={scene.id}
              scene={scene}
              index={index}
              activeSceneIndex={activeSceneId - 1}
              activated={Boolean(activatedScenes[scene.id])}
              uiMode={uiMode}
              onActivate={handleActivate}
              onShare={handleShareScene}
              sectionRef={(element) => {
                sectionRefs.current[index] = element
              }}
            />
          ))}
        </main>

        <ScrollHint visible={showScrollHint && !showIntro} />
        <NarratorCharacter
          line={activeScene?.narrator.line ?? ''}
          isVisible={!showIntro}
          isSpeaking={audioEnabled}
        />
      </div>
    </>
  )
}

