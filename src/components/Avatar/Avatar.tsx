import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const avatarStyles = tv({
  slots: {
    base: [
      'inline-grid place-items-center shrink-0 relative',
      'text-white font-semibold',
    ],
    presence: [
      'absolute bottom-0 right-0 rounded-full',
      'border-2 border-bg-elev',
    ],
  },
  variants: {
    size: {
      sm: { base: 'w-5 h-5 text-[9px]',         presence: 'w-1.5 h-1.5 border' },
      md: { base: 'w-[26px] h-[26px] text-[10.5px]', presence: 'w-2 h-2' },
      lg: { base: 'w-9 h-9 text-[13px]',        presence: 'w-2.5 h-2.5' },
    },
    shape: {
      circle: { base: 'rounded-full' },
      square: { base: 'rounded-sm' },
    },
    tone: {
      azure:  { base: 'bg-[linear-gradient(135deg,oklch(0.78_0.10_230),oklch(0.55_0.14_250))]' },
      rose:   { base: 'bg-[linear-gradient(135deg,oklch(0.78_0.13_15),oklch(0.55_0.18_350))]' },
      amber:  { base: 'bg-[linear-gradient(135deg,oklch(0.84_0.13_75),oklch(0.62_0.16_50))]' },
      mint:   { base: 'bg-[linear-gradient(135deg,oklch(0.82_0.10_160),oklch(0.55_0.14_175))]' },
      violet: { base: 'bg-[linear-gradient(135deg,oklch(0.74_0.12_300),oklch(0.50_0.18_290))]' },
      stone:  { base: 'bg-[linear-gradient(135deg,oklch(0.62_0.02_250),oklch(0.40_0.02_250))]' },
    },
  },
  defaultVariants: { size: 'md', shape: 'circle', tone: 'azure' },
})

type AvatarVariants = VariantProps<typeof avatarStyles>
export type AvatarSize = NonNullable<AvatarVariants['size']>
export type AvatarShape = NonNullable<AvatarVariants['shape']>
export type AvatarTone = NonNullable<AvatarVariants['tone']>
export type AvatarPresence = 'ok' | 'warn' | 'err' | 'idle'

const presenceClass: Record<AvatarPresence, string> = {
  ok:   'bg-ok',
  warn: 'bg-warn',
  err:  'bg-err',
  idle: 'bg-text-dim',
}

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize
  shape?: AvatarShape
  /** Brand gradient. Pick one of six fixed tones, or pass `none` and provide a custom `style.background`. */
  tone?: AvatarTone | 'none'
  /** Status dot rendered at the bottom-right corner. */
  presence?: AvatarPresence
  children?: ReactNode
}

export function Avatar({
  size = 'md',
  shape = 'circle',
  tone = 'azure',
  presence,
  className,
  children,
  ...rest
}: AvatarProps) {
  const variantTone = tone === 'none' ? undefined : tone
  const { base, presence: presenceCls } = avatarStyles({ size, shape, tone: variantTone })
  return (
    <div className={base({ class: className })} {...rest}>
      {children}
      {presence && (
        <span
          aria-hidden
          className={`${presenceCls()} ${presenceClass[presence]}`}
        />
      )}
    </div>
  )
}
