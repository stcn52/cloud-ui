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
  page: number
  total: number
  onChange?: (page: number) => void
  /** max numeric buttons (excluding prev/next/ellipsis). default 5 */
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

function buildItems(page: number, total: number, siblings: number): (number | '…')[] {
  if (total <= siblings + 2) return range(1, total)
  const leftSib = Math.max(2, page - Math.floor(siblings / 2))
  const rightSib = Math.min(total - 1, leftSib + siblings - 1)
  const adjustedLeft = Math.max(2, rightSib - siblings + 1)
  const items: (number | '…')[] = [1]
  if (adjustedLeft > 2) items.push('…')
  items.push(...range(adjustedLeft, rightSib))
  if (rightSib < total - 1) items.push('…')
  items.push(total)
  return items
}

export function Pagination({
  page,
  total,
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
  const items = buildItems(page, total, siblingCount)
  const prev = () => page > 1 && onChange?.(page - 1)
  const next = () => page < total && onChange?.(page + 1)

  return (
    <div className={paginationStyles({ class: className })} {...rest}>
      <Button size="sm" intent="ghost" onClick={prev} disabled={page <= 1}>
        {resolvedPrev}
      </Button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`ellipsis-${i}`}>…</span>
        ) : it === page ? (
          <Button key={it} size="sm" intent="subtle" onClick={() => onChange?.(it)}>
            {it}
          </Button>
        ) : (
          <Button key={it} size="sm" intent="ghost" onClick={() => onChange?.(it)}>
            {it}
          </Button>
        ),
      )}
      <Button size="sm" intent="ghost" onClick={next} disabled={page >= total}>
        {resolvedNext}
      </Button>
    </div>
  )
}
