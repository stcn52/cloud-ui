import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { tv } from 'tailwind-variants'
import { Portal } from '../_internal/Portal'

export const popoverSurfaceStyles = tv({
  base: [
    'bg-bg-elev border border-line rounded-md shadow-md',
    'p-1.5 text-sm z-[52] min-w-[200px]',
  ],
})

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom'
  | 'top-start'
  | 'top-end'
  | 'top'

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Trigger element; receives onClick + ref. */
  trigger: ReactElement
  /** Popover content. */
  content: ReactNode
  placement?: PopoverPlacement
  /** Offset (px) between trigger and popover. default 6 */
  offset?: number
  /** Controlled open state. Uncontrolled if omitted. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close when clicking outside. default true */
  closeOnOutside?: boolean
  /** Close on ESC. default true */
  closeOnEscape?: boolean
  /** Apply default popover surface styles. Set false if content supplies its own. default true */
  surface?: boolean
}

function computePosition(
  triggerRect: DOMRect,
  panelRect: DOMRect,
  placement: PopoverPlacement,
  offset: number,
): CSSProperties {
  const vw = window.innerWidth
  const vh = window.innerHeight

  let top = 0
  let left = 0
  const [side, align] = placement.split('-') as [string, string | undefined]

  if (side === 'bottom') top = triggerRect.bottom + offset
  else if (side === 'top') top = triggerRect.top - panelRect.height - offset

  if (align === 'start') left = triggerRect.left
  else if (align === 'end') left = triggerRect.right - panelRect.width
  else left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2

  left = Math.max(8, Math.min(left, vw - panelRect.width - 8))
  top = Math.max(8, Math.min(top, vh - panelRect.height - 8))

  return { position: 'fixed', top, left }
}

export function Popover({
  trigger,
  content,
  placement = 'bottom-start',
  offset = 6,
  open: controlledOpen,
  onOpenChange,
  closeOnOutside = true,
  closeOnEscape = true,
  surface = true,
  className,
  style: styleProp,
  ...rest
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden' })

  useLayoutEffect(() => {
    if (!open) return
    const trg = triggerRef.current
    const pnl = panelRef.current
    if (!trg || !pnl) return
    setStyle(computePosition(trg.getBoundingClientRect(), pnl.getBoundingClientRect(), placement, offset))
  }, [open, placement, offset])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!closeOnOutside) return
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, closeOnOutside, closeOnEscape, setOpen])

  if (!isValidElement(trigger)) {
    throw new Error('Popover: `trigger` must be a single valid React element')
  }
  const triggerWithProps = cloneElement(trigger, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node
      const orig = (trigger as ReactElement & { ref?: unknown }).ref
      if (typeof orig === 'function') (orig as (n: HTMLElement) => void)(node)
      else if (orig && typeof orig === 'object' && 'current' in orig) {
        (orig as React.MutableRefObject<HTMLElement | null>).current = node
      }
    },
    onClick: (e: React.MouseEvent) => {
      ;(trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
      setOpen(!open)
    },
  } as Partial<HTMLAttributes<HTMLElement>> & { ref?: unknown })

  return (
    <>
      {triggerWithProps}
      {open && (
        <Portal>
          <div
            ref={panelRef}
            className={surface ? popoverSurfaceStyles({ class: className }) : className}
            style={{ ...styleProp, ...style }}
            role="menu"
            {...rest}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  )
}

export const popoverItemStyles = tv({
  slots: {
    base: [
      'flex items-center gap-2 px-2 py-1.5 rounded-xs w-full text-left',
      'text-text bg-transparent border-0 font-[inherit] cursor-pointer',
      'hover:bg-bg-sunk focus-visible:bg-bg-sunk focus-visible:outline-none',
    ],
    icon: '[&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.5]',
    body: 'flex-1 min-w-0',
    shortcut: 'ml-auto font-mono text-[10px] text-text-dim',
  },
  variants: {
    danger: {
      true: { base: 'text-err hover:bg-[color-mix(in_oklch,var(--color-err)_10%,transparent)]' },
      false: {},
    },
  },
  defaultVariants: { danger: false },
})

export interface PopoverItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  shortcut?: ReactNode
  danger?: boolean
  children?: ReactNode
}

export function PopoverItem({
  icon,
  shortcut,
  danger,
  className,
  children,
  ...rest
}: PopoverItemProps) {
  const { base, icon: iconCls, body, shortcut: shortcutCls } = popoverItemStyles({ danger })
  return (
    <button type="button" role="menuitem" className={base({ class: className })} {...rest}>
      {icon && <span className={iconCls()}>{icon}</span>}
      <span className={body()}>{children}</span>
      {shortcut !== undefined && <span className={shortcutCls()}>{shortcut}</span>}
    </button>
  )
}

export function PopoverSeparator() {
  return <div className="h-px bg-line my-1" role="separator" />
}
