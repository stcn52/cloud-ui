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
import { Portal } from '../_internal/Portal'
import { cx } from '../../utils/cx'

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
  /** Apply default `.popover` surface styles. Set false if content supplies its own (e.g. `.menu`). default true */
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

  // clamp to viewport
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
            className={cx(surface && 'popover', className)}
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
  return (
    <button type="button" role="menuitem" className={cx('row-item', danger && 'danger', className)} {...rest}>
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {shortcut !== undefined && <span className="kbd-tail">{shortcut}</span>}
    </button>
  )
}

export function PopoverSeparator() {
  return <div className="sep-h" role="separator" />
}
