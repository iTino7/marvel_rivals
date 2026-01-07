import { useQuery } from '@tanstack/react-query'
import { getHeroes } from '@/lib/api'
import type { HeroElement } from '@/lib/types'

export const useHeroes = () => {
  return useQuery<HeroElement[]>({
    queryKey: ['heroes'],
    queryFn: getHeroes,
  })
}

