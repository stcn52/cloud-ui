import { Children, Fragment, cloneElement, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
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

const breadcrumbItemStyles = tv({
  base: '',
  variants: {
    leaf: {
      true: 'text-text font-medium',
      false: '',
    },
  },
  defaultVariants: { leaf: false },
})

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLSpanElement> {
  /** Force leaf styling. When omitted, the last child of `<Breadcrumbs>` auto-becomes leaf. */
  leaf?: boolean
  children?: ReactNode
}

export function BreadcrumbItem({ leaf, className, children, ...rest }: BreadcrumbItemProps) {
  return (
    <span className={breadcrumbItemStyles({ leaf, class: className })} {...rest}>
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
  const items = Children.toArray(children).filter(Boolean) as ReactElement<BreadcrumbItemProps>[]
  const lastIdx = items.length - 1
  return (
    <div className={breadcrumbsStyles({ class: className })} {...rest}>
      {items.map((el, i) => {
        // auto-leaf: last item becomes leaf if not explicitly set
        const needsLeaf = i === lastIdx && el.props.leaf === undefined
        const resolved = needsLeaf && isValidElement(el)
          ? cloneElement(el as ReactElement<BreadcrumbItemProps>, { leaf: true })
          : el
        return (
          <Fragment key={i}>
            {i > 0 && separator}
            {resolved}
          </Fragment>
        )
      })}
    </div>
  )
}
