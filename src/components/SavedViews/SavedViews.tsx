import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

/**
 * SavedViews — a row of named view tabs ("All / Production / Failed last 24 h …").
 * Each view shows a count, optional lock icon for workspace-shared views, and
 * the active view gets a subtle accent underline. Trailing `+ New view` action.
 *
 * The component is purely visual; controlled via `value` + `onChange`.
 */
const viewsStyles = tv({
  slots: {
    base: [
      'flex items-center gap-0',
      'border-b border-line',
      'overflow-x-auto',
      '[&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
    ],
    item: [
      'inline-flex items-center gap-1.5 shrink-0',
      'h-9 px-3 text-sm text-text-muted',
      'cursor-pointer select-none',
      'border-b-2 border-transparent -mb-px',
      'hover:text-text',
    ],
    add: [
      'inline-flex items-center shrink-0',
      'h-9 px-3 text-sm text-text-dim cursor-pointer',
      'border-b-2 border-transparent -mb-px',
      'hover:text-text',
    ],
    count: [
      'inline-flex items-center justify-center',
      'min-w-[18px] h-4 px-1 rounded-full',
      'font-mono text-[10.5px] [font-variant-numeric:tabular-nums]',
      'bg-bg-sunk text-text-muted',
    ],
    lock: 'w-[10px] h-[10px] text-text-dim',
  },
  variants: {
    active: {
      true:  { item: 'text-text font-medium border-b-accent', count: 'bg-accent-weak text-accent-ink' },
      false: {},
    },
  },
})

export interface ViewItem {
  /** Unique id matched against the parent `value`. */
  id: string
  /** Display label. */
  label: ReactNode
  /** Numeric count badge. omit for none. */
  count?: ReactNode
  /** Show the lock icon (workspace-shared, read-only). */
  locked?: boolean
}

export interface SavedViewsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** id of the currently active view. */
  value: string
  onChange: (id: string) => void
  views: ViewItem[]
  /** Click handler for the trailing `+ New view` action. omit to hide. */
  onAdd?: () => void
  /** Custom add label. default `+ New view`. */
  addLabel?: ReactNode
}

const lockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export function SavedViews({
  value,
  onChange,
  views,
  onAdd,
  addLabel = '+ New view',
  className,
  ...rest
}: SavedViewsProps) {
  const { base, add, lock } = viewsStyles()
  return (
    <div className={base({ class: className })} role="tablist" {...rest}>
      {views.map((v) => {
        const active = v.id === value
        const { item: itemCls, count: itemCount } = viewsStyles({ active })
        return (
          <div
            key={v.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={itemCls()}
            onClick={() => onChange(v.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(v.id)
              }
            }}
          >
            {v.locked && <span className={lock()}>{lockIcon}</span>}
            <span>{v.label}</span>
            {v.count !== undefined && <span className={itemCount()}>{v.count}</span>}
          </div>
        )
      })}
      {onAdd && (
        <div
          role="button"
          tabIndex={0}
          className={add()}
          onClick={onAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onAdd()
            }
          }}
        >
          {addLabel}
        </div>
      )}
    </div>
  )
}
