import { ReactNode } from 'react'

type TransitionDirection = 'top' | 'bottom' | 'left' | 'right'

interface TransitionProps {
  children: ReactNode
  background: ReactNode
  direction?: TransitionDirection
  isTransitioning: boolean
  onTransitionComplete?: () => void
  transitionDuration?: number
}

function Transition({ 
  children, 
  background, 
  direction = 'bottom',
  isTransitioning,
  onTransitionComplete,
  transitionDuration = 600
}: TransitionProps) {
  const getClipPath = () => {
    switch (direction) {
      case 'top':
        return isTransitioning ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)'
      case 'bottom':
        return isTransitioning ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)'
      case 'left':
        return isTransitioning ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)'
      case 'right':
        return isTransitioning ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)'
      default:
        return 'inset(0 0 0 0)'
    }
  }

  // Gestisce il callback quando la transizione è completa
  const handleTransitionEnd = () => {
    if (isTransitioning && onTransitionComplete) {
      onTransitionComplete()
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background sempre presente dietro */}
      <div className="absolute inset-0 z-0">
        {background}
      </div>
      
      {/* Contenuto sopra con transizione */}
      <div 
        className="min-h-screen relative overflow-hidden z-10"
        style={{
          clipPath: getClipPath(),
          transition: `clip-path ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    </div>
  )
}

export default Transition
