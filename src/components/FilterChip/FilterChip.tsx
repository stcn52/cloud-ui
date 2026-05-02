import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * A FilterChip is the visual token for "one filter."
 * Variants:
 *   - `add`    — dashed border, opens picker
 *   - `plain`  — idle key (no value yet)
 *   - `active` — key + value, accent-tinted, with a remove ×
 *   - `count`  — label with a numeric badge
 *   - `invalid` — error state for bad syntax
 */
export const filterChipStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1.5',
      'h-[22px] px-2 rounded-xs border',
      'text-xs leading-none whitespace-nowrap',
      'cursor-pointer select-none',
      'transition-colors duration-[.12s]',
      'bg-bg-elev text-text-muted border-line',
      'hover:bg-bg-sunk hover:text-text',
      'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:opacity-45 disabled:cursor-not-allowed',
    ],
    key:   'text-text-dim',
    value: 'text-text font-medium',
    remove: [
      'inline-grid place-items-center w-3.5 h-3.5 rounded-full text-[10px] leading-none',
      'text-inherit opacity-60 ml-0.5',
      'hover:opacity-100 hover:bg-[color-mix(in_oklch,currentColor_15%,transparent)]',
    ],
    count: [
      'inline-flex items-center justify-center',
      'min-w-[16px] h-[14px] px-1 rounded-full',
      'font-mono text-[10.5px] [font-variant-numeric:tabular-nums]',
      'bg-bg-sunk text-text-muted',
    ],
  },
  variants: {
    variant: {
      plain:   {},
      active:  {
        base: 'bg-accent-weak text-accent-ink border-[color-mix(in_oklch,var(--color-accent)_30%,transparent)] hover:bg-accent-weak',
        count: 'bg-[color-mix(in_oklch,var(--color-accent)_20%,transparent)] text-accent-ink',
      },
      add:     {
        base: 'border-dashed text-text-dim hover:text-text hover:border-line-strong',
      },
      invalid: {
        base: 'bg-[color-mix(in_oklch,var(--color-err)_8%,transparent)] text-err border-[color-mix(in_oklch,var(--color-err)_40%,transparent)] hover:bg-[color-mix(in_oklch,var(--color-err)_12%,transparent)]',
      },
    },
  },
  defaultVariants: { variant: 'plain' },
})

type FilterChipVariants = VariantProps<typeof filterChipStyles>
export type FilterChipVariant = NonNullable<FilterChipVariants['variant']>

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  variant?: FilterChipVariant
  /** Filter key shown in dim color before the value (e.g. `env:`). */
  filterKey?: ReactNode
  /** Filter value shown in strong color (e.g. `prod`). */
  value?: ReactNode
  /** Rendered as a numeric badge after the label. Use for `count` variant. */
  count?: ReactNode
  /** Free-form children — rendered after key/value/count, useful for icons. */
  children?: ReactNode
  /** When set, a `×` remove button is rendered and this fires on click. */
  onRemove?: (e: MouseEvent<HTMLSpanElement>) => void
}

export function FilterChip({
  variant = 'plain',
  filterKey,
  value,
  count,
  onRemove,
  className,
  children,
  ...rest
}: FilterChipProps) {
  const { base, key, value: valueCls, remove, count: countCls } = filterChipStyles({ variant })
  return (
    <button type="button" className={base({ class: className })} {...rest}>
      {children}
      {filterKey !== undefined && <span className={key()}>{filterKey}</span>}
      {value !== undefined && <span className={valueCls()}>{value}</span>}
      {count !== undefined && <span className={countCls()}>{count}</span>}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remove filter"
          className={remove()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(e)
          }}
        >
          ×
        </span>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FilterBar — the horizontal strip that holds chips + search + actions       */
/* ────────────────────────────────────────────────────────────────────────── */

const filterBarStyles = tv({
  base: 'flex items-center gap-1.5 flex-wrap',
})

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FilterBar({ className, children, ...rest }: FilterBarProps) {
  return (
    <div className={filterBarStyles({ class: className })} role="toolbar" {...rest}>
      {children}
    </div>
  )
}
