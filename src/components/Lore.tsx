import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Button from './Button'
import { useHeroes } from '@/hooks/useHeroes'
import { LoreStrings } from '@/lib/strings'
import type { HeroElement } from '@/lib/types'

function Lore() {
  const { data: heroes, isLoading } = useHeroes()
  const [randomHero, setRandomHero] = useState<HeroElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const hasSelectedHero = useRef(false)

  useEffect(() => {
    if (heroes && heroes.length > 0 && !hasSelectedHero.current) {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * heroes.length)
        setRandomHero(heroes[randomIndex])
        hasSelectedHero.current = true
      }, 0)
    }
  }, [heroes])

  const getImageUrl = (hero: HeroElement) => {
    const costumeIcon = hero.costumes.find(costume => costume.icon !== null)?.icon
    const iconToUse = costumeIcon || hero.icon || hero.transformations[0]?.icon || hero.imageUrl
    if (!iconToUse) return ''
    if (iconToUse.startsWith('http://') || iconToUse.startsWith('https://')) {
      return iconToUse
    }
    return `https://marvelrivalsapi.com/rivals/${iconToUse}`
  }

  const getCostumeImageUrl = (hero: HeroElement) => {
    const costumesWithIcon = hero.costumes.filter(costume => costume.icon !== null)
    if (costumesWithIcon.length < 1) return ''
    
    const firstCostume = costumesWithIcon[0]
    if (!firstCostume?.icon) return ''
    
    const iconUrl = firstCostume.icon
    if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) {
      return iconUrl
    }
    return `https://marvelrivalsapi.com/rivals/${iconUrl}`
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{LoreStrings.loading}</div>
      </div>
    )
  }

  if (!randomHero) {
    return (
      <div className="fixed inset-0 bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">{LoreStrings.noHeroAvailable}</div>
      </div>
    )
  }

  const costumeImageUrl = getCostumeImageUrl(randomHero)

  const loreText = randomHero.lore?.trim() || ''
  const bioText = randomHero.bio?.trim() || ''
  const hasValidLore = loreText && !loreText.toLowerCase().includes('no lore available')
  const displayText = hasValidLore ? loreText : (bioText || LoreStrings.noDescriptionAvailable)

  // Filtra gli altri eroi escludendo quello corrente
  const otherHeroes = heroes?.filter(hero => hero.id !== randomHero.id) || []

  const handleHeroChange = (hero: HeroElement) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setRandomHero(hero)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  return (
    <div className="fixed inset-0 bg-white min-h-screen">
      <div className="absolute inset-0 opacity-10 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="graffiti-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="50" x2="100" y2="50" stroke="black" strokeWidth="1.5" opacity="0.2"/>
              <line x1="50" y1="0" x2="50" y2="100" stroke="black" strokeWidth="1.5" opacity="0.2"/>
              <line x1="0" y1="100" x2="100" y2="0" stroke="black" strokeWidth="2" opacity="0.3"/>
              <line x1="20" y1="0" x2="80" y2="100" stroke="black" strokeWidth="1" opacity="0.15"/>
              <line x1="80" y1="0" x2="20" y2="100" stroke="black" strokeWidth="1" opacity="0.15"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graffiti-pattern)" />
        </svg>
      </div>
      
      {costumeImageUrl && (
        <div className={`absolute inset-0 z-1 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-50'}`}>
          <img 
            src={costumeImageUrl} 
            alt={randomHero.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: '0% 10%' }}
          />
        </div>
      )}
      
      <div className="absolute top-8 left-8 z-10 flex items-center h-28">
        <h2 className="text-4xl md:text-5xl font-bold text-black transform skew-x-12">
          {randomHero.real_name}
        </h2>
      </div>
      
      <div className="absolute top-8 right-16 z-10">
        <div className="relative w-24 h-28">
          {/* Icona originale */}
          <div className="w-24 h-28 border-2 border-black bg-transparent overflow-hidden" style={{ transform: 'perspective(200px) rotateY(-3deg)' }}>
            <img 
              src={getImageUrl(randomHero)} 
              alt={randomHero.name}
              className="w-full h-full object-cover object-center"
              style={{ 
                objectPosition: 'center top',
                transform: 'scale(3.0) rotate(10deg) translateX(5%) translateY(-10%)',
                transformOrigin: 'top'
              }}
            />
          </div>
          {/* Icona duplicata sovrapposta tagliata al 50% */}
          <div className="absolute inset-0 w-24 h-28 bg-transparent overflow-visible" style={{ transform: 'perspective(200px) rotateY(-3deg)' }}>
            <img 
              src={getImageUrl(randomHero)} 
              alt={randomHero.name}
              className="w-full h-full object-cover object-center"
              style={{ 
                objectPosition: 'center top',
                transform: 'scale(3.0) rotate(10deg) translateX(5%) translateY(-10%)',
                transformOrigin: 'top',
                clipPath: 'inset(0 30% 60% 40%)'
              }}
            />
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col items-start justify-center min-h-screen px-4 relative z-10 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : ''}`}>
        <div className="w-full max-w-[90%] pl-4 md:pl-8 lg:pl-12 transform translate-y-[150%]">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-8 transform -skew-x-12 pb-1 border-b border-black w-full">
            {randomHero.name}
          </h1>
          <p className="text-black mt-4 mb-[-10px] text-lg leading-relaxed w-full transform -skew-x-12">
            {displayText}
          </p>
        </div>
      </div>
      {/* Icone altri personaggi sotto l'icona principale */}
      <div className="absolute right-16 top-40 z-10 flex flex-col items-center gap-3">
        <div 
          className="flex flex-col items-center gap-3 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {otherHeroes.map((hero) => (
            <div 
              key={hero.id} 
              className="w-24 h-28 shrink-0 border-2 border-black bg-transparent overflow-hidden opacity-40 hover:opacity-60 transition-opacity cursor-pointer"
              style={{ transform: 'perspective(200px) rotateY(-3deg)' }}
              onClick={() => handleHeroChange(hero)}
            >
              <img 
                src={getImageUrl(hero)} 
                alt={hero.name}
                className="w-full h-full object-cover object-center"
                style={{ 
                  objectPosition: 'center top',
                  transform: 'scale(3.0) rotate(10deg) translateX(5%) translateY(-10%)',
                  transformOrigin: 'top'
                }}
              />
            </div>
          ))}
        </div>
        {otherHeroes.length > 5 && (
          <div className="mt-2 opacity-60 animate-bounce">
            <ChevronDown className="w-6 h-6 text-black" />
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <Link to={`/hero/${encodeURIComponent(randomHero.name)}`} className="block opacity-100!" style={{ opacity: 1 }}>
          <Button className="text-xl md:text-2xl ">{LoreStrings.goToDetails}</Button>
        </Link>
      </div>
    </div>
  )
}

export default Lore
