import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * MiniTabs — denser, in-panel tab strip. The page-level `Tabs` component
 * is heavier; this one is for switching within a card or popover.
 */
const miniTabsStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-3 border-b border-line',
    item: [
      'inline-flex items-center gap-1.5 cursor-pointer',
      'h-7 -mb-px text-sm text-text-muted',
      'border-b-2 border-transparent',
      'hover:text-text',
    ],
    itemOn: 'text-text font-medium border-b-accent',
  },
})

export interface MiniTabOption<V extends string = string> {
  value: V
  label: ReactNode
}

export interface MiniTabsProps<V extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly MiniTabOption<V>[]
  value: V
  onChange?: (value: V) => void
}

export function MiniTabs<V extends string = string>({
  options,
  value,
  onChange,
  className,
  ...rest
}: MiniTabsProps<V>) {
  const { base, item, itemOn } = miniTabsStyles()
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
