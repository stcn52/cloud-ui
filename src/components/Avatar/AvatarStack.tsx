import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function AvatarStack({ className, children, ...rest }: AvatarStackProps) {
  return (
    <div className={cx('avatar-stack', className)} {...rest}>
      {children}
    </div>
  )
}
