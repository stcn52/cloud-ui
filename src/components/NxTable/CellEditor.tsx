import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Input } from '../Input'
import { Select } from '../Select'
import { Portal } from '../_internal/Portal'
import type { NxCellEditorArgs, NxEditable } from './types'

/**
 * Renders the inline editor for a cell — a built-in `text` / `number` / `date`
 * (`<Input>`) or `select` (`<Select>`), or a column-supplied custom `render`.
 * Commits on Enter / blur / select-change; cancels on Escape. The select editor
 * commits immediately on change.
 *
 * The editor is rendered via Portal anchored to the cell's bounding rect, so it
 * floats over the cell without changing the row height. Outside-click closes
 * (treated as cancel for text-like inputs that haven't blurred yet).
 */
export function CellEditor<R>({
  editable,
  args,
  anchorRef,
}: {
  editable: NxEditable<R>
  args: NxCellEditorArgs<R>
  /**
   * Ref to the cell `<td>` to anchor against. We take a ref (not the element
   * directly) so the editor reads the current `.current` after mount/commit —
   * passing the element via prop would always see `null` on the first render
   * because the parent's ref-callback only fires during commit.
   */
  anchorRef: RefObject<HTMLElement | null>
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden', zIndex: 60 })

  // Re-position on mount + on scroll/resize while open. We anchor to the cell's
  // vertical centre and let the panel auto-grow up/down equally if the editor
  // is taller than the row — otherwise a tall input rendered from `top: cell.top`
  // visually leaks into the row below.
  useLayoutEffect(() => {
    const reposition = () => {
      const a = anchorRef.current
      const p = panelRef.current
      if (!a) return
      const r = a.getBoundingClientRect()
      const ph = p?.offsetHeight ?? r.height
      const top = Math.round(r.top + r.height / 2 - ph / 2)
      setStyle({
        position: 'fixed',
        top,
        left: r.left,
        minWidth: r.width,
        zIndex: 60,
      })
    }
    reposition()
    // Re-run once after mount in case the panel measured 0 the first time.
    const raf = requestAnimationFrame(reposition)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Outside click → cancel (text/number/date inputs also commit via blur).
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      // If the anchor itself was clicked again, ignore (NxTable will restart editing).
      if (anchorRef.current?.contains(e.target as Node)) return
      args.cancel()
    }
    // Defer one tick so the open click doesn't immediately close it.
    const t = setTimeout(() => document.addEventListener('mousedown', onDown), 0)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', onDown) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let body: React.ReactNode
  if ('render' in editable) {
    body = editable.render(args)
  } else if (editable.type === 'select') {
    body = (
      <Select
        searchable={editable.options.length > 8}
        value={args.value == null ? undefined : String(args.value)}
        onChange={(v) => args.commit(v ?? null)}
        options={editable.options}
        aria-label="Edit value"
      />
    )
  } else {
    body = <TextLikeEditor type={editable.type} args={args} />
  }

  return (
    <Portal>
      {/* No bg/shadow on the panel itself — the inner editor (Input/Select/custom)
          carries its own chrome. This keeps the floating box exactly the size of
          the editor so it doesn't visually bleed into the rows above/below. */}
      <div ref={panelRef} style={style}>
        {body}
      </div>
    </Portal>
  )
}

function TextLikeEditor<R>({ type, args }: { type: 'text' | 'number' | 'date'; args: NxCellEditorArgs<R> }) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { const el = ref.current; if (el) { el.focus(); el.select?.() } }, [])
  const initial = args.value == null ? '' : String(args.value)
  return (
    <Input
      ref={ref}
      type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
      defaultValue={initial}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); commitFrom(e.currentTarget, type, args) }
        else if (e.key === 'Escape') { e.preventDefault(); args.cancel() }
      }}
      onBlur={(e) => commitFrom(e.currentTarget, type, args)}
      aria-label="Edit value"
    />
  )
}

function commitFrom<R>(el: HTMLInputElement, type: 'text' | 'number' | 'date', args: NxCellEditorArgs<R>) {
  const raw = el.value
  if (type === 'number') args.commit(raw === '' ? null : Number(raw))
  else args.commit(raw)
}
