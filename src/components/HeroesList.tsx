import { useMemo } from 'react'
import { useHeroes } from '@/hooks/useHeroes'
import type { Role, HeroElement } from '@/lib/types'

interface HeroesListProps {
  searchQuery: string
}

function HeroesList({ searchQuery }: HeroesListProps) {
  const { data: heroes, isLoading, error } = useHeroes()

  // Filtra gli eroi in base alla query di ricerca
  const filteredHeroes = useMemo(() => {
    if (!heroes) return []
    if (!searchQuery.trim()) return heroes
    
    const query = searchQuery.toLowerCase().trim()
    return heroes.filter((hero) => 
      hero.name.toLowerCase().includes(query) ||
      hero.real_name.toLowerCase().includes(query)
    )
  }, [heroes, searchQuery])

  // Raggruppa gli eroi per ruolo
  const heroesByRole = useMemo<Record<Role, HeroElement[]>>(() => {
    const grouped: Record<Role, HeroElement[]> = {
      Duelist: [],
      Strategist: [],
      Vanguard: [],
    }
    
    if (filteredHeroes) {
      filteredHeroes.forEach((hero) => {
        grouped[hero.role].push(hero)
      })
    }
    
    return grouped
  }, [filteredHeroes])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">Caricamento eroi...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600 dark:text-red-400">
          Errore nel caricamento degli eroi
        </div>
      </div>
    )
  }

  if (!heroes || heroes.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">Nessun eroe trovato</div>
      </div>
    )
  }

  if (searchQuery.trim() && filteredHeroes.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Nessun eroe trovato per "{searchQuery}"
        </div>
      </div>
    )
  }

  const roles: Role[] = ['Vanguard', 'Duelist', 'Strategist']
  
  const getImageUrl = (hero: HeroElement) => {
    // Usa l'icona dal primo costume disponibile, altrimenti usa l'icona dell'eroe, altrimenti transformation, altrimenti imageUrl
    const costumeIcon = hero.costumes.find(costume => costume.icon !== null)?.icon
    const iconToUse = costumeIcon || hero.icon || hero.transformations[0]?.icon || hero.imageUrl
    if (!iconToUse) return ''
    if (iconToUse.startsWith('http://') || iconToUse.startsWith('https://')) {
      return iconToUse
    }
    return `https://marvelrivalsapi.com/rivals/${iconToUse}`
  }

  return (
    <div className="py-8 w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">
        Eroi Marvel Rivals
      </h2>
      
      {roles.map((role) => {
        const roleHeroes = heroesByRole[role]
        if (roleHeroes.length === 0) return null
        
        return (
          <div key={role} id={role.toLowerCase()} className="mb-12 w-full scroll-mt-20">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 px-4">
              {role}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 w-full">
              {roleHeroes.map((hero) => (
                <div
                  key={hero.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full h-[450px] flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={getImageUrl(hero)}
                    alt={hero.name}
                    className="w-full h-full object-contain scale-125 md:scale-135 lg:scale-140 xl:scale-135 2xl:scale-130"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HeroesList

