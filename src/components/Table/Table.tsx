import type { TableHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type TableProps = TableHTMLAttributes<HTMLTableElement>

export function Table({ className, children, ...rest }: TableProps) {
  return (
    <table className={cx('tbl', className)} {...rest}>
      {children}
    </table>
  )
}
