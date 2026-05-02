import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * DateChip — a button-style date trigger. Used in filter bars where we
 * want to control the popover ourselves (versus the native date input).
 * Pairs naturally with `DatePicker` inside a `Popover`.
 */
const dateChipStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5',
      'h-7 px-2.5 rounded-sm',
      'border border-line bg-bg-elev text-sm text-text cursor-pointer',
      'shadow-xs transition-colors duration-[.12s]',
      'hover:bg-bg-sunk',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-xs),var(--shadow-focus)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ],
    icon: 'shrink-0 text-text-dim',
    caret: 'shrink-0 text-text-dim ml-0.5',
  },
  variants: {
    selected: {
      true:  { base: 'bg-accent-weak text-accent-ink border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)]', icon: 'text-accent-ink', caret: 'text-accent-ink' },
      false: {},
    },
    size: {
      sm: { base: 'h-6 px-2 text-xs gap-1' },
      md: {},
    },
  },
  defaultVariants: { selected: false, size: 'md' },
})

type DateChipVariants = VariantProps<typeof dateChipStyles>
export type DateChipSize = NonNullable<DateChipVariants['size']>

export interface DateChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks the chip as the active end of a range (or the picked date). */
  selected?: boolean
  size?: DateChipSize
  /** Hide the leading calendar icon. */
  noIcon?: boolean
  /** Hide the trailing chevron. */
  noCaret?: boolean
  children?: ReactNode
}

const calendarIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const caretIcon = (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const DateChip = forwardRef<HTMLButtonElement, DateChipProps>(function DateChip(
  { selected, size, noIcon, noCaret, className, children, ...rest },
  ref,
) {
  const { base, icon, caret } = dateChipStyles({ selected, size })
  return (
    <button ref={ref} type="button" className={base({ class: className })} {...rest}>
      {!noIcon && <span className={icon()}>{calendarIcon}</span>}
      <span>{children}</span>
      {!noCaret && <span className={caret()}>{caretIcon}</span>}
    </button>
  )
})
