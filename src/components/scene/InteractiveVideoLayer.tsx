'use client'

import { useCallback, useRef, useState } from 'react'
import { SceneLayer } from '@/components/SceneLayer'
import type { Scene } from '@/content/scenes'
import { VideoChallengeOverlay } from '@/components/games'

type VideoSceneMedia = Extract<Scene['media'], { kind: 'video' }>
type VideoStage = 'intro' | 'challenge' | 'playing'

export function InteractiveVideoLayer({
  scene,
  prefersReducedMotion,
}: {
  scene: Scene
  prefersReducedMotion: boolean
}) {
  const media = scene.media as VideoSceneMedia
  const game = scene.videoGame
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const introPausedRef = useRef(false)
  const [challengeKey, setChallengeKey] = useState(0)
  const [videoStage, setVideoStage] = useState<VideoStage>('intro')

  const playVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const playPromise = video.play()
    if (playPromise) {
      playPromise.catch(() => {})
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    introPausedRef.current = false
    video.currentTime = 0
    setVideoStage(prefersReducedMotion ? 'challenge' : 'intro')

    if (prefersReducedMotion) {
      video.pause()
      return
    }

    playVideo()
  }, [playVideo, prefersReducedMotion])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video || videoStage !== 'intro' || introPausedRef.current) {
      return
    }

    const stopAt = Math.min(1.1, Math.max(0.8, video.duration ? video.duration * 0.2 : 1))
    if (video.currentTime >= stopAt) {
      introPausedRef.current = true
      video.pause()
      setVideoStage('challenge')
    }
  }, [videoStage])

  const handleRestartChallenge = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
    }

    setChallengeKey((current) => current + 1)
    setVideoStage('challenge')
  }, [])

  const handleCloseChallenge = useCallback(() => {
    setVideoStage('playing')
    playVideo()
  }, [playVideo])

  return (
    <>
      <SceneLayer
        media="video"
        src={media.src}
        poster={media.poster}
        alt={media.alt}
        className="z-10 scale-[1.03] animate-fade-in-slow"
        autoPlay={false}
        loop
        priority
        videoRef={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />

      {game && videoStage === 'challenge' ? (
        <VideoChallengeOverlay
          key={challengeKey}
          game={game}
          onRestart={handleRestartChallenge}
          onClose={handleCloseChallenge}
          onComplete={() => {
            setVideoStage('playing')
            playVideo()
          }}
        />
      ) : null}
    </>
  )
}
