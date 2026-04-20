import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Popover, type PopoverPlacement } from '../Popover/Popover'
import { cx } from '../../utils/cx'

export interface DropdownProps {
  trigger: ReactElement
  children: ReactNode
  placement?: PopoverPlacement
  offset?: number
  /** Fixed menu width. default 240px via CSS */
  width?: number | string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dropdown({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 6,
  width,
  open,
  onOpenChange,
}: DropdownProps) {
  return (
    <Popover
      trigger={trigger}
      placement={placement}
      offset={offset}
      open={open}
      onOpenChange={onOpenChange}
      surface={false}
      className="menu"
      style={width !== undefined ? { width } : undefined}
      content={children}
    />
  )
}

export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  shortcut?: ReactNode
  /** highlight as currently selected */
  active?: boolean
  disabled?: boolean
  /** mark as sub-menu target (shows › arrow) */
  submenu?: boolean
  /** destructive tone */
  danger?: boolean
  /** show trailing checkmark */
  checked?: boolean
  children?: ReactNode
}

const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function DropdownItem({
  icon,
  shortcut,
  active,
  disabled,
  submenu,
  danger,
  checked,
  className,
  children,
  ...rest
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cx(
        'row-item',
        active && 'active',
        disabled && 'disabled',
        submenu && 'submenu',
        danger && 'danger',
        className,
      )}
      {...rest}
    >
      {icon}
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      {checked && <span className="check">{CheckIcon}</span>}
      {!checked && shortcut !== undefined && <span className="kbd-tail">{shortcut}</span>}
    </button>
  )
}

export interface DropdownGroupProps {
  label?: ReactNode
  children?: ReactNode
}

export function DropdownGroup({ label, children }: DropdownGroupProps) {
  return (
    <>
      {label !== undefined && <div className="group-label">{label}</div>}
      {children}
    </>
  )
}

export function DropdownSeparator() {
  return <div className="sep-h" role="separator" />
}

export interface DropdownSearchProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  icon?: ReactNode
}

export function DropdownSearch({ value, onChange, placeholder, icon }: DropdownSearchProps) {
  return (
    <div className="menu-search">
      <div className="row" style={{ gap: 6 }}>
        {icon ?? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-dim)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        )}
        <input
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
