import { useQuery } from '@tanstack/react-query'
import { getPlayerMatchHistory } from '@/lib/api'
import { MatchHistorySchema, type MatchHistory } from '@/lib/matchHistoryTypes'

export const useMatchHistory = (query: string) => {
  return useQuery<MatchHistory>({
    queryKey: ['matchHistory', query],
    enabled: Boolean(query),
    queryFn: async () => {
      const payload = await getPlayerMatchHistory(query)
      return MatchHistorySchema.parse(payload)
    },
  })
}
