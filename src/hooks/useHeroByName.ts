import { useQuery } from '@tanstack/react-query'
import { getHeroByName } from '@/lib/api'
import type { HeroElement } from '@/lib/types'

export const useHeroByName = (query: string) => {
  const trimmed = query.trim()
  return useQuery<HeroElement | null>({
    queryKey: ['heroByName', trimmed],
    enabled: Boolean(trimmed),
    queryFn: () => getHeroByName(trimmed),
  })
}
