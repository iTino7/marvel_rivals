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
  const backgroundImageUrl = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/af7dfb2d-8cc1-45ab-9bab-6b0d0c655e58/dkityey-a717fbab-d77c-41d8-82a8-c3c3e8f0b2cd.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9hZjdkZmIyZC04Y2MxLTQ1YWItOWJhYi02YjBkMGM2NTVlNTgvZGtpdHlleS1hNzE3ZmJhYi1kNzdjLTQxZDgtODJhOC1jM2MzZThmMGIyY2QuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GrVmbMigER-u6S3JxlFdUt5IR-ZT-fCFSyeM_vzHMII'

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
      <nav className="bg-black relative z-10">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MarvelRivalsTitle />
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 relative overflow-hidden z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {HomeStrings.welcome}
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 font-semibold">
            {HomeStrings.exploreHeroes} <span className="inline-block transform -skew-x-12">{HomeStrings.marvel}</span>
          </p>
          <Link
            to="/heroes"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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

