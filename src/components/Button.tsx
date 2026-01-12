import { ButtonStrings } from '@/lib/strings'

interface ButtonProps {
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

function Button({ onClick, className = '', children = ButtonStrings.defaultText }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-14 py-3 font-semibold text-black transition-colors duration-200 w-full max-w-2xl !bg-[#fbdb2b] !opacity-100 cursor-pointer ${className}`}
      style={{ 
        backgroundColor: '#fbdb2b', 
        opacity: 1,
        background: '#fbdb2b',
        MozOpacity: 1,
        transform: 'skewX(-12deg)',
        transformOrigin: 'bottom left'
      }}
    >
      {children}
    </button>
  )
}

export default Button
