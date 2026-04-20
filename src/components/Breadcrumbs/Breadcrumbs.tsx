import { Children, Fragment, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

function ChevronSep() {
  return (
    <svg
      className="text-text-dim"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

const breadcrumbStyles = tv({
  base: '',
  variants: {
    leaf: {
      true: 'text-text font-medium',
      false: '',
    },
  },
  defaultVariants: { leaf: false },
})

export interface BreadcrumbProps extends HTMLAttributes<HTMLSpanElement> {
  leaf?: boolean
  children?: ReactNode
}

export function Breadcrumb({ leaf, className, children, ...rest }: BreadcrumbProps) {
  return (
    <span className={breadcrumbStyles({ leaf, class: className })} {...rest}>
      {children}
    </span>
  )
}

const breadcrumbsStyles = tv({
  base: 'flex items-center gap-2 text-sm text-text-muted',
})

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
    <div className={breadcrumbsStyles({ class: className })} {...rest}>
      {items.map((el, i) => (
        <Fragment key={i}>
          {i > 0 && separator}
          {el}
        </Fragment>
      ))}
    </div>
  )
}
