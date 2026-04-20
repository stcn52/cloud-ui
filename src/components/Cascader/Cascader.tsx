import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const cascaderStyles = tv({
  slots: {
    base: [
      'flex bg-bg-elev border border-line rounded-md shadow-md overflow-hidden',
    ],
    col: 'max-h-[240px] overflow-y-auto border-r border-line last:border-r-0 p-1',
    opt: [
      'flex items-center gap-2 w-full text-left',
      'px-2.5 py-1.5 rounded-xs text-sm',
      'text-text bg-transparent border-0 font-[inherit] cursor-default',
      'hover:bg-accent-weak hover:text-accent-ink',
    ],
    optLabel: 'flex-1',
    chevron: 'ml-auto font-mono text-[10.5px] text-text-dim',
    check: 'ml-auto text-accent',
  },
  variants: {
    active: {
      true:  { opt: 'bg-accent-weak text-accent-ink' },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export interface CascaderOption {
  value: string
  label: ReactNode
  children?: CascaderOption[]
}

export interface CascaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  options: CascaderOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (path: string[]) => void
  onSelect?: (path: string[]) => void
  columnWidth?: number
}

const ChevronRight = <span aria-hidden="true">›</span>
const CheckMark = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function Cascader({
  options,
  value: valueProp,
  defaultValue = [],
  onChange,
  onSelect,
  columnWidth = 180,
  className,
  ...rest
}: CascaderProps) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue)
  const value = valueProp ?? uncontrolled

  const columns: { options: CascaderOption[]; activeValue: string | undefined }[] = []
  let cursor: CascaderOption[] | undefined = options
  for (let depth = 0; cursor; depth++) {
    const active = value[depth]
    columns.push({ options: cursor, activeValue: active })
    if (!active) break
    const next: CascaderOption[] | undefined = cursor.find((o) => o.value === active)?.children
    if (!next || next.length === 0) break
    cursor = next
  }

  const pickAt = (depth: number, opt: CascaderOption) => {
    const nextPath = [...value.slice(0, depth), opt.value]
    if (valueProp === undefined) setUncontrolled(nextPath)
    onChange?.(nextPath)
    const isLeaf = !opt.children || opt.children.length === 0
    if (isLeaf) onSelect?.(nextPath)
  }

  const { base, col, optLabel, chevron, check } = cascaderStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {columns.map((column, depth) => (
        <div key={depth} className={col()} style={{ width: columnWidth }}>
          {column.options.map((o) => {
            const isActive = column.activeValue === o.value
            const isLeaf = !o.children || o.children.length === 0
            const isSelectedLeaf = isActive && isLeaf
            return (
              <button
                key={o.value}
                type="button"
                className={cascaderStyles({ active: isActive }).opt()}
                onClick={() => pickAt(depth, o)}
              >
                <span className={optLabel()}>{o.label}</span>
                {isSelectedLeaf ? (
                  <span className={check()}>{CheckMark}</span>
                ) : !isLeaf ? (
                  <span className={chevron()}>{ChevronRight}</span>
                ) : null}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
