import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
} from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const tableStyles = tv({
  base: [
    'w-full border-collapse',
    // Cell base
    '[&_th]:text-left [&_th]:px-3.5 [&_th]:border-b [&_th]:border-line',
    '[&_th]:text-xs [&_th]:font-medium [&_th]:text-text-dim [&_th]:uppercase [&_th]:tracking-[0.05em] [&_th]:bg-panel [&_th]:whitespace-nowrap',
    '[&_th.right]:text-right',
    '[&_th.actions]:text-right',
    '[&_td]:text-left [&_td]:px-3.5 [&_td]:border-b [&_td]:border-line',
    '[&_td]:text-sm [&_td]:whitespace-nowrap [&_td]:align-middle',
    '[&_td.right]:text-right',
    '[&_td.num]:font-mono [&_td.num]:[font-variant-numeric:tabular-nums]',
    // Last row no border
    '[&_tr:last-child_td]:border-b-0',
    // Row hover
    '[&_tbody_tr:hover_td]:bg-bg-sunk',
    // Selected row
    '[&_tbody_tr.sel_td]:bg-accent-weak/40',
    // Mono cells
    '[&_td.mono]:font-mono [&_td.mono]:text-xs [&_td.mono]:text-text-dim',
    // Action cells: align right, reveal on hover
    '[&_td.actions]:text-right',
    '[&_tbody_tr_td.actions_>_*]:opacity-0 [&_tbody_tr_td.actions_>_*]:transition-opacity',
    '[&_tbody_tr:hover_td.actions_>_*]:opacity-100',
    '[&_tbody_tr.sel_td.actions_>_*]:opacity-100',
  ],
  variants: {
    density: {
      compact:  '[&_th]:h-7 [&_td]:h-7',
      default:  '[&_th]:h-[34px] [&_td]:h-[34px]',
      relaxed:  '[&_th]:h-11 [&_td]:h-11',
    },
  },
  defaultVariants: { density: 'default' },
})

type TableVariants = VariantProps<typeof tableStyles>
export type TableDensity = NonNullable<TableVariants['density']>

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Row height. `compact` 28 px, `default` 34 px, `relaxed` 44 px. */
  density?: TableDensity
}

export function Table({ className, density, children, ...rest }: TableProps) {
  return (
    <table className={tableStyles({ density, class: className })} {...rest}>
      {children}
    </table>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Sortable header                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

const sortHeaderStyles = tv({
  slots: {
    th: 'cursor-pointer select-none',
    inner: [
      'inline-flex items-center gap-1',
      'text-xs font-medium uppercase tracking-[0.05em] text-text-dim',
      'hover:text-text',
    ],
    icon: 'w-3 h-3 opacity-60',
  },
  variants: {
    active: {
      true:  { inner: 'text-accent-ink', icon: 'opacity-100' },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export type SortDirection = 'asc' | 'desc' | null

export interface SortHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children' | 'onClick'> {
  /** Current sort state. `null` = unsorted, no direction caret. */
  direction?: SortDirection
  onSort?: () => void
  children: ReactNode
}

export function SortHeader({
  direction = null,
  onSort,
  className,
  children,
  ...rest
}: SortHeaderProps) {
  const active = direction !== null
  const { th, inner, icon } = sortHeaderStyles({ active })
  const sortIcon =
    direction === 'asc'
      ? (<polyline points="6 15 12 9 18 15" />)
      : direction === 'desc'
      ? (<polyline points="6 9 12 15 18 9" />)
      : (<>
          <polyline points="9 18 15 12 9 6" />
          <polyline points="9 18 15 12 9 6" transform="rotate(90 12 12)" />
        </>)
  return (
    <th
      className={th({ class: className })}
      onClick={onSort}
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
      {...rest}
    >
      <span className={inner()}>
        {children}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={icon()}>
          {sortIcon}
        </svg>
      </span>
    </th>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* TableBar — inline mini bar for cells (CPU %, mem %, etc.)                  */
/* ────────────────────────────────────────────────────────────────────────── */

const barStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-2 align-middle',
    track: 'w-[92px] h-1.5 rounded-full bg-bg-sunk overflow-hidden',
    fill:  'block h-full rounded-full bg-accent',
    value: 'font-mono text-xs text-text-muted [font-variant-numeric:tabular-nums]',
  },
  variants: {
    tone: {
      ok:   { fill: 'bg-ok' },
      info: { fill: 'bg-accent' },
      warn: { fill: 'bg-warn' },
      err:  { fill: 'bg-err' },
    },
  },
  defaultVariants: { tone: 'info' },
})

export type TableBarTone = NonNullable<VariantProps<typeof barStyles>['tone']>

export interface TableBarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 0–100. */
  value: number
  /** Auto-tones if undefined: ≥85 → err, ≥65 → warn, else info. */
  tone?: TableBarTone
  /** What's shown at the right edge. defaults to `${value} %`. */
  label?: ReactNode
}

export function TableBar({
  value,
  tone,
  label,
  className,
  ...rest
}: TableBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const resolvedTone = tone ?? (clamped >= 85 ? 'err' : clamped >= 65 ? 'warn' : 'info')
  const { base, track, fill, value: valueCls } = barStyles({ tone: resolvedTone })
  return (
    <span className={base({ class: className })} {...rest}>
      <span className={track()}>
        <span className={fill()} style={{ width: `${clamped}%` }} />
      </span>
      <span className={valueCls()}>{label ?? `${clamped} %`}</span>
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* StatusCell — dot + label in one of 4 tones                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const statusStyles = tv({
  slots: {
    base: 'inline-flex items-center gap-1.5 text-sm',
    dot:  'w-1.5 h-1.5 rounded-full',
  },
  variants: {
    tone: {
      ok:   { base: 'text-ok',         dot: 'bg-ok' },
      warn: { base: 'text-warn',       dot: 'bg-warn' },
      err:  { base: 'text-err',        dot: 'bg-err' },
      idle: { base: 'text-text-muted', dot: 'bg-text-dim' },
    },
  },
  defaultVariants: { tone: 'ok' },
})

export type StatusTone = NonNullable<VariantProps<typeof statusStyles>['tone']>

export interface StatusCellProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  children: ReactNode
}

export function StatusCell({
  tone = 'ok',
  className,
  children,
  ...rest
}: StatusCellProps) {
  const { base, dot } = statusStyles({ tone })
  return (
    <span className={base({ class: className })} {...rest}>
      <span className={dot()} />
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* CaretButton — for expandable row toggle                                    */
/* ────────────────────────────────────────────────────────────────────────── */

const caretStyles = tv({
  base: [
    'inline-grid place-items-center w-5 h-5 rounded-xs',
    'border-0 bg-transparent text-text-muted cursor-pointer p-0',
    'transition-transform duration-[.12s]',
    'hover:bg-bg-sunk hover:text-text',
  ],
  variants: {
    open: {
      true:  'rotate-90 text-text',
      false: '',
    },
  },
  defaultVariants: { open: false },
})

export interface CaretButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean
}

export function CaretButton({ open, className, ...rest }: CaretButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      className={caretStyles({ open, class: className })}
      {...rest}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/* BulkBar — sticky/floating action sheet that appears when rows selected     */
/* ────────────────────────────────────────────────────────────────────────── */

const bulkBarStyles = tv({
  slots: {
    base: [
      'inline-flex items-center gap-2',
      'px-3 py-1.5 rounded-md',
      'bg-text text-bg shadow-md',
      'text-sm',
    ],
    count: 'font-semibold mr-1',
    sep:   'w-px h-4 bg-bg/30',
    btn: [
      'px-2 py-0.5 rounded-xs text-sm bg-transparent border-0 cursor-pointer',
      'text-bg/85 hover:text-bg hover:bg-bg/10',
    ],
    danger: 'text-err-foreground hover:bg-err/20',
  },
})

export interface BulkBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of items selected — rendered before the actions. */
  count: number
  /** Action buttons / nodes. Use plain `<button>` children — they get bar styling via context. */
  children: ReactNode
}

export function BulkBar({ count, className, children, ...rest }: BulkBarProps) {
  const { base, count: countCls } = bulkBarStyles()
  return (
    <div className={base({ class: className })} role="toolbar" {...rest}>
      <span className={countCls()}>{count} selected</span>
      <BulkBarSep />
      {children}
    </div>
  )
}

export function BulkBarButton({
  className,
  danger,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  const { btn } = bulkBarStyles()
  return (
    <button
      type="button"
      className={btn({ class: [className, danger ? 'text-err hover:bg-err/15' : ''].filter(Boolean).join(' ') })}
      {...rest}
    />
  )
}

export function BulkBarSep() {
  const { sep } = bulkBarStyles()
  return <span className={sep()} aria-hidden />
}
