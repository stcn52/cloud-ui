import type { HTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '../Button/Button'
import { useLocale } from '../../context/ConfigProvider'

const paginationStyles = tv({
  base: [
    'inline-flex gap-1 items-center',
    'text-xs font-mono text-text-muted',
  ],
})

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 1-based current page. */
  current: number
  /** Total rows (not pages). `totalPages = Math.ceil(total / pageSize)`. */
  total: number
  /** Rows per page. default 10 */
  pageSize?: number
  /** Called with the new page number. */
  onChange?: (page: number) => void
  /** Max numeric buttons (excluding prev/next/ellipsis). default 5 */
  siblingCount?: number
  /** Label for prev button. Defaults to locale. */
  prevLabel?: React.ReactNode
  /** Label for next button. Defaults to locale. */
  nextLabel?: React.ReactNode
}

function range(a: number, b: number) {
  const out: number[] = []
  for (let i = a; i <= b; i++) out.push(i)
  return out
}

function buildItems(page: number, totalPages: number, siblings: number): (number | '…')[] {
  if (totalPages <= siblings + 2) return range(1, totalPages)
  const leftSib = Math.max(2, page - Math.floor(siblings / 2))
  const rightSib = Math.min(totalPages - 1, leftSib + siblings - 1)
  const adjustedLeft = Math.max(2, rightSib - siblings + 1)
  const items: (number | '…')[] = [1]
  if (adjustedLeft > 2) items.push('…')
  items.push(...range(adjustedLeft, rightSib))
  if (rightSib < totalPages - 1) items.push('…')
  items.push(totalPages)
  return items
}

export function Pagination({
  current,
  total,
  pageSize = 10,
  onChange,
  siblingCount = 5,
  prevLabel,
  nextLabel,
  className,
  ...rest
}: PaginationProps) {
  const locale = useLocale()
  const resolvedPrev = prevLabel ?? locale.pagination.prev
  const resolvedNext = nextLabel ?? locale.pagination.next
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const items = buildItems(current, totalPages, siblingCount)
  const prev = () => current > 1 && onChange?.(current - 1)
  const next = () => current < totalPages && onChange?.(current + 1)

  return (
    <div className={paginationStyles({ class: className })} {...rest}>
      <Button size="sm" intent="ghost" onClick={prev} disabled={current <= 1}>
        {resolvedPrev}
      </Button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`ellipsis-${i}`}>…</span>
        ) : it === current ? (
          <Button key={it} size="sm" intent="subtle" onClick={() => onChange?.(it)}>
            {it}
          </Button>
        ) : (
          <Button key={it} size="sm" intent="ghost" onClick={() => onChange?.(it)}>
            {it}
          </Button>
        ),
      )}
      <Button size="sm" intent="ghost" onClick={next} disabled={current >= totalPages}>
        {resolvedNext}
      </Button>
    </div>
  )
}
