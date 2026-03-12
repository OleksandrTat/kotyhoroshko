import { InteractiveStoryBook } from '@/components/InteractiveStoryBook'
import { SCENES } from '@/content/scenes'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Kotyhoroshko',
  description: 'Cuento interactivo infantil con scroll suave, narrador, dialogos visibles, audio y escenas tactiles.',
  inLanguage: 'es',
  audience: {
    '@type': 'PeopleAudience',
    suggestedMinAge: 1,
    suggestedMaxAge: 8,
  },
  image: `${siteUrl}/scenes/scene-25/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_b18fd58a45.jpeg`,
  url: siteUrl,
  numberOfItems: SCENES.length,
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <InteractiveStoryBook scenes={SCENES} />
    </>
  )
}
