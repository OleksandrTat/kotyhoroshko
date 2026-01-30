import { SceneContainer } from '@/components/SceneContainer'
import { SceneLayer } from '@/components/SceneLayer'
import { NextButton } from '@/components/NextButton'

export default function Scene1Page() {
  return (
    <SceneContainer>
      {/* Background */}
      <SceneLayer
        src="/scenes/scene-1/background.jpeg"
        alt="Інтерʼєр української хати"
      />

      {/* Foreground (персонажі + стіл) */}
      <SceneLayer
        src="/scenes/scene-1/foreground.png"
        alt="Родина за столом"
        className="animate-fade-in-slow hover:scale-[1.01] transition-transform duration-700"
      />

      {/* Текст сцени */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 max-w-3xl
                      rounded-2xl bg-black/60 px-6 py-4 text-center
                      text-lg leading-relaxed backdrop-blur-sm">
        Жили колись чоловік із жінкою. І було в них семеро синів та одна дочка.
      </div>

      {/* Кнопка переходу */}
      <NextButton nextSceneId={2} />
    </SceneContainer>
  )
}
