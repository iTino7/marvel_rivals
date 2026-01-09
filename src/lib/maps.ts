import type { Map } from './types'

// File per gestire le mappe
// Questo file può essere esteso con funzioni di utilità per le mappe

/**
 * Ottiene l'URL della prima immagine della mappa
 */
export const getMapImageUrl = (map: Map): string => {
  if (!map.images || map.images.length === 0) return ''
  const imageUrl = map.images[0]
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return `https://marvelrivalsapi.com/rivals/${imageUrl}`
}

/**
 * Ottiene l'URL dell'immagine premium della mappa (3° elemento, indice 2)
 */
export const getMapPremiumImageUrl = (map: Map): string => {
  if (!map.images || map.images.length < 3) return ''
  const imageUrl = map.images[2]
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  // Costruisce l'URL premium: https://marvelrivalsapi.com/premium/maps/xl/{imageUrl}
  return `https://marvelrivalsapi.com${imageUrl}`
}

/**
 * Ottiene tutte le immagini della mappa
 */
export const getMapImages = (map: Map): string[] => {
  if (!map.images || map.images.length === 0) return []
  return map.images.map(image => {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    return `https://marvelrivalsapi.com/rivals/${image}`
  })
}

/**
 * Ottiene l'URL del video della mappa se disponibile
 */
export const getMapVideoUrl = (map: Map): string | null => {
  if (!map.video) return null
  if (map.video.startsWith('http://') || map.video.startsWith('https://')) {
    return map.video
  }
  // Se il video inizia con /, usa direttamente il percorso
  if (map.video.startsWith('/')) {
    return `https://marvelrivalsapi.com${map.video}`
  }
  return `https://marvelrivalsapi.com/rivals/${map.video}`
}

/**
 * Ottiene l'URL della thumbnail della sub-map se disponibile
 * Nota: attualmente sub_map_thumbnail è sempre null nello schema
 */
export const getSubMapThumbnailUrl = (map: Map): string | null => {
  return map.sub_map_thumbnail
}
