import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const base = 'rounded-lg bg-white'
  const variants = {
    default: 'shadow-sm border border-gray-100',
    elevated: 'shadow-md',
    outlined: 'border border-gray-200',
  }
  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>{children}</div>
}

export function CardBody({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 ${className}`} {...props}>{children}</div>
}
