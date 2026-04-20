import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const avatarStyles = tv({
  base: [
    'inline-grid place-items-center shrink-0',
    'bg-[linear-gradient(135deg,oklch(0.78_0.08_230),oklch(0.55_0.12_280))]',
    'text-white font-semibold',
  ],
  variants: {
    size: {
      sm: 'w-5 h-5 text-[9px]',
      md: 'w-[26px] h-[26px] text-[10.5px]',
      lg: 'w-9 h-9 text-[13px]',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-sm',
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
})

type AvatarVariants = VariantProps<typeof avatarStyles>
export type AvatarSize = NonNullable<AvatarVariants['size']>
export type AvatarShape = NonNullable<AvatarVariants['shape']>

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize
  shape?: AvatarShape
  children?: ReactNode
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  className,
  children,
  ...rest
}: AvatarProps) {
  return (
    <div className={avatarStyles({ size, shape, class: className })} {...rest}>
      {children}
    </div>
  )
}
