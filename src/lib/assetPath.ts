/**
 * Normaliza una ruta de asset local.
 * Decodifica primero para evitar doble codificación, luego vuelve a codificar.
 */
export function assetPath(src: string): string {
  try {
    return encodeURI(decodeURI(src))
  } catch {
    return src
  }
}
