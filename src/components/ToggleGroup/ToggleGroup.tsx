import type { HTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

/**
 * ToggleGroup — a denser, more chromaless single-select than `Segmented`.
 * Used inside toolbars and as inline unit toggles ("s / min / h").
 */
const toggleGroupStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-0.5 p-0.5',
      'bg-bg-sunk border border-line rounded-sm',
    ],
    item: [
      'px-2 h-6 rounded-xs cursor-pointer whitespace-nowrap',
      'text-xs text-text-muted bg-transparent border-0',
      'inline-flex items-center gap-1.5',
      'hover:text-text',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-muted',
    ],
    itemOn: 'bg-bg-elev text-text shadow-xs font-medium',
  },
  variants: {
    intent: {
      default: {},
      accent:  { itemOn: 'bg-accent-weak text-accent-ink shadow-none' },
    },
    size: {
      sm: { item: 'h-5 px-1.5 text-[11px]', base: 'p-0.5' },
      md: {},
    },
  },
  defaultVariants: { intent: 'default', size: 'md' },
})

type Variants = VariantProps<typeof toggleGroupStyles>
export type ToggleGroupIntent = NonNullable<Variants['intent']>
export type ToggleGroupSize = NonNullable<Variants['size']>

export interface ToggleGroupOption<V extends string = string> {
  value: V
  label: ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps<V extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly ToggleGroupOption<V>[]
  value: V
  onChange?: (value: V) => void
  intent?: ToggleGroupIntent
  size?: ToggleGroupSize
}

export function ToggleGroup<V extends string = string>({
  options,
  value,
  onChange,
  intent = 'default',
  size = 'md',
  className,
  ...rest
}: ToggleGroupProps<V>) {
  const { base, item, itemOn } = toggleGroupStyles({ intent, size })
  return (
    <div className={base({ class: className })} role="tablist" {...rest}>
      {options.map((opt) => {
        const on = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={on}
            disabled={opt.disabled}
            className={on ? `${item()} ${itemOn()}` : item()}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
