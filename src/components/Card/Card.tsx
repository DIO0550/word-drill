import './Card.scss'

type CardProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  const isInteractive = !!onClick
  
  return (
    <div 
      className={`card ${isInteractive ? 'card--interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
