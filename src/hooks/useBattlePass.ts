import { useQuery } from '@tanstack/react-query'
import { getBattlePass } from '@/lib/api'

export const useBattlePass = (season?: string | number) => {
  return useQuery({
    queryKey: ['battlepass', season],
    queryFn: () => getBattlePass(season),
  })
}
