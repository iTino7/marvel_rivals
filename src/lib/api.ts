import axios from 'axios'
import { z } from 'zod'
import { HeroElementSchema, type HeroElement, MapsSchema, type Maps } from './types'

const API_BASE_URL = 'https://marvelrivalsapi.com/api/v1'

// Imposta qui la tua chiave API
const API_KEY = import.meta.env.VITE_API_KEY || ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
})

// Schema per validare l'array di eroi
const HeroesArraySchema = z.array(HeroElementSchema)

export const getHeroes = async (): Promise<HeroElement[]> => {
  const response = await apiClient.get<unknown>('/heroes')
  
  // Valida i dati con Zod
  try {
    const heroesArray = HeroesArraySchema.parse(response.data)
    return heroesArray
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Errore di validazione Zod:', error.issues)
      throw new Error(`Dati non validi dall'API: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw error
  }
}

// Schema per validare la risposta delle mappe
export const getMaps = async (): Promise<Maps> => {
  const response = await apiClient.get<unknown>('/maps')
  
  // Valida i dati con Zod
  try {
    const mapsData = MapsSchema.parse(response.data)
    return mapsData
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Errore di validazione Zod:', error.issues)
      throw new Error(`Dati non validi dall'API: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw error
  }
}

// Esporta gli schemi per uso esterno se necessario
export { HeroElementSchema, MapSchema, MapsSchema } from './types'
export { HeroesArraySchema }

