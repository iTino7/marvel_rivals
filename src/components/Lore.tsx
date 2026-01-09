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

  return (
    <div className="fixed inset-0 bg-black min-h-screen">
      <div className="absolute top-8 right-16 w-18 h-20 border-2 border-white bg-transparent overflow-hidden z-10" style={{ transform: 'perspective(200px) rotateY(-3deg)' }}>
        <img 
          src={getImageUrl(randomHero)} 
          alt={randomHero.name}
          className="w-full h-full object-cover object-center"
          style={{ 
            objectPosition: 'center 15%',
            transform: 'scale(2.7)',
            transformOrigin: 'center top'
          }}
        />
      </div>
      
      <div className="flex flex-col items-start justify-center min-h-screen px-4 relative z-10">
        <div className="w-full max-w-[90%] pl-4 md:pl-8 lg:pl-12 transform translate-y-[105%]">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 transform -skew-x-12 pb-1 border-b border-white w-full">
            {randomHero.name}
          </h1>
          <p className="text-white mt-4 text-lg leading-relaxed w-full">
            {randomHero.lore}
          </p>
        </div>
      </div>
      <Link to="/heroes">
        <Arrow animate={true} />
      </Link>
    </div>
  )
}

export default Lore
