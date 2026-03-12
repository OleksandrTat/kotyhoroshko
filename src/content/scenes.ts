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

export type SceneAtmosphere = 'embers' | 'mist' | 'wind' | 'rain' | 'magic' | 'starlight'

export type SceneWeatherType = 'rain' | 'snow' | 'none'

export type SceneWeather = {
  type: SceneWeatherType
  intensity?: 'light' | 'medium' | 'heavy'
}

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

export type NarratorCue = {
  name: string
  badge: string
  line: string
}

export type DialogueBubble = {
  speaker: string
  text: string
  align?: 'left' | 'right'
  tone?: 'warm' | 'hero' | 'danger' | 'mystic'
}

export type SceneHotspot = {
  x: number
  y: number
  icon: string
  sound?: string
  tooltip?: string
}

export type SceneInteraction = {
  label: string
  prompt: string
  response: string
  effect: 'glow' | 'shake' | 'sparkle' | 'sway' | 'pulse' | 'trail'
}

export type VideoGame =
  | {
      type: 'collect'
      title: string
      description: string
      theme: 'pea' | 'firefly' | 'spark'
      targetLabel: string
    }
  | {
      type: 'trail'
      title: string
      description: string
      stepLabel: string
    }
  | {
      type: 'drag'
      title: string
      description: string
      tokenLabel: string
      goalLabel: string
    }
  | {
      type: 'hold'
      title: string
      description: string
      actionLabel: string
    }

export type Scene = {
  id: number
  title: string
  text: string[]
  theme: SceneTheme
  atmosphere: SceneAtmosphere
  narrator: NarratorCue
  dialogue: DialogueBubble[]
  interaction: SceneInteraction
  panelAlign?: 'left' | 'right'
  media: SceneMedia
  videoGame?: VideoGame
  weather?: SceneWeather
  bgColor?: string
  hotspots?: SceneHotspot[]
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

const narrator = (line: string): NarratorCue => ({
  name: 'Abuela Mila',
  badge: 'Narradora',
  line,
})

const talk = (
  speaker: string,
  text: string,
  align: 'left' | 'right' = 'left',
  tone: DialogueBubble['tone'] = 'warm',
): DialogueBubble => ({
  speaker,
  text,
  align,
  tone,
})

const BASE_SCENES: Scene[] = [
  {
    id: 1,
    title: 'Una familia numerosa',
    text: ['Habia una vez una familia grande: siete hijos y una hija vivian juntos en una casa humilde.'],
    theme: 'hearth',
    atmosphere: 'embers',
    narrator: narrator('Escucha el fuego: aqui empieza la aventura de Kotyhoroshko.'),
    dialogue: [talk('Abuela Mila', 'Primero todo parecia tranquilo.', 'left', 'mystic')],
    interaction: {
      label: 'Toca la chispa',
      prompt: 'Toca el brillo del hogar.',
      response: 'La cocina se enciende y el cuento despierta.',
      effect: 'glow',
    },
    media: video(
      '/scenes/scene-1/video.mp4',
      'Interior calido de una casa campesina al anochecer',
      '/scenes/scene-1/background.jpeg',
    ),
    videoGame: {
      type: 'collect',
      title: 'Atrapa las luces del hogar',
      description: 'Las luces del hogar bailan por la pantalla. Atrapalas para despertar la escena.',
      theme: 'firefly',
      targetLabel: 'Luz del hogar',
    },
  },
  {
    id: 2,
    title: 'Camino al campo',
    text: ['Seis hermanos fueron a trabajar al campo y el menor se quedo en casa con sus padres.'],
    theme: 'field',
    atmosphere: 'wind',
    narrator: narrator('Los hermanos mayores salen al campo y el dia parece amable.'),
    dialogue: [],
    interaction: {
      label: 'Mueve el trigo',
      prompt: 'Toca el campo.',
      response: 'Las espigas se balancean con el viento.',
      effect: 'sway',
    },
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
    text: ['Los hermanos dejaron un surco en la tierra para que su hermana pudiera seguirlo con la comida.'],
    theme: 'field',
    atmosphere: 'wind',
    narrator: narrator('El camino queda dibujado en la tierra como una pista dorada.'),
    dialogue: [],
    interaction: {
      label: 'Sigue el surco',
      prompt: 'Desliza el dedo por la linea.',
      response: 'El camino se ilumina bajo tu mano.',
      effect: 'trail',
    },
    panelAlign: 'right',
    media: video(
      '/scenes/scene-3/Animate_scene_two_halves_fdaf664df4.mp4',
      'Los hermanos abren un surco en el campo mientras trabajan',
    ),
    videoGame: {
      type: 'drag',
      title: 'Guia el arado',
      description: 'Lleva el arado por las marcas doradas y termina el surco sin perderte.',
      tokenLabel: 'Arado',
      goalLabel: 'Final del surco',
    },
  },
  {
    id: 4,
    title: 'La trampa del dragon',
    text: ['Un dragon cubrio el surco de los hermanos y abrio otro que llevaba hasta su patio.'],
    theme: 'forest',
    atmosphere: 'mist',
    narrator: narrator('Entre los arboles aparece la trampa del dragon. Nada es lo que parecia.'),
    dialogue: [talk('Dragon', 'Si siguen este camino, caeran en mi patio.', 'right', 'danger')],
    interaction: {
      label: 'Apaga la brasa',
      prompt: 'Toca la chispa roja.',
      response: 'Las brasas saltan y el bosque cruje.',
      effect: 'sparkle',
    },
    media: video(
      '/scenes/scene-4/Dragon_breathes_and_moves_wings_7e6828a779.mp4',
      'Un dragon acecha junto al bosque y prepara una emboscada',
    ),
    videoGame: {
      type: 'collect',
      title: 'Caza las chispas del dragon',
      description: 'Las chispas del dragon saltan y huyen. Tocarlas a tiempo las apaga.',
      theme: 'spark',
      targetLabel: 'Chispa del dragon',
    },
  },
  {
    id: 5,
    title: 'La hermana desaparece',
    text: ['La hermana siguio el surco falso y entro en el patio del monstruo, donde el dragon la capturo.'],
    theme: 'dragon',
    atmosphere: 'mist',
    narrator: narrator('La hermana cae en la trampa y el patio del dragon se cierra a su alrededor.'),
    dialogue: [talk('Hermana', 'Este camino no se parece al de mis hermanos...', 'left', 'warm')],
    interaction: {
      label: 'Golpea la puerta',
      prompt: 'Toca la verja del patio.',
      response: 'La puerta retumba, pero sigue cerrada.',
      effect: 'shake',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-5/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_delpmaspu (1).png',
      'La muchacha entra sin saberlo en el patio del dragon',
    ),
  },
  {
    id: 6,
    title: 'La busqueda',
    text: ['Cuando los hermanos volvieron y no encontraron a su hermana, salieron a buscarla por el bosque.'],
    theme: 'forest',
    atmosphere: 'mist',
    narrator: narrator('Los pasos se multiplican en el bosque, pero la hermana no aparece.'),
    dialogue: [talk('Hermanos', 'Sigamos las huellas antes de que anochezca.', 'left', 'hero')],
    interaction: {
      label: 'Busca huellas',
      prompt: 'Toca las pisadas.',
      response: 'Las huellas brillan un instante.',
      effect: 'trail',
    },
    media: video(
      '/scenes/scene-6/Use_the_provided_image_as_the_main_visual_referenc_d0ebf902cc.mp4',
      'Los hermanos recorren el bosque en busca de su hermana',
    ),
    videoGame: {
      type: 'trail',
      title: 'Sigue las huellas',
      description: 'Desliza el dedo de huella en huella para no perder el rastro en el bosque.',
      stepLabel: 'Huella',
    },
  },
  {
    id: 7,
    title: 'El desafio',
    text: ['Los hermanos llegaron al patio del dragon y el monstruo les pregunto si habian venido a luchar o a hacer las paces.'],
    theme: 'dragon',
    atmosphere: 'embers',
    narrator: narrator('El dragon sale a recibirlos y el aire se vuelve pesado.'),
    dialogue: [
      talk('Dragon', 'Han venido a luchar o a hacer las paces?', 'right', 'danger'),
      talk('Hermanos', 'Hemos venido a luchar.', 'left', 'hero'),
    ],
    interaction: {
      label: 'Haz sonar el reto',
      prompt: 'Toca el patio del dragon.',
      response: 'El suelo tiembla bajo tus dedos.',
      effect: 'shake',
    },
    panelAlign: 'right',
    media: image('/scenes/scene-7/_____2k_delpmaspu.png', 'El dragon desafia a los hermanos ante su guarida'),
  },
  {
    id: 8,
    title: 'El roble de hierro',
    text: ['En el centro del patio habia un roble de hierro. Sus hojas metalicas sonaban con el viento.'],
    theme: 'dragon',
    atmosphere: 'wind',
    narrator: narrator('Bajo el roble de hierro se medira la fuerza de los heroes.'),
    dialogue: [],
    interaction: {
      label: 'Haz sonar las hojas',
      prompt: 'Toca el arbol de hierro.',
      response: 'Las hojas repican como campanas.',
      effect: 'sparkle',
    },
    media: image('/scenes/scene-8/image.png', 'El roble de hierro se alza en el centro del patio del dragon'),
  },
  {
    id: 9,
    title: 'La derrota de los hermanos',
    text: ['El dragon golpeo con tanta fuerza que hundio a los hermanos en una mazmorra bajo tierra.'],
    theme: 'dungeon',
    atmosphere: 'rain',
    narrator: narrator('El dragon vence a los hermanos y la oscuridad se los traga.'),
    dialogue: [talk('Dragon', 'Quedaran encerrados muy abajo.', 'right', 'danger')],
    interaction: {
      label: 'Sacude los barrotes',
      prompt: 'Toca la prision.',
      response: 'Los barrotes vibran, pero no se abren.',
      effect: 'shake',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-9/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_delpmaspu (3).png',
      'Los hermanos son vencidos y arrastrados a la prision subterranea',
    ),
  },
  {
    id: 10,
    title: 'La esperanza del hogar',
    text: ['En casa, el hijo menor encontro un guisante y lo planto. Sus padres lo miraron con esperanza.'],
    theme: 'hearth',
    atmosphere: 'magic',
    narrator: narrator('Cuando todo parece perdido, una semilla trae esperanza.'),
    dialogue: [talk('Madre', 'Tal vez este pequeno guisante cambie nuestro destino.', 'left', 'warm')],
    interaction: {
      label: 'Haz brillar el guisante',
      prompt: 'Toca la luz verde.',
      response: 'El guisante emite un resplandor suave.',
      effect: 'glow',
    },
    media: video(
      '/scenes/scene-10/Boy_holding_glowing_orb_7cbe406749.mp4',
      'En casa, el hijo menor descubre el guisante magico entre sus manos',
      '/scenes/scene-10/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_243f20699d.jpeg',
    ),
  },
  {
    id: 11,
    title: 'La vaina magica',
    text: ['El arbusto crecio deprisa y en el aparecio una sola vaina con un guisante muy especial.'],
    theme: 'wonder',
    atmosphere: 'magic',
    narrator: narrator('La planta crece como si conociera un secreto antiguo.'),
    dialogue: [],
    interaction: {
      label: 'Abre la vaina',
      prompt: 'Toca la vaina grande.',
      response: 'La vaina se abre y deja salir un brillo.',
      effect: 'pulse',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-11/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_4131008962.jpeg',
      'Una vaina magica crece en el arbusto delante del muchacho',
    ),
  },
  {
    id: 12,
    title: 'Nace Kotyhoroshko',
    text: ['El guisante rodo, el muchacho lo atrapo y se lo comio. Desde entonces lo llamaron Kotyhoroshko.'],
    theme: 'wonder',
    atmosphere: 'magic',
    narrator: narrator('Asi nace el heroe del cuento: pequeno, rapido y lleno de magia.'),
    dialogue: [talk('Familia', 'Desde hoy te llamaras Kotyhoroshko.', 'left', 'hero')],
    interaction: {
      label: 'Haz rodar el guisante',
      prompt: 'Toca el pequeno brillo.',
      response: 'El guisante gira y deja una cola de estrellas.',
      effect: 'trail',
    },
    media: image(
      '/scenes/scene-12/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_d3f7968bcc.jpeg',
      'El nino persigue el guisante magico y se lo come',
    ),
  },
  {
    id: 13,
    title: 'Crece como un heroe',
    text: ['Kotyhoroshko empezo a crecer tan deprisa que en una semana ya era mas alto que su padre.'],
    theme: 'wonder',
    atmosphere: 'magic',
    narrator: narrator('El nino crece por horas y su fuerza sorprende a todos.'),
    dialogue: [talk('Padre', 'Mira como ha crecido nuestro hijo.', 'left', 'warm')],
    interaction: {
      label: 'Estira la sombra',
      prompt: 'Toca la figura del heroe.',
      response: 'La sombra del heroe se alarga orgullosa.',
      effect: 'pulse',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-13/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_06fe0b9593.jpeg',
      'Kotyhoroshko crece con rapidez extraordinaria junto a su familia',
    ),
  },
  {
    id: 14,
    title: 'La piedra del pozo',
    text: ['Mientras su padre buscaba ayuda, Kotyhoroshko levanto una piedra enorme con una sola mano.'],
    theme: 'hearth',
    atmosphere: 'embers',
    narrator: narrator('La fuerza de Kotyhoroshko ya no cabe en juegos pequenos.'),
    dialogue: [talk('Vecinos', 'Como puede levantar esa roca?', 'right', 'mystic')],
    interaction: {
      label: 'Empuja la roca',
      prompt: 'Toca la piedra.',
      response: 'La roca se levanta un poco.',
      effect: 'shake',
    },
    media: video(
      '/scenes/scene-14/Man_holding_rock_breathing_0b7efe448e.mp4',
      'Kotyhoroshko levanta una piedra enorme con una sola mano',
      '/scenes/scene-14/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_46e28116b7.jpeg',
    ),
    videoGame: {
      type: 'hold',
      title: 'Ayuda a levantar la roca',
      description: 'Da empujones rapidos para llenar la fuerza de Kotyhoroshko y levantar la roca.',
      actionLabel: 'Levantar',
    },
  },
  {
    id: 15,
    title: 'La maza del herrero',
    text: ['Kotyhoroshko fue al herrero y le pidio una maza pesada para ir a salvar a su familia.'],
    theme: 'forge',
    atmosphere: 'embers',
    narrator: narrator('Antes de luchar, el heroe necesita una herramienta digna de su fuerza.'),
    dialogue: [
      talk('Kotyhoroshko', 'Forjame una maza para enfrentar al dragon.', 'left', 'hero'),
      talk('Herrero', 'Hare una maza fuerte como el hierro.', 'right', 'warm'),
    ],
    interaction: {
      label: 'Golpea el yunque',
      prompt: 'Toca el yunque.',
      response: 'Saltan chispas doradas por el taller.',
      effect: 'sparkle',
    },
    panelAlign: 'right',
    media: image('/scenes/scene-15/________16289b34e6jpeg_a1a7040ef6.jpeg', 'El herrero forja la pesada maza de Kotyhoroshko'),
  },
  {
    id: 16,
    title: 'La prueba del cielo',
    text: ['Kotyhoroshko lanzo la maza al cielo y pidio que lo despertaran cuando regresara.'],
    theme: 'sky',
    atmosphere: 'starlight',
    narrator: narrator('La maza sube tanto que parece tocar las estrellas.'),
    dialogue: [talk('Kotyhoroshko', 'Despertadme cuando la maza vuelva del cielo.', 'left', 'hero')],
    interaction: {
      label: 'Lanza la maza',
      prompt: 'Toca el cielo.',
      response: 'Una estela brillante cruza las nubes.',
      effect: 'trail',
    },
    media: image(
      '/scenes/scene-16/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_62f5e3bb0d.jpeg',
      'Kotyhoroshko lanza su maza hacia el cielo para probar su fuerza',
    ),
  },
  {
    id: 17,
    title: 'El regreso de la maza',
    text: ['Doce dias despues, la maza regreso zumbando y cortando el aire.'],
    theme: 'sky',
    atmosphere: 'starlight',
    narrator: narrator('El cielo devuelve la maza con un rugido de viento.'),
    dialogue: [],
    interaction: {
      label: 'Atrapala',
      prompt: 'Toca la estela brillante.',
      response: 'La maza silba y deja un destello.',
      effect: 'pulse',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-17/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_e72b8efca2.jpeg',
      'La maza desciende desde el cielo con un estruendo',
    ),
  },
  {
    id: 18,
    title: 'Forjar de nuevo',
    text: ['Kotyhoroshko volvio al herrero y le pidio reforjar la maza para hacerla aun mas resistente.'],
    theme: 'forge',
    atmosphere: 'embers',
    narrator: narrator('Un heroe prudente se prepara dos veces antes de la gran lucha.'),
    dialogue: [
      talk('Kotyhoroshko', 'Hazla todavia mas fuerte.', 'left', 'hero'),
      talk('Herrero', 'Entonces cantara mas duro el hierro.', 'right', 'warm'),
    ],
    interaction: {
      label: 'Enciende la forja',
      prompt: 'Toca las brasas.',
      response: 'El horno ruge con mas calor.',
      effect: 'glow',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-18/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_5a6c5004eb.jpeg',
      'Kotyhoroshko regresa al herrero para reforjar la maza',
    ),
  },
  {
    id: 19,
    title: 'Lista para el combate',
    text: ['La nueva maza resistio el golpe de su puno. Entonces Kotyhoroshko supo que ya podia luchar.'],
    theme: 'forge',
    atmosphere: 'embers',
    narrator: narrator('Ahora la maza esta lista y tambien el corazon del heroe.'),
    dialogue: [talk('Kotyhoroshko', 'Con esta maza ire contra el dragon.', 'left', 'hero')],
    interaction: {
      label: 'Prueba el metal',
      prompt: 'Toca la maza.',
      response: 'El hierro vibra con fuerza.',
      effect: 'pulse',
    },
    media: image('/scenes/scene-19/___________49ae497244.jpeg', 'La segunda maza resiste la prueba del puno de Kotyhoroshko'),
  },
  {
    id: 20,
    title: 'El viaje al patio del dragon',
    text: ['Kotyhoroshko siguio el viejo surco cubierto de hierba hasta encontrar la guarida del dragon.'],
    theme: 'trail',
    atmosphere: 'wind',
    narrator: narrator('El heroe camina solo, pero el camino ya conoce su nombre.'),
    dialogue: [],
    interaction: {
      label: 'Marca el camino',
      prompt: 'Desliza por la hierba.',
      response: 'La senda vuelve a aparecer.',
      effect: 'trail',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-20/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_5cb26906a6.jpeg',
      'Kotyhoroshko sigue la antigua marca del arado hasta la guarida del dragon',
    ),
  },
  {
    id: 21,
    title: 'El reto final',
    text: ['El dragon pregunto otra vez si Kotyhoroshko venia a luchar o a hacer las paces.'],
    theme: 'dragon',
    atmosphere: 'mist',
    narrator: narrator('El patio del dragon espera el combate definitivo.'),
    dialogue: [
      talk('Dragon', 'Has venido a luchar o a hacer las paces?', 'right', 'danger'),
      talk('Kotyhoroshko', 'He venido a liberar a mi familia.', 'left', 'hero'),
    ],
    interaction: {
      label: 'Llama al heroe',
      prompt: 'Toca al heroe.',
      response: 'Kotyhoroshko avanza sin retroceder.',
      effect: 'pulse',
    },
    media: video(
      '/scenes/scene-21/Boy_walking_toward_castle_469fe2bb13.mp4',
      'Kotyhoroshko avanza hacia la guarida del dragon para el reto final',
      '/scenes/scene-21/______e3814a2548.jpeg',
    ),
  },
  {
    id: 22,
    title: 'El silbido del monstruo',
    text: ['Junto al roble de hierro, el dragon silbo y el aire entero empezo a resonar.'],
    theme: 'duel',
    atmosphere: 'wind',
    narrator: narrator('El silbido del monstruo sacude hojas, ramas y polvo.'),
    dialogue: [talk('Dragon', 'Escucha mi fuerza.', 'right', 'danger')],
    interaction: {
      label: 'Haz sonar el aire',
      prompt: 'Toca el viento.',
      response: 'El patio zumba a tu alrededor.',
      effect: 'sway',
    },
    panelAlign: 'right',
    media: image(
      '/scenes/scene-22/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_d0763a94e7.jpeg',
      'El dragon silba bajo el roble de hierro y hace temblar el patio',
    ),
  },
  {
    id: 23,
    title: 'El engano astuto',
    text: ['Kotyhoroshko engano al dragon para que cerrara los ojos y entonces le golpeo la frente con la maza.'],
    theme: 'duel',
    atmosphere: 'embers',
    narrator: narrator('La fuerza del heroe tambien sabe pensar rapido.'),
    dialogue: [
      talk('Kotyhoroshko', 'Cuando silbo yo, mas vale cerrar los ojos.', 'left', 'hero'),
      talk('Dragon', 'Entonces no mirare.', 'right', 'danger'),
    ],
    interaction: {
      label: 'Golpea con la maza',
      prompt: 'Toca la frente del dragon.',
      response: 'El golpe retumba por todo el patio.',
      effect: 'shake',
    },
    media: image('/scenes/scene-23/__________________60e9413e5d.jpeg', 'Kotyhoroshko engana al dragon y lo golpea con la maza'),
  },
  {
    id: 24,
    title: 'Sin tregua',
    text: ['El dragon quiso hacer las paces, pero Kotyhoroshko rechazo la tregua y siguio luchando.'],
    theme: 'duel',
    atmosphere: 'embers',
    narrator: narrator('Ya no hay vuelta atras. El duelo debe terminar.'),
    dialogue: [
      talk('Dragon', 'Y si hacemos las paces?', 'right', 'danger'),
      talk('Kotyhoroshko', 'No. A luchar.', 'left', 'hero'),
    ],
    interaction: {
      label: 'Haz rugir el suelo',
      prompt: 'Toca el patio.',
      response: 'La tierra responde al combate.',
      effect: 'shake',
    },
    panelAlign: 'right',
    media: image('/scenes/scene-24/_____________9aaf4cce3c.jpeg', 'El dragon intenta pactar, pero Kotyhoroshko rechaza la tregua'),
  },
  {
    id: 25,
    title: 'El golpe decisivo',
    text: ['Kotyhoroshko lanzo al dragon contra el roble de hierro y la cola del monstruo quedo atrapada.'],
    theme: 'duel',
    atmosphere: 'embers',
    narrator: narrator('El cuento llega a su gran estallido final bajo el roble de hierro.'),
    dialogue: [talk('Abuela Mila', 'Y asi llego el golpe decisivo.', 'left', 'mystic')],
    interaction: {
      label: 'Haz brillar el final',
      prompt: 'Toca el ultimo destello.',
      response: 'El final se llena de chispas doradas.',
      effect: 'sparkle',
    },
    media: image(
      '/scenes/scene-25/Reinterpretacin_moderna_y_coherente_de_un_cuento_t_b18fd58a45.jpeg',
      'Kotyhoroshko asesta el golpe decisivo al dragon junto al roble de hierro',
    ),
  },
]

const BG_BY_THEME: Record<SceneTheme, string> = {
  hearth: '#1a0e0a',
  field: '#121a12',
  forest: '#0f1a14',
  dragon: '#1a0c0c',
  dungeon: '#0d1018',
  wonder: '#101a16',
  forge: '#1a0f0a',
  sky: '#0f1622',
  trail: '#16140c',
  duel: '#180c0f',
  escape: '#0f101b',
}

const WEATHER_BY_SCENE: Record<number, SceneWeather> = {
  3: { type: 'rain', intensity: 'heavy' },
  7: { type: 'snow', intensity: 'light' },
  12: { type: 'rain', intensity: 'medium' },
}

const HOTSPOTS_BY_SCENE: Record<number, SceneHotspot[]> = {
  5: [
    { x: 25, y: 60, icon: '🍄', tooltip: 'Hongo magico' },
    { x: 70, y: 40, icon: '🦋', tooltip: 'Mariposa' },
  ],
  9: [
    { x: 35, y: 45, icon: '✨', tooltip: 'Destello' },
  ],
  18: [
    { x: 62, y: 52, icon: '🌿', tooltip: 'Hoja' },
  ],
}

export const SCENES: Scene[] = BASE_SCENES.map((scene) => ({
  ...scene,
  bgColor: scene.bgColor ?? BG_BY_THEME[scene.theme],
  weather: WEATHER_BY_SCENE[scene.id] ?? { type: 'none' },
  hotspots: HOTSPOTS_BY_SCENE[scene.id],
}))

export const TOTAL_SCENES = SCENES.length

export function getSceneById(id: number) {
  return SCENES.find((scene) => scene.id === id)
}
