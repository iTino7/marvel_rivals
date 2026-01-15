import { useQuery } from '@tanstack/react-query'
import { getPlayerStats } from '@/lib/api'

export const usePlayerStats = (query: string) => {
  return useQuery({
    queryKey: ['playerStats', query],
    queryFn: () => getPlayerStats(query),
    enabled: Boolean(query),
  })
}
