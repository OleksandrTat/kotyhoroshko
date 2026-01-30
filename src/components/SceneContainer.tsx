type Props = {
    children: React.ReactNode
  }
  
  export function SceneContainer({ children }: Props) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {children}
      </div>
    )
  }
  