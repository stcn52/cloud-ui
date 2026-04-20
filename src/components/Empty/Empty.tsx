import type { HTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const emptyStyles = tv({
  slots: {
    base: 'text-center px-5 py-9',
    icon: [
      'w-11 h-11 mx-auto mb-3 rounded-md',
      'bg-bg-sunk grid place-items-center text-text-dim',
    ],
    title: 'm-0 mb-1 text-sm font-semibold',
    desc: 'm-0 mb-3 text-sm text-text-muted max-w-[320px] mx-auto leading-[1.55]',
    actions: 'flex gap-3 flex-wrap items-center justify-center',
  },
})

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function Empty({
  icon,
  title,
  description,
  actions,
  className,
  children,
  ...rest
}: EmptyProps) {
  const { base, icon: iconCls, title: titleCls, desc, actions: actionsCls } = emptyStyles()
  return (
    <div className={base({ class: className })} {...rest}>
      {icon && <div className={iconCls()}>{icon}</div>}
      {title !== undefined && <h4 className={titleCls()}>{title}</h4>}
      {description !== undefined && <p className={desc()}>{description}</p>}
      {actions && <div className={actionsCls()}>{actions}</div>}
      {children}
    </div>
  )
}
