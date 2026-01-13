import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SingleHero from '@/pages/SingleHero'

function SingleHeroWithTransition() {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Reset visibility quando cambia la route
    setIsVisible(false)
    // Dopo un breve delay, mostra SingleHero con fade-in
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div 
      className={`transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <SingleHero />
    </div>
  )
}

export default SingleHeroWithTransition
