import { useMemo, useState, type HTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function addMonths(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(1)
  x.setMonth(x.getMonth() + n)
  return x
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const datePickerStyles = tv({
  slots: {
    base: [
      'w-[260px] p-2.5 bg-bg-elev border border-line rounded-md shadow-md',
      'text-xs',
    ],
    head: 'flex items-center justify-between mb-2 font-semibold',
    navBtn: [
      'inline-flex items-center justify-center w-5 h-5 rounded-xs',
      'text-text-muted hover:bg-bg-sunk border-0 bg-transparent',
    ],
    grid: 'grid grid-cols-7 gap-px',
    dow: 'text-[10px] text-center text-text-dim py-1 font-mono',
    day: [
      'text-center py-1 rounded-xs cursor-default font-mono',
      'text-[11.5px] text-text hover:bg-bg-sunk',
    ],
  },
  variants: {
    dim:    { true: { day: 'text-text-dim' }, false: {} },
    today:  { true: { day: 'border border-accent' }, false: {} },
    start:  { true: { day: 'bg-accent text-white rounded-r-none hover:bg-accent' }, false: {} },
    end:    { true: { day: 'bg-accent text-white rounded-l-none hover:bg-accent' }, false: {} },
    range:  { true: { day: 'bg-accent-weak text-accent-ink rounded-none hover:bg-accent-weak' }, false: {} },
  },
})

export type DateRange = [Date, Date]

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  mode?: 'single' | 'range'
  value?: Date | DateRange | null
  defaultValue?: Date | DateRange | null
  onChange?: (value: Date | DateRange | null) => void
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (d: Date) => void
}

function isRange(v: unknown): v is DateRange {
  return Array.isArray(v) && v.length === 2 && v[0] instanceof Date && v[1] instanceof Date
}

export function DatePicker({
  mode = 'single',
  value: valueProp,
  defaultValue = null,
  onChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  className,
  ...rest
}: DatePickerProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | DateRange | null>(defaultValue)
  const value = valueProp !== undefined ? valueProp : uncontrolledValue

  const initialMonth = useMemo(() => {
    if (monthProp) return monthProp
    if (defaultMonth) return defaultMonth
    if (value instanceof Date) return value
    if (isRange(value)) return value[0]
    return today
  }, [monthProp, defaultMonth, value, today])

  const [uncontrolledMonth, setUncontrolledMonth] = useState<Date>(initialMonth)
  const viewMonth = monthProp ?? uncontrolledMonth

  const [pendingStart, setPendingStart] = useState<Date | null>(null)

  const setMonth = (d: Date) => {
    if (!monthProp) setUncontrolledMonth(d)
    onMonthChange?.(d)
  }

  const commitValue = (next: Date | DateRange | null) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onChange?.(next)
  }

  const handlePick = (d: Date) => {
    if (mode === 'single') {
      commitValue(d)
      return
    }
    if (!pendingStart) {
      setPendingStart(d)
      commitValue([d, d])
    } else {
      const start = pendingStart < d ? pendingStart : d
      const end = pendingStart < d ? d : pendingStart
      commitValue([start, end])
      setPendingStart(null)
    }
  }

  const year = viewMonth.getFullYear()
  const monthIdx = viewMonth.getMonth()
  const total = daysInMonth(year, monthIdx)
  const firstDay = new Date(year, monthIdx, 1).getDay()
  const leading = (firstDay + 6) % 7

  const prevMonthTotal = daysInMonth(year, monthIdx - 1)

  interface Cell {
    date: Date
    dim: boolean
  }
  const cells: Cell[] = []
  for (let i = leading - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, monthIdx - 1, prevMonthTotal - i), dim: true })
  }
  for (let i = 1; i <= total; i++) {
    cells.push({ date: new Date(year, monthIdx, i), dim: false })
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), dim: true })
  }

  const selected = valueProp !== undefined ? valueProp : value
  const isInRange = (d: Date) => {
    if (!isRange(selected)) return false
    return d > selected[0] && d < selected[1]
  }
  const isStart = (d: Date) => isRange(selected) && sameDay(d, selected[0])
  const isEnd = (d: Date) => isRange(selected) && sameDay(d, selected[1])
  const isSingle = (d: Date) => selected instanceof Date && sameDay(d, selected)

  const { base, head, navBtn, grid, dow } = datePickerStyles()

  return (
    <div className={base({ class: className })} {...rest}>
      <div className={head()}>
        <button
          type="button"
          className={navBtn()}
          aria-label="Previous month"
          onClick={() => setMonth(addMonths(viewMonth, -1))}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <b>
          {MONTH_NAMES[monthIdx]} {year}
        </b>
        <button
          type="button"
          className={navBtn()}
          aria-label="Next month"
          onClick={() => setMonth(addMonths(viewMonth, 1))}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className={grid()}>
        {DOW.map((d, i) => (
          <div key={`${d}-${i}`} className={dow()}>
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const isT = sameDay(c.date, today)
          const isS = isStart(c.date) || isSingle(c.date)
          const isE = isEnd(c.date)
          const isR = isInRange(c.date)
          const { day } = datePickerStyles({
            dim: c.dim,
            today: isT,
            start: isS,
            end: isE,
            range: isR,
          })
          return (
            <div
              key={i}
              className={day()}
              role="button"
              tabIndex={0}
              onClick={() => handlePick(c.date)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePick(c.date)
                }
              }}
            >
              {c.date.getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
