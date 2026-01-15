import { useQuery } from '@tanstack/react-query'
import { getHeroStats } from '@/lib/api'

export const useHeroStats = (heroName: string) => {
  return useQuery({
    queryKey: ['heroStats', heroName],
    queryFn: () => getHeroStats(heroName),
    enabled: Boolean(heroName),
  })
}
