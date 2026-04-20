import { Children, Fragment, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

function ChevronSep() {
  return (
    <svg className="sep" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLSpanElement> {
  leaf?: boolean
  children?: ReactNode
}

export function Breadcrumb({ leaf, className, children, ...rest }: BreadcrumbProps) {
  return (
    <span className={cx(leaf && 'leaf', className)} {...rest}>
      {children}
    </span>
  )
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLDivElement> {
  separator?: ReactNode
  children?: ReactNode
}

export function Breadcrumbs({
  separator = <ChevronSep />,
  className,
  children,
  ...rest
}: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(Boolean) as ReactElement[]
  return (
    <div className={cx('crumbs', className)} {...rest}>
      {items.map((el, i) => (
        <Fragment key={i}>
          {i > 0 && separator}
          {el}
        </Fragment>
      ))}
    </div>
  )
}
