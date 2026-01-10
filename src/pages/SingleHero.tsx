import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHeroes } from '@/hooks/useHeroes'
import MarvelRivalsTitle from '@/components/MarvelRivalsTitle'
import HeroCarousel from '@/components/HeroCarousel'
import type { HeroElement } from '@/lib/types'

function SingleHero() {
  const { name } = useParams<{ name: string }>()
  const { data: heroes, isLoading } = useHeroes()
  const [selectedCostumeIcon, setSelectedCostumeIcon] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  const decodedName = name ? decodeURIComponent(name) : ''
  
  // Reset del costume selezionato quando cambia l'eroe
  useEffect(() => {
    setSelectedCostumeIcon(null)
  }, [decodedName])
  
  const hero = heroes?.find(h => h.name === decodedName)

  if (!hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Personaggio non trovato</div>
      </div>
    )
  }

  const getImageUrl = (hero: HeroElement) => {
    const costumeIcon = hero.costumes.find((costume) => costume.icon !== null)?.icon
    const iconToUse = costumeIcon || hero.icon || hero.transformations[0]?.icon || hero.imageUrl
    if (!iconToUse) return ''
    if (iconToUse.startsWith('http://') || iconToUse.startsWith('https://')) {
      return iconToUse
    }
    return `https://marvelrivalsapi.com/rivals/${iconToUse}`
  }

  // Funzione per ottenere l'URL dell'immagine principale con il costume selezionato
  const getMainImageUrl = (hero: HeroElement) => {
    const costumeIcon = selectedCostumeIcon || hero.costumes.find((costume) => costume.icon !== null)?.icon
    const iconToUse = costumeIcon || hero.icon || hero.transformations[0]?.icon || hero.imageUrl
    if (!iconToUse) return ''
    if (iconToUse.startsWith('http://') || iconToUse.startsWith('https://')) {
      return iconToUse
    }
    return `https://marvelrivalsapi.com/rivals/${iconToUse}`
  }

  const getCostumeIconUrl = (icon: string | null) => {
    if (!icon) return ''
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      return icon
    }
    return `https://marvelrivalsapi.com/rivals/${icon}`
  }

  const imageUrl = getImageUrl(hero)
  
  // Filtra i costumi che hanno un'icona
  const costumesWithIcons = hero.costumes.filter(costume => costume.icon !== null)
  
  // Determina quale costume è attualmente selezionato
  const currentSelectedIcon = selectedCostumeIcon || hero.costumes.find((costume) => costume.icon !== null)?.icon
  const isCostumeSelected = (costumeIcon: string | null) => {
    if (!costumeIcon || !currentSelectedIcon) return false
    return getCostumeIconUrl(costumeIcon) === getCostumeIconUrl(currentSelectedIcon)
  }
  
  const handleCostumeClick = (costumeIcon: string | null) => {
    if (costumeIcon) {
      setSelectedCostumeIcon(costumeIcon)
    }
  }
  
  // Prepara il testo della lore
  const loreText = hero.lore?.trim() || hero.bio?.trim() || ''
  const hasValidLore = loreText && !loreText.toLowerCase().includes('no lore available')
  const displayLore = hasValidLore ? loreText : (hero.bio || '')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base con gradiente sottile - Colori neutri */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 z-0" />
      
      {/* Divisione diagonale con clip-path - Colori neutri */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 z-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)',
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)'
        }}
      />
      
      {/* Texture noise sottile */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Ombre di profondità agli angoli */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-full z-0"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.05) 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-1/2 h-full z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(0,0,0,0.3) 0%, transparent 70%)'
        }}
      />
      
      <nav className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MarvelRivalsTitle />
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white transform -skew-x-12">
              {hero.name}
            </h1>
          </div>
        </div>
      </nav>
      {/* Carosello personaggi */}
      <div className="flex justify-center items-end min-h-[calc(100vh-4rem)] relative z-10 px-4">
        {heroes && (
          <HeroCarousel 
            currentHero={hero}
            allHeroes={heroes}
            getImageUrl={getImageUrl}
            getMainImageUrl={getMainImageUrl}
          />
        )}
      </div>
      
      {/* Nome reale e Lore in basso a sinistra */}
      <div className="absolute bottom-0 left-0 z-10 p-4 md:p-6 lg:p-8 max-w-lg md:max-w-xl lg:max-w-2xl">
        {hero.real_name && (
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 opacity-100 transform -skew-x-12">
            {hero.real_name}
          </h2>
        )}
        {displayLore && (
          <p className="text-white text-sm md:text-base leading-relaxed opacity-100">
            {displayLore}
          </p>
        )}
      </div>
      
      {/* Icone costumi a destra */}
      {costumesWithIcons.length > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 lg:right-8 z-10 flex flex-col gap-2 md:gap-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {costumesWithIcons.map((costume) => {
            const isSelected = isCostumeSelected(costume.icon)
            return (
            <div
              key={costume.id}
              onClick={() => handleCostumeClick(costume.icon)}
              className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 border-white bg-transparent overflow-hidden flex-shrink-0 hover:border-yellow-400 transition-all duration-200 cursor-pointer ${
                isSelected ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <img
                src={getCostumeIconUrl(costume.icon)}
                alt={costume.name}
                className="w-full h-full object-cover object-center"
                style={{
                  objectPosition: 'center top',
                  transform: 'scale(3.0) rotate(10deg) translateX(5%) translateY(-10%)',
                  transformOrigin: 'top'
                }}
              />
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SingleHero
