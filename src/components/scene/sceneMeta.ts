import type { SceneTheme } from '@/content/scenes'

export const THEME_META: Record<
  SceneTheme,
  { label: string; mood: string; hint: string; moteClass: string }
> = {
  hearth: {
    label: 'Hogar',
    mood: 'La historia empieza junto al fuego.',
    hint: 'Lee con calma y mueve el texto si tapa la escena.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,214,132,0.95),rgba(214,134,76,0.18)_60%,transparent_100%)]',
  },
  field: {
    label: 'Campo',
    mood: 'Todo parece tranquilo antes del giro del cuento.',
    hint: 'Observa el trabajo del campo antes de continuar.',
    moteClass: 'bg-[radial-gradient(circle,rgba(232,212,140,0.92),rgba(168,138,72,0.16)_60%,transparent_100%)]',
  },
  forest: {
    label: 'Bosque',
    mood: 'El camino se vuelve incierto.',
    hint: 'Busca pistas en la imagen y en los movimientos del fondo.',
    moteClass: 'bg-[radial-gradient(circle,rgba(170,224,158,0.9),rgba(68,132,98,0.15)_60%,transparent_100%)]',
  },
  dragon: {
    label: 'Dragon',
    mood: 'La amenaza ya esta cerca.',
    hint: 'Cuando aparezca un reto, complГ©talo para seguir.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,162,122,0.94),rgba(168,58,34,0.16)_60%,transparent_100%)]',
  },
  dungeon: {
    label: 'Mazmorra',
    mood: 'La luz casi desaparece.',
    hint: 'Activa el modo lectura si quieres mas foco en el texto.',
    moteClass: 'bg-[radial-gradient(circle,rgba(180,197,240,0.88),rgba(88,100,144,0.16)_60%,transparent_100%)]',
  },
  wonder: {
    label: 'Magia',
    mood: 'El cuento respira asombro.',
    hint: 'Deja que la escena aparezca antes de tocar nada.',
    moteClass: 'bg-[radial-gradient(circle,rgba(197,245,192,0.92),rgba(124,170,114,0.15)_60%,transparent_100%)]',
  },
  forge: {
    label: 'Forja',
    mood: 'La fuerza se construye paso a paso.',
    hint: 'Cada escena prepara el combate final.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,190,138,0.92),rgba(170,92,42,0.16)_60%,transparent_100%)]',
  },
  sky: {
    label: 'Cielo',
    mood: 'Todo se vuelve mas grande.',
    hint: 'La historia sube de escala en estas escenas.',
    moteClass: 'bg-[radial-gradient(circle,rgba(188,214,255,0.9),rgba(92,122,180,0.14)_60%,transparent_100%)]',
  },
  trail: {
    label: 'Huella',
    mood: 'El viaje sigue marcado sobre la tierra.',
    hint: 'Sigue el recorrido sin perder el hilo.',
    moteClass: 'bg-[radial-gradient(circle,rgba(224,205,136,0.9),rgba(134,112,62,0.14)_60%,transparent_100%)]',
  },
  duel: {
    label: 'Duelo',
    mood: 'La tension ya no se puede detener.',
    hint: 'Cada escena aqui empuja la historia hacia el choque final.',
    moteClass: 'bg-[radial-gradient(circle,rgba(255,174,138,0.92),rgba(182,76,48,0.16)_60%,transparent_100%)]',
  },
  escape: {
    label: 'Huida',
    mood: 'Nada se queda quieto al final.',
    hint: 'Mantente atento: el peligro sigue en movimiento.',
    moteClass: 'bg-[radial-gradient(circle,rgba(198,208,255,0.9),rgba(112,124,182,0.14)_60%,transparent_100%)]',
  },
}
