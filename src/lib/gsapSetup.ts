import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

// Solo plugins gratuitos - SplitText es de pago, no se incluye
gsap.registerPlugin(ScrollTrigger, TextPlugin)

/**
 * Conecta GSAP ScrollTrigger con el scroll gestionado por Lenis.
 * Debe llamarse UNA sola vez, dentro del useEffect de SmoothScroller,
 * despues de crear la instancia de Lenis.
 *
 * Patron moderno para GSAP 3.12+: en lugar de scrollerProxy (deprecado)
 * se actualiza ScrollTrigger manualmente en cada frame del RAF de Lenis.
 */
export function connectGsapToLenis(lenis: import('lenis').default) {
  lenis.on('scroll', () => {
    ScrollTrigger.update()
  })
}

export { gsap, ScrollTrigger }
