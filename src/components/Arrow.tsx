interface ArrowProps {
  onClick?: () => void
  animate?: boolean
  className?: string
}

function Arrow({ onClick, animate = true, className = '' }: ArrowProps) {
  return (
    <div 
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className={animate ? 'animate-bounce' : ''}>
        <svg
          className="w-8 h-8 text-black"
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
    </div>
  )
}

export default Arrow
