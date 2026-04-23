import {
  cloneElement,
  Fragment,
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
  /**
   * Trigger element; receives onClick + ref. Strings, numbers, and fragments
   * are auto-wrapped in a `<span>` so consumers can pass primitive content.
   */
  trigger: ReactNode
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

  // Smart wrapping: if trigger is a string, number, fragment, array, or any
  // non-ref-accepting primitive, wrap it in a <span> so we can attach ref+onClick.
  let triggerElement: ReactElement
  if (
    trigger === null ||
    trigger === undefined ||
    typeof trigger === 'string' ||
    typeof trigger === 'number' ||
    typeof trigger === 'boolean' ||
    Array.isArray(trigger) ||
    (isValidElement(trigger) && trigger.type === Fragment)
  ) {
    triggerElement = <span>{trigger as ReactNode}</span>
  } else if (isValidElement(trigger)) {
    triggerElement = trigger
  } else {
    throw new Error(
      'Popover: `trigger` must be a single valid React element — wrap your trigger in a single element or pass a fragment',
    )
  }

  const triggerWithProps = cloneElement(triggerElement, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node
      const orig = (triggerElement as ReactElement & { ref?: unknown }).ref
      if (typeof orig === 'function') (orig as (n: HTMLElement) => void)(node)
      else if (orig && typeof orig === 'object' && 'current' in orig) {
        (orig as React.MutableRefObject<HTMLElement | null>).current = node
      }
    },
    onClick: (e: React.MouseEvent) => {
      ;(triggerElement.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
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
  /** If set, hovering this item opens a right-side submenu containing `submenu`. */
  submenu?: ReactNode
  children?: ReactNode
}

export function PopoverItem({
  icon,
  shortcut,
  danger,
  submenu,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: PopoverItemProps) {
  const { base, icon: iconCls, body, shortcut: shortcutCls } = popoverItemStyles({ danger })
  const [open, setOpen] = useState(false)
  const hostRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden' })

  useLayoutEffect(() => {
    if (!open) return
    const host = hostRef.current
    const pnl = panelRef.current
    if (!host || !pnl) return
    const hostRect = host.getBoundingClientRect()
    const panelRect = pnl.getBoundingClientRect()
    let left = hostRect.right + 2
    let top = hostRect.top
    if (left + panelRect.width > window.innerWidth - 8) {
      left = hostRect.left - panelRect.width - 2
    }
    if (top + panelRect.height > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - panelRect.height - 8)
    }
    setStyle({ position: 'fixed', top, left })
  }, [open])

  const scheduleClose = () => {
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 200)
  }
  const cancelClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <>
      <button
        ref={hostRef}
        type="button"
        role="menuitem"
        aria-haspopup={submenu ? 'menu' : undefined}
        aria-expanded={submenu ? open : undefined}
        className={base({ class: className })}
        onMouseEnter={(e) => {
          onMouseEnter?.(e)
          if (submenu) {
            cancelClose()
            setOpen(true)
          }
        }}
        onMouseLeave={(e) => {
          onMouseLeave?.(e)
          if (submenu) scheduleClose()
        }}
        {...rest}
      >
        {icon && <span className={iconCls()}>{icon}</span>}
        <span className={body()}>{children}</span>
        {submenu ? (
          <span className="ml-auto text-text-dim font-mono text-sm leading-none">›</span>
        ) : shortcut !== undefined ? (
          <span className={shortcutCls()}>{shortcut}</span>
        ) : null}
      </button>
      {submenu && open && (
        <Portal>
          <div
            ref={panelRef}
            role="menu"
            className={popoverSurfaceStyles()}
            style={style}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {submenu}
          </div>
        </Portal>
      )}
    </>
  )
}

export function PopoverSeparator() {
  return <div className="h-px bg-line my-1" role="separator" />
}
