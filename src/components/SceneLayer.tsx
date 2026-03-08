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
        className={`absolute inset-0 h-full w-full select-none object-cover ${className}`}
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
    <div className={`absolute inset-0 ${className}`}>
      <Image
        src={src}
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
