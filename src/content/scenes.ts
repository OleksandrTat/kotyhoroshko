export type SceneTheme =
  | 'hearth'
  | 'field'
  | 'forest'
  | 'dragon'
  | 'dungeon'
  | 'wonder'
  | 'forge'
  | 'sky'
  | 'trail'
  | 'duel'
  | 'escape'

export type SceneMedia =
  | {
      kind: 'video'
      src: string
      alt: string
      poster?: string
    }
  | {
      kind: 'image'
      src: string
      alt: string
    }
  | {
      kind: 'layered'
      background: string
      midground: string
      foreground: string
      altBackground: string
      altMidground: string
      altForeground: string
    }
  | {
      kind: 'ambient'
      alt: string
    }

export type Scene = {
  id: number
  title: string
  text: string[]
  theme: SceneTheme
  panelAlign?: 'left' | 'right'
  media: SceneMedia
}

const video = (src: string, alt: string, poster?: string): SceneMedia => ({
  kind: 'video',
  src,
  alt,
  poster,
})

const image = (src: string, alt: string): SceneMedia => ({
  kind: 'image',
  src,
  alt,
})

const layered = (
  background: string,
  midground: string,
  foreground: string,
  altBackground: string,
  altMidground: string,
  altForeground: string,
): SceneMedia => ({
  kind: 'layered',
  background,
  midground,
  foreground,
  altBackground,
  altMidground,
  altForeground,
})

const ambient = (alt: string): SceneMedia => ({
  kind: 'ambient',
  alt,
})

export const TOTAL_SCENES = 28

export const SCENES: Scene[] = [
  {
    id: 1,
    title: 'Una familia numerosa',
    text: ['Había una vez un hombre y una mujer. Tenían siete hijos y una hija.'],
    theme: 'hearth',
    media: video(
      '/scenes/scene-1/video.mp4',
      'Interior cálido de una casa campesina al anochecer',
      '/scenes/scene-1/background.jpeg',
    ),
  },
  {
    id: 2,
    title: 'Camino al campo',
    text: ['Un día, seis de los hermanos fueron a trabajar al campo, y el menor se quedó en casa.'],
    theme: 'field',
    media: layered(
      '/scenes/scene-2/background.png',
      '/scenes/scene-2/midground.png',
      '/scenes/scene-2/foreground.png',
      'Cielo abierto sobre el campo',
      'Colinas lejanas y trigo maduro',
      'Hierba y detalles del primer plano',
    ),
  },
  {
    id: 3,
    title: 'El surco en la tierra',
    text: [
      'Los hermanos avanzaban por el campo y arrastraban el arado, dejando un surco detrás para que su hermana pudiera encontrarlos cuando les llevara la comida.',
    ],
    theme: 'field',
    panelAlign: 'right',
    media: video(
      '/scenes/scene-3/Animate_scene_two_halves_fdaf664df4.mp4',
      'Los hermanos abren un surco en el campo mientras trabajan',
    ),
  },
  {
    id: 4,
    title: 'La trampa del dragón',
    text: [
      'Cerca de aquel campo, en el bosque, vivía un dragón. Pensó algo malvado: cubrió el surco que habían dejado los hermanos y abrió otro nuevo que llevaba derecho hasta su patio.',
    ],
    theme: 'forest',
    media: video(
      '/scenes/scene-4/Dragon_breathes_and_moves_wings_7e6828a779.mp4',
      'Un dragón acecha junto al bosque y prepara una emboscada',
    ),
  },
  {
    id: 5,
    title: 'La hermana desaparece',
    text: [
      'La hermana llevó la comida a sus hermanos y siguió aquel surco del dragón. Caminó y caminó hasta entrar en el patio del monstruo.',
      'Allí cayó directamente en las garras del dragón.',
    ],
    theme: 'dragon',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-5/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_delpmaspu (1).png',
      'La muchacha entra sin saberlo en el patio del dragón',
    ),
  },
  {
    id: 6,
    title: 'La búsqueda',
    text: ['Los hermanos regresaron del campo y no encontraron a su hermana. Entonces salieron a buscarla.'],
    theme: 'forest',
    media: video(
      '/scenes/scene-6/Use_the_provided_image_as_the_main_visual_referenc_d0ebf902cc.mp4',
      'Los hermanos recorren el bosque en busca de su hermana',
    ),
  },
  {
    id: 7,
    title: 'El desafío',
    text: [
      'Llegaron al patio del dragón. El dragón salió a recibirlos.',
      '"¿Habéis venido a luchar conmigo o a hacer las paces?", preguntó.',
      '"¡A luchar!", respondieron los hermanos.',
      '"Entonces venid bajo el roble de hierro y mediremos nuestras fuerzas. No soporto el olor humano."',
    ],
    theme: 'dragon',
    panelAlign: 'right',
    media: image('/scenes/scene-7/_____2k_delpmaspu.png', 'El dragón desafía a los hermanos ante su guarida'),
  },
  {
    id: 8,
    title: 'El roble de hierro',
    text: [
      'Llegaron. En medio del patio del dragón se alzaba un roble altísimo. Tanto el tronco como las hojas eran de hierro; se mecían con el viento y repicaban.',
    ],
    theme: 'dragon',
    media: image('/scenes/scene-8/image.png', 'El roble de hierro se alza en el centro del patio del dragón'),
  },
  {
    id: 9,
    title: 'La derrota de los hermanos',
    text: [
      'El dragón se lanzó sobre los hermanos y golpeó con toda su fuerza. En un instante los hundió profundamente en la tierra, hasta una mazmorra subterránea.',
      'Allí los encerró.',
    ],
    theme: 'dungeon',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-9/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_delpmaspu (3).png',
      'Los hermanos son vencidos y arrastrados a la prisión subterránea',
    ),
  },
  {
    id: 10,
    title: 'La esperanza del hogar',
    text: [
      'Mientras tanto, el padre y la madre esperan y esperan, pero sus hijos no regresan. Solo les quedaba un consuelo: el hijo menor.',
      'Un día encontró un guisante y lo plantó en la tierra.',
    ],
    theme: 'hearth',
    media: image(
      '/scenes/scene-10/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_243f20699d.jpeg',
      'En casa, el hijo menor encuentra un guisante y lo planta',
    ),
  },
  {
    id: 11,
    title: 'La vaina mágica',
    text: [
      'Pronto creció un arbusto enorme y en él apareció una sola vaina. Dentro había un único guisante, pero no era uno cualquiera: era mágico.',
      'El muchacho alcanzó la vaina y la arrancó.',
    ],
    theme: 'wonder',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-11/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_4131008962.jpeg',
      'Una vaina mágica crece en el arbusto delante del muchacho',
    ),
  },
  {
    id: 12,
    title: 'Nace Kotyhoroshko',
    text: [
      'El guisante cayó de la vaina y echó a rodar. El muchacho corrió tras él, lo agarró y se lo comió.',
      'Desde entonces lo llamaron Kotyhoroshko.',
    ],
    theme: 'wonder',
    media: image(
      '/scenes/scene-12/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_d3f7968bcc.jpeg',
      'El niño persigue el guisante mágico y se lo come',
    ),
  },
  {
    id: 13,
    title: 'Crece como un héroe',
    text: ['Kotyhoroshko empezó a crecer no por días, sino por horas. En una semana ya era más alto que su padre.'],
    theme: 'wonder',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-13/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_06fe0b9593.jpeg',
      'Kotyhoroshko crece con rapidez extraordinaria junto a su familia',
    ),
  },
  {
    id: 14,
    title: 'La piedra del pozo',
    text: [
      'Un día, el padre cavaba un pozo y encontró una piedra enorme. Fue a buscar ayuda para sacarla.',
      'Mientras estaba fuera, Kotyhoroshko levantó la piedra con una sola mano. Cuando la gente llegó, todos se quedaron asombrados.',
    ],
    theme: 'hearth',
    media: image(
      '/scenes/scene-14/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_46e28116b7.jpeg',
      'Kotyhoroshko levanta una piedra enorme con una sola mano',
    ),
  },
  {
    id: 15,
    title: 'La maza del herrero',
    text: [
      'En cuanto Kotyhoroshko sintió su fuerza, decidió ir a liberar a sus hermanos y a su hermana.',
      'Fue a ver al herrero y le pidió que le forjara una maza pesada. El herrero lo hizo.',
    ],
    theme: 'forge',
    panelAlign: 'right',
    media: image('/scenes/scene-15/________16289b34e6jpeg_a1a7040ef6.jpeg', 'El herrero forja la pesada maza de Kotyhoroshko'),
  },
  {
    id: 16,
    title: 'La prueba del cielo',
    text: [
      'Kotyhoroshko blandió la maza, la lanzó hasta lo más alto del cielo y dijo:',
      '"Yo me acostaré a dormir. Padre, despiértame dentro de doce días, cuando la maza vuelva a caer."',
    ],
    theme: 'sky',
    media: image(
      '/scenes/scene-16/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_62f5e3bb0d.jpeg',
      'Kotyhoroshko lanza su maza hacia el cielo para probar su fuerza',
    ),
  },
  {
    id: 17,
    title: 'El regreso de la maza',
    text: ['Al duodécimo día, la maza regresó zumbando y cortando el aire.'],
    theme: 'sky',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-17/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_e72b8efca2.jpeg',
      'La maza desciende desde el cielo con un estruendo',
    ),
  },
  {
    id: 18,
    title: 'Demasiado frágil',
    text: [
      'El padre despertó a su hijo. Kotyhoroshko se levantó de un salto y puso el puño. La maza golpeó contra él y se partió en dos.',
      '"No. Con una maza así no iré contra el dragón."',
    ],
    theme: 'forge',
    media: ambient('La prueba falla y la primera maza se rompe'),
  },
  {
    id: 19,
    title: 'Forjar de nuevo',
    text: [
      'Entonces volvió a ponerse en camino hacia el herrero.',
      '"Vuelve a forjar la maza para que sea todavía más resistente."',
      'El herrero la reforjó.',
    ],
    theme: 'forge',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-19/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_5a6c5004eb.jpeg',
      'Kotyhoroshko regresa al herrero para reforjar la maza',
    ),
  },
  {
    id: 20,
    title: 'Lista para el combate',
    text: [
      'Kotyhoroshko lanzó otra vez la maza y volvió a acostarse. Doce días después, la maza regresó y chocó contra su puño; solo se dobló un poco.',
      '"Ahora sí. Con esta maza iré contra el dragón", dijo Kotyhoroshko.',
    ],
    theme: 'forge',
    media: image('/scenes/scene-20/___________49ae497244.jpeg', 'La segunda maza resiste la prueba del puño de Kotyhoroshko'),
  },
  {
    id: 21,
    title: 'El viaje al patio del dragón',
    text: [
      'Kotyhoroshko se despidió de su padre y de su madre y siguió el mismo surco por el que habían ido su hermana y sus hermanos sin regresar.',
      'Aunque el surco ya estaba cubierto de hierba, todavía se distinguía un poco, y lo condujo hasta el patio del dragón.',
    ],
    theme: 'trail',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-21/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_5cb26906a6.jpeg',
      'Kotyhoroshko sigue la antigua marca del arado hasta la guarida del dragón',
    ),
  },
  {
    id: 22,
    title: 'El reto final',
    text: [
      '"¿Qué quieres?", siseó el dragón. "No soporto el olor humano. ¿Has venido a luchar o a hacer las paces?"',
      '"¡A luchar! Quiero liberar a mis hermanos y a mi hermana."',
      '"Aquí encontrarás tu muerte", silbó el dragón.',
    ],
    theme: 'dragon',
    media: image('/scenes/scene-22/______e3814a2548.jpeg', 'Kotyhoroshko se enfrenta al dragón en su propio patio'),
  },
  {
    id: 23,
    title: 'El silbido del monstruo',
    text: [
      'Llegaron junto al roble de hierro. El dragón silbó, las hojas cayeron del árbol y el aire entero empezó a resonar.',
    ],
    theme: 'duel',
    panelAlign: 'right',
    media: image(
      '/scenes/scene-23/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_d0763a94e7.jpeg',
      'El dragón silba bajo el roble de hierro y hace temblar el patio',
    ),
  },
  {
    id: 24,
    title: 'El engaño astuto',
    text: [
      'Entonces Kotyhoroshko dijo:',
      '"Cuando silbo yo, a uno pueden salírsele los ojos de las órbitas. Más vale que los cierres."',
      'El dragón cerró los ojos. Y Kotyhoroshko le descargó la maza en la frente.',
    ],
    theme: 'duel',
    media: image('/scenes/scene-24/__________________60e9413e5d.jpeg', 'Kotyhoroshko engaña al dragón y lo golpea con la maza'),
  },
  {
    id: 25,
    title: 'Sin tregua',
    text: [
      '"¿Ves qué bien silbo?", preguntó Kotyhoroshko.',
      '"Tienes razón: por poco se me salen los ojos", se asustó el dragón. "¿Y si hacemos las paces?"',
      '"No. ¡A luchar!", respondió Kotyhoroshko.',
    ],
    theme: 'duel',
    panelAlign: 'right',
    media: image('/scenes/scene-25/_____________9aaf4cce3c.jpeg', 'El dragón intenta pactar, pero Kotyhoroshko rechaza la tregua'),
  },
  {
    id: 26,
    title: 'El golpe decisivo',
    text: [
      'Entonces comenzaron a pelear. Nuestro héroe atrapó al dragón y lo lanzó con tal fuerza que fue a estrellarse contra el árbol.',
      'El tronco se partió en dos y la cola del dragón quedó atrapada. Pero el tronco era de hierro: no podía liberarse.',
    ],
    theme: 'duel',
    media: ambient('El combate alcanza su punto más feroz bajo el roble de hierro'),
  },
  {
    id: 27,
    title: 'Los cautivos libres',
    text: [
      'Kotyhoroshko dejó al dragón atrapado y fue a liberar a sus hermanos de la prisión. Dobló los barrotes, sacó a los cautivos y los llevó afuera.',
      'Ellos ni siquiera reconocieron a su hermano menor, porque había crecido muy deprisa.',
    ],
    theme: 'dungeon',
    panelAlign: 'right',
    media: ambient('Kotyhoroshko abre la prisión y libera a los cautivos'),
  },
  {
    id: 28,
    title: 'La huida del dragón',
    text: [
      'Pero, mientras tanto, el dragón arrancó el roble de cuajo, agarró a la hermana de Kotyhoroshko y echó a volar.',
      'El roble, tan pesado, iba arrastrándose por el suelo detrás de él y dejaba una larga huella.',
    ],
    theme: 'escape',
    media: ambient('El dragón huye por el cielo llevándose a la hermana de Kotyhoroshko'),
  },
]

export function getSceneById(id: number) {
  return SCENES.find((scene) => scene.id === id)
}
