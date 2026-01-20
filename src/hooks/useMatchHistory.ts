import { useQuery } from '@tanstack/react-query'
import { getPlayerMatchHistory } from '@/lib/api'
import { MatchHistorySchema, type MatchHistory } from '@/lib/matchHistoryTypes'

export const useMatchHistory = (query: string, season: string) => {
  return useQuery<MatchHistory>({
    queryKey: ['matchHistory', query, season],
    enabled: Boolean(query),
    queryFn: async () => {
      const payload = await getPlayerMatchHistory(query, season)
      return MatchHistorySchema.parse(payload)
    },
  })
}
