import { useParams } from 'react-router-dom'
import { useHeroes } from '@/hooks/useHeroes'
import MarvelRivalsTitle from '@/components/MarvelRivalsTitle'
import type { HeroElement } from '@/lib/types'

function SingleHero() {
  const { name } = useParams<{ name: string }>()
  const { data: heroes, isLoading } = useHeroes()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    )
  }

  const decodedName = name ? decodeURIComponent(name) : ''
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

  const imageUrl = getImageUrl(hero)
  
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
      {/* Immagine del personaggio in fondo, posizione fissa */}
      <div className="flex justify-center items-end min-h-[calc(100vh-4rem)] relative z-10">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={hero.name}
            className="max-w-full max-h-[80vh] object-contain"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))'
            }}
          />
        )}
      </div>
      
      {/* Nome reale e Lore in basso a sinistra */}
      <div className="absolute bottom-0 left-0 z-10 p-4 md:p-6 lg:p-8 max-w-lg md:max-w-xl lg:max-w-2xl">
        {hero.real_name && (
          <h2 className="text-white text-lg md:text-xl font-bold mb-2 opacity-40 transform -skew-x-12">
            {hero.real_name}
          </h2>
        )}
        {displayLore && (
          <p className="text-white text-sm md:text-base leading-relaxed opacity-40">
            {displayLore}
          </p>
        )}
      </div>
    </div>
  )
}

export default SingleHero
