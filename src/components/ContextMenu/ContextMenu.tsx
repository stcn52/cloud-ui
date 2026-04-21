import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { Portal } from '../_internal/Portal'
import { popoverSurfaceStyles } from '../Popover/Popover'

export interface ContextMenuHandle {
  /** Spread onto the target element's props (`onContextMenu`). */
  open: (e: ReactMouseEvent | MouseEvent) => void
  /** Close the menu programmatically. */
  close: () => void
  /** Render the menu surface — call this once somewhere in the tree. */
  render: () => ReactNode
}

function clampToViewport(x: number, y: number, w: number, h: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const left = x + w > vw - 8 ? Math.max(8, vw - w - 8) : x
  const top = y + h > vh - 8 ? Math.max(8, vh - h - 8) : y
  return { top, left }
}

/**
 * Mouse-anchored context menu. Attach `handle.open` to `onContextMenu` on each
 * target; render `handle.render()` once — the surface gets reused for every
 * target that opens it, so a list of N rows doesn't duplicate the menu in the
 * DOM.
 */
export function useContextMenu(menu: ReactNode): ContextMenuHandle {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden' })
  const panelRef = useRef<HTMLDivElement | null>(null)

  const close = useCallback(() => setOpen(false), [])

  const openFn = useCallback((e: ReactMouseEvent | MouseEvent) => {
    e.preventDefault()
    setAnchor({ x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY })
    setStyle({ position: 'fixed', visibility: 'hidden' })
    setOpen(true)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return
    const { top, left } = clampToViewport(anchor.x, anchor.y, rect.width, rect.height)
    setStyle({ position: 'fixed', top, left })
  }, [open, anchor])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onResize = () => setOpen(false)
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  const render = useCallback(() => {
    if (!open) return null
    return (
      <Portal>
        <div
          ref={panelRef}
          role="menu"
          className={popoverSurfaceStyles()}
          style={style}
          onClick={() => setOpen(false)}
        >
          {menu}
        </div>
      </Portal>
    )
  }, [open, style, menu])

  return { open: openFn, close, render }
}
