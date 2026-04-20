import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  page: number
  total: number
  onChange?: (page: number) => void
  /** max numeric buttons (excluding prev/next/ellipsis). default 5 */
  siblingCount?: number
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
  className,
  ...rest
}: PaginationProps) {
  const items = buildItems(page, total, siblingCount)
  const prev = () => page > 1 && onChange?.(page - 1)
  const next = () => page < total && onChange?.(page + 1)

  return (
    <div className={cx('pagination', className)} {...rest}>
      <button type="button" className="btn sm ghost" onClick={prev} disabled={page <= 1}>
        ‹ Prev
      </button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`ellipsis-${i}`}>…</span>
        ) : (
          <button
            key={it}
            type="button"
            className={cx('btn sm', it === page ? 'on' : 'ghost')}
            onClick={() => onChange?.(it)}
          >
            {it}
          </button>
        ),
      )}
      <button type="button" className="btn sm ghost" onClick={next} disabled={page >= total}>
        Next ›
      </button>
    </div>
  )
}
