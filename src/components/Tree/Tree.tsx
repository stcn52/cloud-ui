import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Checkbox } from '../Checkbox'

const treeStyles = tv({
  slots: {
    root: 'text-sm',
    node: [
      'flex items-center gap-1.5 px-2 py-1 rounded-xs',
      'cursor-default text-text select-none',
      'hover:bg-bg-sunk',
    ],
    caret: [
      'w-3 h-3 inline-flex items-center justify-center',
      'text-text-dim transition-transform duration-[.12s]',
    ],
    icon: 'w-3.5 h-3.5 text-text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full',
    meta: 'ml-auto font-mono text-[10.5px] text-text-dim',
    children: 'ml-3.5 border-l border-dashed border-line pl-1',
  },
  variants: {
    selected: {
      true:  { node: 'bg-accent-weak text-accent-ink hover:bg-accent-weak' },
      false: {},
    },
    open: {
      true:  { caret: 'rotate-90' },
      false: {},
    },
    leaf: {
      true:  { caret: 'opacity-0' },
      false: {},
    },
  },
})

export interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  meta?: ReactNode
  children?: TreeNode[]
}

export type TreeSelectionMode = 'single' | 'multiple' | 'checkbox'

// When selectionMode is 'single' (or omitted), selected is string | null and onSelectedChange gets string | null.
// When selectionMode is 'multiple' or 'checkbox', selected is string[] and onSelectedChange gets string[].
// We expose a single props type that accepts both shapes; narrowing happens at runtime by mode.
export interface TreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> {
  data: TreeNode[]

  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (ids: string[]) => void

  selectionMode?: TreeSelectionMode

  /**
   * For single-mode: string | null.
   * For multiple/checkbox-mode: string[].
   */
  selected?: string | null | string[]
  defaultSelected?: string | null | string[]
  onSelectedChange?: (value: string | null | string[]) => void

  /** Legacy single-select callback; still fires for all modes. */
  onSelect?: (id: string, node: TreeNode) => void
}

const CaretSvg = (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="8 5 19 12 8 19" />
  </svg>
)

// Collect all descendant ids (not including self).
function collectDescendantIds(node: TreeNode): string[] {
  const out: string[] = []
  const walk = (n: TreeNode) => {
    if (!n.children) return
    for (const c of n.children) {
      out.push(c.id)
      walk(c)
    }
  }
  walk(node)
  return out
}

type CheckState = 'checked' | 'unchecked' | 'indeterminate'

/**
 * For checkbox mode, compute the effective state of a node given the selected set.
 * A node is:
 *  - checked: all leaf descendants are in the set (or if the node is a leaf, the node itself is in the set)
 *  - unchecked: none are
 *  - indeterminate: some but not all
 */
function computeCheckState(node: TreeNode, selectedSet: Set<string>): CheckState {
  if (!node.children || node.children.length === 0) {
    return selectedSet.has(node.id) ? 'checked' : 'unchecked'
  }
  let allChecked = true
  let anyChecked = false
  for (const c of node.children) {
    const s = computeCheckState(c, selectedSet)
    if (s === 'checked') anyChecked = true
    else if (s === 'indeterminate') {
      anyChecked = true
      allChecked = false
    } else {
      allChecked = false
    }
  }
  if (allChecked) return 'checked'
  if (anyChecked) return 'indeterminate'
  return 'unchecked'
}

// Flatten leaf ids under a node (including the node itself if it's a leaf).
function leafIdsOf(node: TreeNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id]
  const out: string[] = []
  for (const c of node.children) out.push(...leafIdsOf(c))
  return out
}

function NodeRow({
  node,
  expandedSet,
  selectionMode,
  selectedSet,
  singleSelectedId,
  toggleExpand,
  onNodeSelect,
  onCheckboxToggle,
}: {
  node: TreeNode
  expandedSet: Set<string>
  selectionMode: TreeSelectionMode
  selectedSet: Set<string>
  singleSelectedId: string | null
  toggleExpand: (id: string) => void
  onNodeSelect: (node: TreeNode) => void
  onCheckboxToggle: (node: TreeNode, nextChecked: boolean) => void
}) {
  const hasChildren = !!node.children?.length
  const open = hasChildren && expandedSet.has(node.id)

  let isSelected = false
  if (selectionMode === 'single') {
    isSelected = node.id === singleSelectedId
  } else if (selectionMode === 'multiple') {
    isSelected = selectedSet.has(node.id)
  }
  // checkbox mode doesn't use `selected` highlight on the row

  const s = treeStyles({ selected: isSelected, open, leaf: !hasChildren })

  let checkState: CheckState = 'unchecked'
  if (selectionMode === 'checkbox') {
    checkState = computeCheckState(node, selectedSet)
  }

  return (
    <>
      <div
        className={s.node()}
        role="treeitem"
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={selectionMode === 'checkbox' ? undefined : isSelected}
        aria-checked={
          selectionMode === 'checkbox'
            ? checkState === 'checked'
              ? true
              : checkState === 'indeterminate'
                ? 'mixed'
                : false
            : undefined
        }
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          if (selectionMode !== 'checkbox') {
            onNodeSelect(node)
          }
          if (hasChildren) toggleExpand(node.id)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (selectionMode === 'checkbox') {
              onCheckboxToggle(node, checkState !== 'checked')
            } else {
              onNodeSelect(node)
              if (hasChildren) toggleExpand(node.id)
            }
          } else if (e.key === 'ArrowRight' && hasChildren && !open) {
            e.preventDefault()
            toggleExpand(node.id)
          } else if (e.key === 'ArrowLeft' && hasChildren && open) {
            e.preventDefault()
            toggleExpand(node.id)
          }
        }}
      >
        <span className={s.caret()}>{hasChildren && CaretSvg}</span>
        {selectionMode === 'checkbox' && (
          <Checkbox
            checked={checkState === 'checked'}
            indeterminate={checkState === 'indeterminate'}
            onChange={(e) => onCheckboxToggle(node, e.currentTarget.checked)}
            onClick={(e) => e.stopPropagation()}
            aria-label={typeof node.label === 'string' ? node.label : undefined}
          />
        )}
        {node.icon && <span className={s.icon()}>{node.icon}</span>}
        <span>{node.label}</span>
        {node.meta !== undefined && <span className={s.meta()}>{node.meta}</span>}
      </div>
      {hasChildren && open && (
        <div className={s.children()} role="group">
          {node.children!.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              expandedSet={expandedSet}
              selectionMode={selectionMode}
              selectedSet={selectedSet}
              singleSelectedId={singleSelectedId}
              toggleExpand={toggleExpand}
              onNodeSelect={onNodeSelect}
              onCheckboxToggle={onCheckboxToggle}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function Tree({
  data,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selectionMode = 'single',
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  onSelect,
  className,
  ...rest
}: TreeProps) {
  const isMulti = selectionMode === 'multiple' || selectionMode === 'checkbox'

  const resolvedDefault: string | null | string[] =
    defaultSelected !== undefined
      ? defaultSelected
      : isMulti
        ? []
        : null

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(defaultExpanded)
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null | string[]>(
    resolvedDefault,
  )

  const expandedIds = expandedProp ?? uncontrolledExpanded
  const rawSelected = selectedProp !== undefined ? selectedProp : uncontrolledSelected

  const expandedSet = new Set(expandedIds)

  // Normalize selection into both a set (for multi/checkbox lookup) and a single id (for single-mode).
  const selectedArray: string[] = Array.isArray(rawSelected)
    ? rawSelected
    : rawSelected
      ? [rawSelected]
      : []
  const selectedSet = new Set(selectedArray)
  const singleSelectedId: string | null =
    !isMulti && typeof rawSelected === 'string' ? rawSelected : null

  const commitSelected = (next: string | null | string[]) => {
    if (selectedProp === undefined) setUncontrolledSelected(next)
    onSelectedChange?.(next)
  }

  const toggleExpand = (id: string) => {
    const next = expandedSet.has(id)
      ? expandedIds.filter((x) => x !== id)
      : [...expandedIds, id]
    if (expandedProp === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const onNodeSelect = (node: TreeNode) => {
    onSelect?.(node.id, node)
    if (selectionMode === 'single') {
      commitSelected(node.id)
    } else if (selectionMode === 'multiple') {
      const has = selectedSet.has(node.id)
      const next = has
        ? selectedArray.filter((x) => x !== node.id)
        : [...selectedArray, node.id]
      commitSelected(next)
    }
  }

  /**
   * Checkbox cascade semantics:
   *  - We track selection as the set of *leaf* ids that are checked. This makes the
   *    parent's checked/indeterminate state purely derived and avoids inconsistencies.
   *  - Toggling a parent to checked adds all its leaf descendants.
   *  - Toggling a parent to unchecked removes all its leaf descendants.
   *  - Toggling a leaf just adds/removes itself.
   */
  const onCheckboxToggle = (node: TreeNode, nextChecked: boolean) => {
    onSelect?.(node.id, node)
    const leaves = leafIdsOf(node)
    const currentSet = new Set(selectedArray)
    if (nextChecked) {
      for (const id of leaves) currentSet.add(id)
    } else {
      for (const id of leaves) currentSet.delete(id)
    }
    commitSelected(Array.from(currentSet))
  }

  const { root } = treeStyles()
  return (
    <div className={root({ class: className })} role="tree" {...rest}>
      {data.map((n) => (
        <NodeRow
          key={n.id}
          node={n}
          expandedSet={expandedSet}
          selectionMode={selectionMode}
          selectedSet={selectedSet}
          singleSelectedId={singleSelectedId}
          toggleExpand={toggleExpand}
          onNodeSelect={onNodeSelect}
          onCheckboxToggle={onCheckboxToggle}
        />
      ))}
    </div>
  )
}

// Utility exports (may be useful for consumers implementing custom UIs).
export { collectDescendantIds, leafIdsOf }
