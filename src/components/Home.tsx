import { useState } from 'react'
import { Link } from 'react-router-dom'
import CircularText from './CircularText'
import Lore from './Lore'
import Arrow from './Arrow'

function Home() {
  const [arrowClicked, setArrowClicked] = useState(false)
  const backgroundImageUrl = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/af7dfb2d-8cc1-45ab-9bab-6b0d0c655e58/dkityey-a717fbab-d77c-41d8-82a8-c3c3e8f0b2cd.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9hZjdkZmIyZC04Y2MxLTQ1YWItOWJhYi02YjBkMGM2NTVlNTgvZGtpdHlleS1hNzE3ZmJhYi1kNzdjLTQxZDgtODJhOC1jM2MzZThmMGIyY2QuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GrVmbMigER-u6S3JxlFdUt5IR-ZT-fCFSyeM_vzHMII'

  return (
    <>
      {/* Lore sempre presente dietro Home */}
      <div className="fixed inset-0 z-0">
        <Lore />
      </div>
      
      {/* Home sopra Lore */}
      <div 
        className="min-h-screen relative overflow-hidden z-10"
        style={{
          clipPath: arrowClicked ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
          transition: 'clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
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
          <Arrow 
            onClick={() => setArrowClicked(true)}
            animate={!arrowClicked}
          />
          <div className="absolute bottom-8 right-8 pointer-events-none overflow-visible" style={{ willChange: 'transform' }}>
            <CircularText 
              text="MARVEL*RIVALS*HEROES*" 
              className="w-[150px] h-[150px] [&_span]:text-[#fbdb2b]"
              spinDuration={30}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

