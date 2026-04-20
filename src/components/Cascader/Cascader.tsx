import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface CascaderOption {
  value: string
  label: ReactNode
  children?: CascaderOption[]
}

export interface CascaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect'> {
  options: CascaderOption[]
  /** Full path of values; final item is the selected leaf. */
  value?: string[]
  defaultValue?: string[]
  onChange?: (path: string[]) => void
  /** Called only when a leaf is picked. */
  onSelect?: (path: string[]) => void
  columnWidth?: number
}

const ChevronRight = (
  <span className="sub" aria-hidden="true">
    ›
  </span>
)

const CheckMark = (
  <span className="check" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
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

  // Build visible columns based on the current path
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

  return (
    <div className={cx('cascader', className)} {...rest}>
      {columns.map((col, depth) => (
        <div key={depth} className="cascader-col" style={{ width: columnWidth }}>
          {col.options.map((opt) => {
            const isActive = col.activeValue === opt.value
            const isLeaf = !opt.children || opt.children.length === 0
            const isSelectedLeaf = isActive && isLeaf
            return (
              <button
                key={opt.value}
                type="button"
                className={cx('opt', isSelectedLeaf ? 'selected' : isActive && 'active')}
                onClick={() => pickAt(depth, opt)}
              >
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelectedLeaf ? CheckMark : !isLeaf ? ChevronRight : null}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
