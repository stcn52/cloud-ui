import { useMemo, useState, type HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

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

export type DateRange = [Date, Date]

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Pick a single date. */
  mode?: 'single' | 'range'
  value?: Date | DateRange | null
  defaultValue?: Date | DateRange | null
  onChange?: (value: Date | DateRange | null) => void
  /** Month to display (controlled). */
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

  // Pending range pick state (first click sets start, second extends)
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
  // ISO week start (Monday = 0)
  const firstDay = new Date(year, monthIdx, 1).getDay()
  const leading = (firstDay + 6) % 7

  const prevMonthTotal = daysInMonth(year, monthIdx - 1)

  // Build cells: (leading) prev-month dim + current + (trailing) next-month dim
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

  return (
    <div className={cx('datepicker', className)} {...rest}>
      <div className="dp-head">
        <button
          type="button"
          className="btn icon xs ghost"
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
          className="btn icon xs ghost"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(viewMonth, 1))}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="dp-grid">
        {DOW.map((d, i) => (
          <div key={`${d}-${i}`} className="h">
            {d}
          </div>
        ))}
        {cells.map((c, i) => {
          const cls = cx(
            'd',
            c.dim && 'dim',
            sameDay(c.date, today) && 'today',
            isStart(c.date) && 'start',
            isEnd(c.date) && 'end',
            isInRange(c.date) && 'range',
            isSingle(c.date) && 'start',
          )
          return (
            <div
              key={i}
              className={cls}
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
