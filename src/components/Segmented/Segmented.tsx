import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const segmentedStyles = tv({
  slots: {
    base: [
      'inline-grid grid-flow-col [grid-auto-columns:1fr]',
      'border border-line rounded-sm overflow-hidden bg-bg-elev',
    ],
    item: [
      'text-text-muted whitespace-nowrap',
      'border-r border-line',
      'last:border-r-0',
      'hover:bg-bg-sunk hover:text-text',
    ],
    itemOn: 'bg-accent-weak text-accent-ink font-semibold hover:bg-accent-weak hover:text-accent-ink',
  },
  variants: {
    size: {
      sm: { item: 'text-[10.5px] px-2 py-1' },
      md: { item: 'text-xs px-3 py-1.5' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SegmentedSize = 'sm' | 'md'

export interface SegmentedOption<V extends string = string> {
  value: V
  label: ReactNode
  disabled?: boolean
}

export interface SegmentedProps<V extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly SegmentedOption<V>[]
  value: V
  onChange?: (value: V) => void
  size?: SegmentedSize
}

export function Segmented<V extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
  ...rest
}: SegmentedProps<V>) {
  const { base, item, itemOn } = segmentedStyles({ size })
  return (
    <div className={base({ class: className })} role="tablist" {...rest}>
      {options.map((opt) => {
        const isOn = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isOn}
            disabled={opt.disabled}
            className={isOn ? `${item()} ${itemOn()}` : item()}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
