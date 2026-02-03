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
}: Props) {
  if (media === 'video') {
    return (
      <video
        className={`absolute inset-0 w-full h-full object-cover select-none ${className}`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={priority ? 'auto' : 'metadata'}
        poster={poster}
        aria-label={alt}
      >
        <source src={src} type="video/mp4" />
      </video>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-cover select-none ${className}`}
      draggable={false}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}
