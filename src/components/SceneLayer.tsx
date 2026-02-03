type Props = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function SceneLayer({ src, alt, className = '', priority = false }: Props) {
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