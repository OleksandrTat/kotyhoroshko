import type { ReactEventHandler, RefObject } from 'react'
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

  if (media === 'video') {
    return (
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full select-none object-cover ${className}`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
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
      <Image
        src={normalizedSrc}
        alt={alt}
        fill
        sizes="100vw"
        className="select-none object-cover"
        priority={priority}
        draggable={false}
      />
    </div>
  )
}
