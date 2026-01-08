import { useMemo } from 'react'
import { useHeroes } from '@/hooks/useHeroes'
import type { Role, HeroElement } from '@/lib/types'

interface HeroesListProps {
  searchQuery: string
}

interface HeroCardProps {
  hero: HeroElement
  getImageUrl: (hero: HeroElement) => string
}

function HeroCard({ hero, getImageUrl }: HeroCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden hover:overflow-visible w-full h-[450px] flex items-center justify-center cursor-pointer relative group border border-gray-200 dark:border-0"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
      }}
      onMouseMove={(e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 30
        const rotateY = (centerX - x) / 30
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
      }}
    >
      {/* Container per immagine originale - completamente statico e sempre contenuto */}
      <div className="w-full h-full flex items-center justify-center z-10 overflow-hidden">
        <img
          src={getImageUrl(hero)}
          alt={hero.name}
          className="w-full h-full object-contain scale-125 md:scale-135 lg:scale-140 xl:scale-135 2xl:scale-130"
        />
      </div>
      {/* Duplicato a colori - solo parte superiore sovrapposta, visibile solo al hover e può uscire dalla card */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <img
          src={getImageUrl(hero)}
          alt=""
          className="w-full h-full object-contain scale-125 md:scale-135 lg:scale-140 xl:scale-135 2xl:scale-130"
          style={{ 
            clipPath: 'inset(0 0 85% 0)'
          }}
        />
      </div>
    </div>
  )
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
                <HeroCard key={hero.id} hero={hero} getImageUrl={getImageUrl} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default HeroesList

