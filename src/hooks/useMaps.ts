import { useQuery } from '@tanstack/react-query'
import { getMaps } from '@/lib/api'
import type { Maps } from '@/lib/types'

export const useMaps = () => {
  return useQuery<Maps>({
    queryKey: ['maps'],
    queryFn: getMaps,
  })
}
