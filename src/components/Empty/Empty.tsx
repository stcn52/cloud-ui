import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function Empty({ icon, title, description, actions, className, children, ...rest }: EmptyProps) {
  return (
    <div className={cx('empty', className)} {...rest}>
      {icon && <div className="ic">{icon}</div>}
      {title !== undefined && <h4>{title}</h4>}
      {description !== undefined && <p>{description}</p>}
      {actions && (
        <div className="row" style={{ justifyContent: 'center' }}>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
