type Props = {
    src: string
    alt: string
    className?: string
  }
  
  export function SceneLayer({ src, alt, className }: Props) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        draggable={false}
      />
    )
  }
  