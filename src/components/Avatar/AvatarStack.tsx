import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const avatarStackStyles = tv({
  base: [
    'inline-flex',
    '[&>*]:shadow-[0_0_0_2px_var(--color-bg-elev)] [&>*]:-ml-1.5',
    '[&>*:first-child]:ml-0',
  ],
})

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function AvatarStack({ className, children, ...rest }: AvatarStackProps) {
  return (
    <div className={avatarStackStyles({ class: className })} {...rest}>
      {children}
    </div>
  )
}
