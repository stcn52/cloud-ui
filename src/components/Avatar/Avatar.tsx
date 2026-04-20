import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize
  shape?: AvatarShape
  children?: ReactNode
}

const sizeClass: Record<AvatarSize, string> = {
  sm: 'sm',
  md: '',
  lg: 'lg',
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  className,
  children,
  ...rest
}: AvatarProps) {
  return (
    <div className={cx('avatar', sizeClass[size], shape === 'square' && 'sq', className)} {...rest}>
      {children}
    </div>
  )
}
