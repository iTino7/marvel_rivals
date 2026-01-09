import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import { useHeroes } from '@/hooks/useHeroes'
import type { HeroElement } from '@/lib/types'

function Lore() {
  const { data: heroes, isLoading } = useHeroes()
  const [randomHero, setRandomHero] = useState<HeroElement | null>(null)
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
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  if (!randomHero) {
    return (
      <div className="fixed inset-0 bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Nessun eroe disponibile</div>
      </div>
    )
  }

  const costumeImageUrl = getCostumeImageUrl(randomHero)

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
        <div className="absolute inset-0 opacity-50 z-1">
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
      
      <div className="absolute top-8 right-16 w-24 h-28 border-2 border-black bg-transparent overflow-hidden z-10" style={{ transform: 'perspective(200px) rotateY(-3deg)' }}>
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
      
      <div className="flex flex-col items-start justify-center min-h-screen px-4 relative z-10">
        <div className="w-full max-w-[90%] pl-4 md:pl-8 lg:pl-12 transform translate-y-[150%]">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-8 transform -skew-x-12 pb-1 border-b border-black w-full">
            {randomHero.name}
          </h1>
          <p className="text-black mt-4 text-lg leading-relaxed w-full transform -skew-x-12">
            {randomHero.lore}
          </p>
        </div>
      </div>
      <Link to="/heroes">
        <Arrow animate={true} className="[&_svg]:text-black" />
      </Link>
    </div>
  )
}

export default Lore
