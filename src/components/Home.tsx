import { Link } from 'react-router-dom'
import CircularText from './CircularText'
import { useMaps } from '@/hooks/useMaps'
import { getMapPremiumImageUrl } from '@/lib/maps'

function Home() {
  const { data: mapsData } = useMaps()
  const selectedMap = mapsData?.maps?.[1]
  const mapImageUrl = selectedMap ? getMapPremiumImageUrl(selectedMap) : null

  return (
    <div className="min-h-screen relative">
      {/* Sfondo con mappa - dietro tutto */}
      {mapImageUrl && (
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url(${mapImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      <nav className="bg-black relative z-10">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white transform -skew-x-12">Marvel Rivals</h1>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative overflow-hidden z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Benvenuto in Marvel Rivals
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 font-semibold">
            Esplora tutti gli eroi <span className="inline-block transform -skew-x-12">Marvel</span>
          </p>
          <Link
            to="/heroes"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Vedi tutti gli eroi
          </Link>
        </div>
        {/* Freccia animata in basso */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
        {/* CircularText in basso a destra */}
        <div className="absolute bottom-8 right-8 pointer-events-none overflow-visible" style={{ willChange: 'transform' }}>
          <CircularText 
            text="MARVEL*RIVALS*HEROES*" 
            className="w-[150px] h-[150px] [&_span]:text-[#fbdb2b]"
            spinDuration={30}
          />
        </div>
      </div>
    </div>
  )
}

export default Home

