import { useQuery } from '@tanstack/react-query'
import { getMapById } from '@/lib/api'
import { DescriptionMapSchema } from '@/lib/mapTypes'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const buildMapImageUrl = (path?: string): string | null => {
  if (!path) return null
  if (path.startsWith('http://')) {
    return path.replace('http://', 'https://')
  }
  if (path.startsWith('https://')) {
    return path
  }
  return `https://marvelrivalsapi.com${path}`
}

const extractMapDetails = (payload: unknown): { name?: string; imageLarge?: string } | null => {
  const candidates: unknown[] = []
  if (isRecord(payload)) {
    candidates.push(payload)
    if (isRecord(payload.map)) candidates.push(payload.map)
    if (isRecord(payload.data)) candidates.push(payload.data)
  }

  for (const candidate of candidates) {
    const parsed = DescriptionMapSchema.safeParse(candidate)
    if (parsed.success) {
      const { name, images } = parsed.data
      const largeImage =
        images.find((image) => image.includes('/large/')) ||
        images.find((image) => image.includes('/xl/')) ||
        images[images.length - 1]
      return { name, imageLarge: buildMapImageUrl(largeImage) ?? undefined }
    }
  }

  return null
}

export const useMapNames = (mapIds: number[]) => {
  const ids = Array.from(new Set(mapIds)).filter((id) => Number.isFinite(id))

  return useQuery({
    queryKey: ['mapNames', ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const payload = await getMapById(id)
            const details = extractMapDetails(payload)
            return details ? ([id, details] as const) : null
          } catch {
            return null
          }
        })
      )

      const map = new Map<number, { name?: string; imageLarge?: string }>()
      for (const entry of entries) {
        if (entry) {
          map.set(entry[0], entry[1])
          if (entry[1].imageLarge) {
            console.log('map image', { id: entry[0], url: entry[1].imageLarge })
          }
        }
      }
      return map
    },
  })
}
