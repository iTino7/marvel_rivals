import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useHeroes } from '@/hooks/useHeroes'
import MarvelRivalsTitle from '@/components/MarvelRivalsTitle'
import Navbar from '@/components/Navbar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import HeroCarousel from '@/components/HeroCarousel'
import Ability from '@/components/Ability'
import Stats from '@/components/Stats'
import { SingleHeroStrings } from '@/lib/strings'
import type { HeroElement } from '@/lib/types'

function SingleHero() {
  const { name } = useParams<{ name: string }>()
  const { data: heroes, isLoading } = useHeroes()
  // Mappa che salva il costume selezionato per ogni personaggio (per ID)
  const [selectedCostumes, setSelectedCostumes] = useState<Record<string, string | null>>({})
  const [showStats, setShowStats] = useState(false)
  const [isLoreOpen, setIsLoreOpen] = useState(false)
  const statsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (showStats && statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showStats])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">{SingleHeroStrings.loading}</div>
      </div>
    )
  }

  const decodedName = name ? decodeURIComponent(name) : ''
  
  const hero = heroes?.find(h => h.name === decodedName)
  
  // Ottieni il costume selezionato per questo personaggio, o null se non c'è
  const selectedCostumeIcon = hero ? (selectedCostumes[hero.id] ?? null) : null

  if (!hero) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar searchValue="" onSearchChange={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="text-white text-xl mb-4">{SingleHeroStrings.heroNotFound}</div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    )
  }

  const getImageUrl = (hero: HeroElement) => {
    // Controlla se c'è un costume selezionato per questo eroe
    const selectedCostumeForHero = selectedCostumes[hero.id]
    const costumeIcon = selectedCostumeForHero || hero.costumes.find((costume) => costume.icon !== null)?.icon
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
  
  // Filtra i costumi che hanno un'icona
  const costumesWithIcons = hero.costumes.filter(costume => costume.icon !== null)
  
  // Determina quale costume è attualmente selezionato
  const currentSelectedIcon = selectedCostumeIcon || hero.costumes.find((costume) => costume.icon !== null)?.icon
  const isCostumeSelected = (costumeIcon: string | null) => {
    if (!costumeIcon || !currentSelectedIcon) return false
    return getCostumeIconUrl(costumeIcon) === getCostumeIconUrl(currentSelectedIcon)
  }
  
  const handleCostumeClick = (costumeIcon: string | null) => {
    if (costumeIcon && hero) {
      setSelectedCostumes(prev => ({
        ...prev,
        [hero.id]: costumeIcon
      }))
    }
  }
  
  // Prepara il testo della lore
  const loreText = hero.lore?.trim() || hero.bio?.trim() || ''
  const hasValidLore = loreText && !loreText.toLowerCase().includes('no lore available')
  const displayLore = hasValidLore ? loreText : (hero.bio || '')

  return (
    <>
    <div 
      className="min-h-screen relative overflow-hidden animate-[fadeIn_0.5s_ease-in-out]" 
      style={{ zIndex: 20 }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
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
      {/* Oscura lo sfondo quando l'accordion è aperto (mobile) */}
      <div
        className={`absolute inset-0 z-10 bg-black/40 transition-opacity max-[576px]:block ${
          isLoreOpen ? 'opacity-100' : 'opacity-0'
        } ${isLoreOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden="true"
      />
      
      <nav className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MarvelRivalsTitle />
          </div>
          <div className="flex items-center max-[576px]:w-[180px] max-[576px]:justify-end">
            <h1 className="text-3xl md:text-4xl font-bold text-white transform -skew-x-12 max-[576px]:text-xl max-[576px]:leading-tight max-[576px]:truncate">
              {hero.name}
            </h1>
          </div>
        </div>
      </nav>
      {/* Carosello personaggi */}
      <div
        className={`flex justify-center items-end min-h-[calc(100vh-4rem)] relative z-10 px-4 max-[576px]:items-center ${
          isLoreOpen ? 'max-[576px]:pointer-events-none' : ''
        } ${isLoreOpen ? 'max-[576px]:opacity-60' : ''}`}
      >
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
      <div className="absolute bottom-0 left-0 z-10 p-4 md:p-6 lg:p-8 max-w-lg md:max-w-xl lg:max-w-2xl max-[576px]:left-1/2 max-[576px]:-translate-x-1/2 max-[576px]:text-center max-[576px]:w-full max-[576px]:max-w-lg max-[576px]:-translate-y-10">
        {hero.real_name && displayLore && (
          <>
            <div className="max-[576px]:hidden">
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 opacity-100 transform -skew-x-12">
                {hero.real_name}
              </h2>
              <p className="text-white text-sm md:text-base leading-relaxed opacity-100">
                {displayLore}
              </p>
            </div>
            <div className="min-[577px]:hidden relative z-20">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                onValueChange={(value) => setIsLoreOpen(Boolean(value))}
              >
                <AccordionItem value="hero-lore">
                  <AccordionTrigger className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold opacity-100 transform -skew-x-12 text-center justify-center max-[576px]:items-center [&>svg]:translate-y-0 [&>svg]:self-center [&>svg]:text-white">
                    {hero.real_name}
                  </AccordionTrigger>
                  <AccordionContent className="text-white text-sm leading-relaxed text-center">
                    {displayLore}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {hero.real_name && !displayLore && (
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 opacity-100 transform -skew-x-12 max-[576px]:text-center">
            {hero.real_name}
          </h2>
        )}
        {displayLore && !hero.real_name && (
          <div className="max-[576px]:flex max-[576px]:justify-center">
            <p className="text-white text-sm md:text-base leading-relaxed opacity-100 max-[576px]:text-center">
              {displayLore}
            </p>
          </div>
        )}
      </div>
      
      {/* Icone costumi in alto (solo mobile) */}
      {costumesWithIcons.length > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex max-w-[90vw] items-center gap-2 overflow-x-auto px-2 min-[577px]:hidden">
          {costumesWithIcons.map((costume) => {
            const isSelected = isCostumeSelected(costume.icon)
            return (
            <div
              key={costume.id}
              onClick={() => handleCostumeClick(costume.icon)}
              className={`w-14 h-14 border-2 border-white bg-transparent overflow-hidden flex-shrink-0 hover:border-yellow-400 transition-all duration-200 cursor-pointer ${
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

      {/* Icone costumi a destra (desktop/tablet) */}
      {costumesWithIcons.length > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 lg:right-8 z-10 hidden min-[577px]:flex flex-col gap-2 md:gap-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
      
      {/* Gradiente di transizione morbida alla fine */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      />
      
      {/* Freccia rimbalzante in basso */}
      <div className="absolute bottom-8 max-[576px]:bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="animate-bounce">
          <ChevronDown className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
      
      {/* CSS per animazione bounce personalizzata */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
    {/* Componente Ability */}
    <Ability
      hero={hero}
      onStatsClick={() => setShowStats(true)}
    />
    {showStats && (
      <section id="hero-stats" ref={statsRef}>
        <Stats hero={hero} />
      </section>
    )}
    </>
  )
}

export default SingleHero
