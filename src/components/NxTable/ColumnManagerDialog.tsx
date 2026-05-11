import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../Button'
import { Dialog, DialogHead, DialogBody, DialogFoot } from '../Dialog'
import { Transfer, type TransferItem, type TransferTargetEntry } from '../Transfer'
import type { NxColumn } from './types'

export const FROZEN_GROUP = 'frozen'

export interface ColumnManagerApply {
  hidden: string[]
  order: string[]
  pins: Record<string, 'left' | 'right' | null>
}

export interface ColumnManagerDialogProps<R> {
  open: boolean
  onClose: () => void
  allColumns: NxColumn<R>[]
  hidden: Set<string>
  colOrder: string[]
  colPins: Record<string, 'left' | 'right' | null>
  onApply: (next: ColumnManagerApply) => void
  onResetDefaults: () => void
}

export function ColumnManagerDialog<R>({
  open, onClose, allColumns, hidden, colOrder, colPins, onApply, onResetDefaults,
}: ColumnManagerDialogProps<R>) {
  // Build the Transfer "items" once per column set.
  const items: TransferItem[] = useMemo(
    () => allColumns.map((c) => ({
      key: c.key,
      label: c.label,
      searchText: typeof c.label === 'string' ? c.label : c.key,
    })),
    [allColumns],
  )

  // Resolve a column's effective pin (override beats prop).
  const resolvePin = useCallback((c: NxColumn<R>): 'left' | 'right' | null => {
    const o = colPins[c.key]
    return o === undefined ? (c.pinned ?? null) : o
  }, [colPins])

  // Current target = visible columns, in order, with the frozen group derived from pin state.
  const initialTarget = useMemo<TransferTargetEntry[]>(() => {
    const byKey = new Map(allColumns.map((c) => [c.key, c]))
    const orderedKeys = [
      ...colOrder.filter((k) => byKey.has(k)),
      ...allColumns.map((c) => c.key).filter((k) => !colOrder.includes(k)),
    ]
    return orderedKeys
      .map((k) => byKey.get(k)!)
      .filter((c) => !hidden.has(c.key))
      .map((c) => ({ key: c.key, group: resolvePin(c) === 'left' ? FROZEN_GROUP : undefined }))
  }, [allColumns, colOrder, hidden, resolvePin])

  const [draft, setDraft] = useState<TransferTargetEntry[]>(initialTarget)
  const initialTargetRef = useRef(initialTarget)
  initialTargetRef.current = initialTarget
  // Re-seed the draft each time the dialog opens (so it reflects the latest applied state).
  useEffect(() => {
    if (open) setDraft(initialTargetRef.current)
  }, [open])

  const apply = () => {
    const visibleKeys = draft.map((e) => e.key)
    const hiddenKeys = allColumns.map((c) => c.key).filter((k) => !visibleKeys.includes(k))
    // Order: frozen entries first (in their order), then the rest, then hidden columns appended.
    const frozen = draft.filter((e) => e.group === FROZEN_GROUP).map((e) => e.key)
    const normal = draft.filter((e) => e.group !== FROZEN_GROUP).map((e) => e.key)
    const order = [...frozen, ...normal, ...hiddenKeys]
    // Pins: every visible entry gets an explicit override (left if frozen, else null).
    // Right-pinned prop columns that are still visible & not frozen keep 'right'.
    const pins: Record<string, 'left' | 'right' | null> = {}
    for (const e of draft) {
      if (e.group === FROZEN_GROUP) pins[e.key] = 'left'
      else {
        const col = allColumns.find((c) => c.key === e.key)
        pins[e.key] = (col?.pinned === 'right' && colPins[e.key] !== null) ? 'right' : null
      }
    }
    onApply({ hidden: hiddenKeys, order, pins })
  }

  return (
    <Dialog open={open} onClose={onClose} className="w-190">
      <DialogHead title="Columns" />
      <DialogBody>
        <Transfer
          items={items}
          value={draft}
          onChange={setDraft}
          titles={[`Available · ${items.length - draft.length}`, `Shown · ${draft.length}`]}
          groups={[{ id: FROZEN_GROUP, label: 'Frozen', max: 3 }]}
          ungroupedLabel="Scrollable"
          onResetDefaults={onResetDefaults}
          paneHeight={320}
        />
      </DialogBody>
      <DialogFoot>
        <Button intent="ghost" onClick={onClose}>Cancel</Button>
        <Button intent="primary" onClick={apply}>Apply</Button>
      </DialogFoot>
    </Dialog>
  )
}
