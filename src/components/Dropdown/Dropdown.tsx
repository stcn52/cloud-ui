import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Popover, type PopoverPlacement } from '../Popover/Popover'

export const dropdownMenuStyles = tv({
  base: [
    'w-60 bg-bg-elev border border-line rounded-md shadow-md',
    'p-1 text-sm z-[52]',
  ],
})

export interface DropdownProps {
  trigger: ReactElement
  children: ReactNode
  placement?: PopoverPlacement
  offset?: number
  /** Fixed menu width. default 240px */
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
      className={dropdownMenuStyles()}
      style={width !== undefined ? { width } : undefined}
      content={children}
    />
  )
}

export const dropdownItemStyles = tv({
  slots: {
    base: [
      'flex items-center gap-2 px-2.5 py-1.5 rounded-xs w-full text-left',
      'cursor-default text-text bg-transparent border-0 font-[inherit]',
      'hover:bg-bg-sunk',
      '[&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.5] [&_svg]:shrink-0',
    ],
    body: 'flex-1 min-w-0',
    check: 'text-accent ml-auto',
    shortcut: 'ml-auto font-mono text-[10px] text-text-dim',
    submenuIcon: 'ml-auto text-text-dim text-sm font-mono',
  },
  variants: {
    active: {
      true:  { base: 'bg-accent-weak text-accent-ink hover:bg-accent-weak' },
      false: {},
    },
    disabled: {
      true:  { base: 'opacity-40 cursor-not-allowed hover:bg-transparent' },
      false: {},
    },
    danger: {
      true:  { base: 'text-err hover:bg-[color-mix(in_oklch,var(--color-err)_10%,transparent)]' },
      false: {},
    },
  },
  defaultVariants: { active: false, disabled: false, danger: false },
})

export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  shortcut?: ReactNode
  active?: boolean
  disabled?: boolean
  submenu?: boolean
  danger?: boolean
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
  const { base, body, check, shortcut: shortcutCls, submenuIcon } = dropdownItemStyles({
    active,
    disabled,
    danger,
  })
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={base({ class: className })}
      {...rest}
    >
      {icon}
      <span className={body()}>{children}</span>
      {checked ? (
        <span className={check()}>{CheckIcon}</span>
      ) : submenu ? (
        <span className={submenuIcon()}>›</span>
      ) : shortcut !== undefined ? (
        <span className={shortcutCls()}>{shortcut}</span>
      ) : null}
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
      {label !== undefined && (
        <div className="px-2.5 pt-1.5 pb-0.5 text-[10px] uppercase tracking-[0.05em] text-text-dim">
          {label}
        </div>
      )}
      {children}
    </>
  )
}

export function DropdownSeparator() {
  return <div className="h-px bg-line my-1" role="separator" />
}

export interface DropdownSearchProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  icon?: ReactNode
}

export function DropdownSearch({ value, onChange, placeholder, icon }: DropdownSearchProps) {
  return (
    <div className="px-2 py-1.5 border-b border-line mb-1 flex items-center gap-1.5">
      {icon ?? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-dim)"
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
        className="w-full border-0 outline-0 bg-transparent text-sm text-text font-[inherit]"
      />
    </div>
  )
}
