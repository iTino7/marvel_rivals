import axios from 'axios'
import { z } from 'zod'
import {
  AttackTypeSchema,
  AbilitySchema,
  CostumeSchema,
  HeroElementSchema,
  type HeroElement,
  MapsSchema,
  type Maps,
  RoleSchema,
  TransformationSchema,
} from './types'

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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const normalizeHeroPayload = (payload: unknown, fallbackName: string): HeroElement | null => {
  if (!isRecord(payload)) return null
  const base = isRecord(payload.data) ? payload.data : payload
  if (!isRecord(base)) return null

  const name = typeof base.name === 'string' ? base.name : fallbackName
  if (!name) return null

  const realName = typeof base.real_name === 'string' ? base.real_name : name
  const role = RoleSchema.options.includes(base.role as string)
    ? (base.role as HeroElement['role'])
    : 'Duelist'
  const attackType = AttackTypeSchema.options.includes(base.attack_type as string)
    ? (base.attack_type as HeroElement['attack_type'])
    : 'Projectile'
  const imageUrl = typeof base.imageUrl === 'string'
    ? base.imageUrl
    : typeof base.image_url === 'string'
      ? base.image_url
      : ''
  const icon = typeof base.icon === 'string' ? base.icon : undefined
  const team = Array.isArray(base.team) ? base.team.filter((item): item is string => typeof item === 'string') : []
  const difficulty = typeof base.difficulty === 'string' ? base.difficulty : ''
  const bio = typeof base.bio === 'string' ? base.bio : ''
  const lore = typeof base.lore === 'string' ? base.lore : ''

  const abilities = z.array(AbilitySchema).safeParse(base.abilities)
  const costumes = z.array(CostumeSchema).safeParse(base.costumes)
  const transformations = z.array(TransformationSchema).safeParse(base.transformations)

  const id = typeof base.id === 'string' ? base.id : base.id != null ? String(base.id) : name

  return {
    id,
    name,
    real_name: realName,
    imageUrl,
    icon,
    role,
    attack_type: attackType,
    team,
    difficulty,
    bio,
    lore,
    transformations: transformations.success ? transformations.data : [],
    costumes: costumes.success ? costumes.data : [],
    abilities: abilities.success ? abilities.data : [],
  }
}

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

// Funzione per ottenere un eroe per nome
export const getHeroByName = async (query: string): Promise<HeroElement | null> => {
  const encodedQuery = encodeURIComponent(query)
  const response = await apiClient.get<unknown>(`/heroes/hero/${encodedQuery}`)
  const payload = response.data

  try {
    const raw = Array.isArray(payload) ? payload[0] : payload
    if (!raw) return null
    const parsed = HeroElementSchema.safeParse(raw)
    if (parsed.success) return parsed.data
    return normalizeHeroPayload(raw, query)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Errore di validazione Zod:', error.issues)
      return null
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

// Funzione per ottenere le statistiche di un eroe
export const getHeroStats = async (query: string): Promise<unknown> => {
  const encodedQuery = encodeURIComponent(query)
  const response = await apiClient.get<unknown>(`/heroes/hero/${encodedQuery}/stats`)
  return response.data
}

// Funzione per ottenere le statistiche di un giocatore
export const getPlayerStats = async (query: string): Promise<unknown> => {
  const encodedQuery = encodeURIComponent(query)
  const response = await apiClient.get<unknown>(`/player/${encodedQuery}`)
  return response.data
}

// Funzione per ottenere la match history di un giocatore (v2)
export const getPlayerMatchHistory = async (
  query: string,
  season: string
): Promise<unknown> => {
  const encodedQuery = encodeURIComponent(query)
  const response = await apiClient.get<unknown>(
    `https://marvelrivalsapi.com/api/v2/player/${encodedQuery}/match-history`,
    { params: { season } }
  )
  return response.data
}

// Funzione per ottenere i dettagli di una mappa tramite ID (v2)
export const getMapById = async (mapId: number): Promise<unknown> => {
  const encodedId = encodeURIComponent(String(mapId))
  const response = await apiClient.get<unknown>(`https://marvelrivalsapi.com/api/v2/map/${encodedId}`)
  return response.data
}

// Esporta gli schemi per uso esterno se necessario
export { HeroElementSchema, MapSchema, MapsSchema } from './types'
export { HeroesArraySchema }

