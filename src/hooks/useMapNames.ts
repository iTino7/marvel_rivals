import { useQuery } from '@tanstack/react-query'
import { getMapById } from '@/lib/api'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const extractMapName = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null
  if (typeof payload.name === 'string') return payload.name
  if (isRecord(payload.map) && typeof payload.map.name === 'string') {
    return payload.map.name
  }
  if (isRecord(payload.data) && typeof payload.data.name === 'string') {
    return payload.data.name
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
            const name = extractMapName(payload)
            return name ? ([id, name] as const) : null
          } catch {
            return null
          }
        })
      )

      const map = new Map<number, string>()
      for (const entry of entries) {
        if (entry) map.set(entry[0], entry[1])
      }
      return map
    },
  })
}
