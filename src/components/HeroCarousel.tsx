import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HeroElement } from '@/lib/types'

interface HeroCarouselProps {
  currentHero: HeroElement
  allHeroes: HeroElement[]
  getImageUrl: (hero: HeroElement) => string
  getMainImageUrl?: (hero: HeroElement) => string
}

function HeroCarousel({ currentHero, allHeroes, getImageUrl, getMainImageUrl }: HeroCarouselProps) {
  const navigate = useNavigate()
  const [isRotating, setIsRotating] = useState(false)
  
  // Trova l'indice del personaggio corrente
  const currentIndex = allHeroes.findIndex(h => h.id === currentHero.id)
  
  // Ottieni i personaggi a sinistra e destra
  const getSideHeroes = () => {
    const leftIndex = currentIndex > 0 ? currentIndex - 1 : allHeroes.length - 1
    const rightIndex = currentIndex < allHeroes.length - 1 ? currentIndex + 1 : 0
    
    return {
      left: allHeroes[leftIndex],
      right: allHeroes[rightIndex]
    }
  }
  
  const { left, right } = getSideHeroes()
  
  const handleHeroClick = (hero: HeroElement) => {
    if (isRotating || hero.id === currentHero.id) return
    
    setIsRotating(true)
    
    // Aspetta che l'animazione finisca prima di navigare
    setTimeout(() => {
      navigate(`/hero/${encodeURIComponent(hero.name)}`, { replace: false })
      setIsRotating(false)
    }, 300)
  }
  
  return (
    <div className="flex items-center justify-center gap-0 relative w-full h-full" style={{ gap: '-200px' }}>
      {/* Personaggio a sinistra */}
      <div 
        className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
          isRotating ? 'opacity-30 pointer-events-none' : 'opacity-30 hover:opacity-100'
        }`}
        onClick={() => handleHeroClick(left)}
        style={{
          marginRight: '-350px'
        }}
      >
        <img 
          src={getImageUrl(left)} 
          alt={left.name}
          className="max-w-full max-h-[80vh] object-contain"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>
      
      {/* Personaggio principale al centro */}
      <div 
        className="flex-shrink-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isRotating ? 0 : 1,
          zIndex: 10
        }}
      >
        <img 
          src={getMainImageUrl ? getMainImageUrl(currentHero) : getImageUrl(currentHero)} 
          alt={currentHero.name}
          className="max-w-full max-h-[80vh] object-contain"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>
      
      {/* Personaggio a destra */}
      <div 
        className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
          isRotating ? 'opacity-30 pointer-events-none' : 'opacity-30 hover:opacity-100'
        }`}
        onClick={() => handleHeroClick(right)}
        style={{
          marginLeft: '-350px',
          transformOrigin: 'right',
          
        }}
      >
        <img 
          src={getImageUrl(right)} 
          alt={right.name}
          className="max-w-full max-h-[80vh] object-contain"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>
    </div>
  )
}

export default HeroCarousel
