import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cx('card', className)} {...rest}>
      {children}
    </div>
  )
}

export interface CardHeadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  sub?: ReactNode
  children?: ReactNode
}

export function CardHead({ title, sub, className, children, ...rest }: CardHeadProps) {
  return (
    <div className={cx('card-head', className)} {...rest}>
      {title !== undefined && <span className="card-title">{title}</span>}
      {children}
      {sub !== undefined && <span className="card-sub">{sub}</span>}
    </div>
  )
}

export interface CardFootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function CardFoot({ className, children, ...rest }: CardFootProps) {
  return (
    <div className={cx('card-foot', className)} {...rest}>
      {children}
    </div>
  )
}
