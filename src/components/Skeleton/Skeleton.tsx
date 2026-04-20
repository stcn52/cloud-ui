import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type SkeletonProps = HTMLAttributes<HTMLSpanElement>

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return <span className={cx('sk', className)} {...rest} />
}
