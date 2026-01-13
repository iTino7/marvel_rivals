import { ChevronDown } from 'lucide-react'

interface ArrowProps {
  onClick?: () => void
  animate?: boolean
  className?: string
}

function Arrow({ onClick, animate = true, className = '' }: ArrowProps) {
  return (
    <div 
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 ${className}`}
      onClick={onClick}
    >
      <div className={animate ? 'animate-bounce' : ''}>
        <ChevronDown className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  )
}

export default Arrow
