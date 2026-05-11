import type { ComponentProps } from 'react'
import { Pill } from '../Pill'
import type { NxColumn } from './types'

export const fmtMoney = (v: unknown) =>
  '$' + (Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fmtNumber = (v: unknown) => (Number(v) || 0).toLocaleString()
export const fmtDate = (v: unknown) => {
  if (!v) return '—'
  const d = v instanceof Date ? v : new Date(v as string)
  if (isNaN(d.getTime())) return String(v)
  const Y = d.getFullYear(), M = String(d.getMonth() + 1).padStart(2, '0'), D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0'), m = String(d.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

export const statusTone = (v: string): ComponentProps<typeof Pill>['tone'] => {
  const s = v.toLowerCase()
  if (/(active|running|ok|healthy|success|done|paid)/.test(s)) return 'ok'
  if (/(idle|pending|warn|degraded|queued)/.test(s)) return 'warn'
  if (/(error|failed|down|stopped|overdue|critical)/.test(s)) return 'err'
  return 'neutral'
}

/** Plain-text projection of a cell — used for global search, sorting, and CSV export. */
export function cellText<R>(col: NxColumn<R>, row: R): string {
  const raw = (row as Record<string, unknown>)[col.key]
  if (col.formatter) return col.formatter(raw, row)
  switch (col.type) {
    case 'money': return fmtMoney(raw)
    case 'number': case 'bar': return fmtNumber(raw)
    case 'date': return fmtDate(raw)
    default: return raw == null ? '' : String(raw)
  }
}

export function CellContent<R>({ col, row }: { col: NxColumn<R>; row: R }) {
  const raw = (row as Record<string, unknown>)[col.key]
  if (col.render) return <>{col.render(raw, row)}</>
  switch (col.type) {
    case 'status':
      return <Pill size="xs" tone={statusTone(String(raw ?? ''))}>{String(raw ?? '—')}</Pill>
    case 'bar': {
      const max = col.barMax ?? 100
      const pct = Math.max(0, Math.min(100, ((Number(raw) || 0) / max) * 100))
      return (
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="flex-1 h-1.5 rounded-full bg-bg-sunk overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-text-muted tabular-nums w-9 text-right">{Math.round(pct)}%</span>
        </div>
      )
    }
    case 'money': return <span className="tabular-nums">{fmtMoney(raw)}</span>
    case 'number': return <span className="tabular-nums">{fmtNumber(raw)}</span>
    case 'date': return <span className="text-text-muted">{fmtDate(raw)}</span>
    default: return <>{raw == null ? <span className="text-text-dim">—</span> : String(raw)}</>
  }
}
