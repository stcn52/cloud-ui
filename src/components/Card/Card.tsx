import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const cardStyles = tv({
  base: 'bg-bg-elev border border-line rounded-md shadow-sm',
})

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cardStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}

const cardHeadStyles = tv({
  slots: {
    base: 'flex items-center gap-2.5 px-3.5 py-2.5 border-b border-line',
    title: 'text-sm font-semibold',
    sub: 'text-xs text-text-dim ml-auto font-mono',
  },
})

export interface CardHeadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  sub?: ReactNode
  children?: ReactNode
}

export function CardHead({ title, sub, className, children, ...rest }: CardHeadProps) {
  const { base, title: titleCls, sub: subCls } = cardHeadStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {title !== undefined && <span className={titleCls()}>{title}</span>}
      {children}
      {sub !== undefined && <span className={subCls()}>{sub}</span>}
    </div>
  )
}

const cardFootStyles = tv({
  base: [
    'flex items-center gap-2 px-3.5 py-2.5 border-t border-line bg-bg-sunk',
    'text-xs text-text-muted',
  ],
})

export interface CardFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function CardFoot({ className, children, ...rest }: CardFootProps) {
  return (
    <div className={cardFootStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}
