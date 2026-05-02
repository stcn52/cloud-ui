import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { useLocale } from '../../context/ConfigProvider'

export const pillStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-[5px]',
      'px-[7px] rounded-xs border',
      'text-xs font-medium',
    ],
    dotc: 'w-1.5 h-1.5 rounded-full bg-current',
    removeBtn: [
      'ml-0.5 w-[14px] h-[14px] rounded-full grid place-items-center',
      'text-inherit opacity-60 text-[10px]',
      'hover:opacity-100 hover:bg-[color-mix(in_oklch,currentColor_15%,transparent)]',
    ],
  },
  variants: {
    tone: {
      neutral: { base: 'bg-bg-sunk text-text-muted border-line' },
      ok:      { base: 'text-ok bg-[color-mix(in_oklch,var(--color-ok)_10%,transparent)] border-[color-mix(in_oklch,var(--color-ok)_25%,transparent)]' },
      warn:    { base: 'text-warn bg-[color-mix(in_oklch,var(--color-warn)_14%,transparent)] border-[color-mix(in_oklch,var(--color-warn)_30%,transparent)]' },
      err:     { base: 'text-err bg-[color-mix(in_oklch,var(--color-err)_10%,transparent)] border-[color-mix(in_oklch,var(--color-err)_25%,transparent)]' },
      info:    { base: 'text-accent-ink bg-accent-weak border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)]' },
      solid:   { base: 'bg-text text-bg border-text' },
    },
    size: {
      xs: { base: 'h-[18px] text-[10.5px] px-1.5 gap-1', dotc: 'w-1 h-1' },
      md: { base: 'h-5' },
      lg: { base: 'h-6 text-sm px-[9px]' },
    },
    mono: {
      true:  { base: 'font-mono text-[10.5px]' },
      false: {},
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md', mono: false },
})

type PillVariants = VariantProps<typeof pillStyles>
export type PillTone = NonNullable<PillVariants['tone']>
export type PillSize = NonNullable<PillVariants['size']>

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
  size?: PillSize
  mono?: boolean
  dot?: boolean
  dotColor?: string
  onRemove?: () => void
  children?: ReactNode
}

export function Pill({
  tone = 'neutral',
  size = 'md',
  mono,
  dot,
  dotColor,
  onRemove,
  className,
  children,
  ...rest
}: PillProps) {
  const locale = useLocale()
  const { base, dotc, removeBtn } = pillStyles({ tone, size, mono })
  return (
    <span className={base({ class: className })} {...rest}>
      {dot && <span className={dotc()} style={dotColor ? { color: dotColor } : undefined} />}
      {children}
      {onRemove && (
        <button
          type="button"
          className={removeBtn()}
          aria-label={locale.pill.remove}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}
