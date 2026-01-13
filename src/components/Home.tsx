import { useState } from 'react'
import { Link } from 'react-router-dom'
import CircularText from './CircularText'
import Lore from './Lore'
import Arrow from './Arrow'
import MarvelRivalsTitle from './MarvelRivalsTitle'
import Transition from './Transition'
import { HomeStrings } from '@/lib/strings'

function Home() {
  const [arrowClicked, setArrowClicked] = useState(false)
  const backgroundImageUrl = '/4_cf02a3f6.jpg'

  return (
    <Transition
      background={<Lore />}
      direction="bottom"
      isTransitioning={arrowClicked}
    >
      <div 
        className="fixed inset-0 -z-10 bg-cover sm:bg-cover md:bg-cover lg:bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      />
      {/* Overlay scuro per migliorare il contrasto del testo */}
      <div className="fixed inset-0 -z-10 bg-black/40" />
      <nav className="bg-black/80 backdrop-blur-sm relative z-10">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MarvelRivalsTitle />
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative overflow-hidden z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {HomeStrings.welcome}
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 font-semibold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {HomeStrings.exploreHeroes} <span className="inline-block transform -skew-x-12 text-yellow-400 drop-shadow-[0_4px_12px_rgba(251,219,43,0.5)]">{HomeStrings.marvel}</span>
          </p>
          <Link
            to="/heroes"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
          >
            {HomeStrings.seeAllHeroes}
          </Link>
        </div>
        <Arrow 
          onClick={() => setArrowClicked(true)}
          animate={!arrowClicked}
        />
        <div className="absolute bottom-8 right-8 pointer-events-none overflow-visible" style={{ willChange: 'transform' }}>
          <CircularText 
            text={HomeStrings.circularText} 
            className="w-[150px] h-[150px] [&_span]:text-[#fbdb2b]"
            spinDuration={30}
          />
        </div>
      </div>
    </Transition>
  )
}

export default Home

