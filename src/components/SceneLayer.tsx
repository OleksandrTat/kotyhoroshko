'use client'

import { useEffect, useState, type ReactEventHandler, type RefObject } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  media?: 'image' | 'video'
  poster?: string
  muted?: boolean
  autoPlay?: boolean
  loop?: boolean
  playsInline?: boolean
  videoRef?: RefObject<HTMLVideoElement | null>
  onEnded?: ReactEventHandler<HTMLVideoElement>
  onLoadedMetadata?: ReactEventHandler<HTMLVideoElement>
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>
}

export function SceneLayer({
  src,
  alt,
  className = '',
  priority = false,
  media = 'image',
  poster,
  muted = true,
  autoPlay = true,
  loop = true,
  playsInline = true,
  videoRef,
  onEnded,
  onLoadedMetadata,
  onTimeUpdate,
}: Props) {
  const normalizedSrc = encodeURI(src)
  const normalizedPoster = poster ? encodeURI(poster) : undefined
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [normalizedSrc])

  if (media === 'video') {
    return (
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full select-none object-cover ${className}`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        webkit-playsinline={playsInline ? 'true' : undefined}
        preload={priority ? 'auto' : 'metadata'}
        poster={normalizedPoster}
        aria-label={alt}
        onEnded={onEnded}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
      >
        <source src={normalizedSrc} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className={`scene-image-shimmer absolute inset-0 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />
      <Image
        src={normalizedSrc}
        alt={alt}
        fill
        sizes="100vw"
        className={`select-none object-cover scene-image-boost transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoadingComplete={() => setIsLoaded(true)}
        draggable={false}
      />
    </div>
  )
}
