import { useCallback, useState, type HTMLAttributes } from 'react'
import { Select } from '../Select'
import { Input } from '../Input'
import { Button } from '../Button'

/* -------------------------------------------------------------------------- */
/* Model                                                                       */
/* -------------------------------------------------------------------------- */

export type QueryFieldType = 'text' | 'number' | 'select' | 'boolean' | 'date'

export interface QueryField {
  name: string
  label: string
  type: QueryFieldType
  /** For `type: 'select'` — the allowed values. */
  options?: { value: string; label: string }[]
}

export interface QueryRule {
  id: string
  field: string
  op: string
  value: string
}

export interface QueryGroup {
  id: string
  combinator: 'and' | 'or'
  /** Children are rules and/or nested groups. */
  rules: (QueryRule | QueryGroup)[]
}

export type QueryNode = QueryRule | QueryGroup

const isGroup = (n: QueryNode): n is QueryGroup => 'combinator' in n

/* Operator sets per field type. */
const OPS: Record<QueryFieldType, { value: string; label: string }[]> = {
  text:   [{ value: 'eq', label: 'is' }, { value: 'neq', label: 'is not' }, { value: 'contains', label: 'contains' }, { value: 'starts', label: 'starts with' }, { value: 'empty', label: 'is empty' }],
  number: [{ value: 'eq', label: '=' }, { value: 'neq', label: '≠' }, { value: 'gt', label: '>' }, { value: 'gte', label: '≥' }, { value: 'lt', label: '<' }, { value: 'lte', label: '≤' }],
  select: [{ value: 'eq', label: 'is' }, { value: 'neq', label: 'is not' }],
  boolean:[{ value: 'is', label: 'is' }],
  date:   [{ value: 'eq', label: 'on' }, { value: 'before', label: 'before' }, { value: 'after', label: 'after' }],
}
const NO_VALUE_OPS = new Set(['empty'])

let _uid = 0
const uid = (p: string) => `${p}_${(_uid++).toString(36)}`

export const emptyGroup = (combinator: 'and' | 'or' = 'and'): QueryGroup => ({ id: uid('g'), combinator, rules: [] })

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export interface QueryBuilderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  fields: QueryField[]
  /** Controlled query tree. */
  value?: QueryGroup
  /** Uncontrolled initial tree. */
  defaultValue?: QueryGroup
  onChange?: (value: QueryGroup) => void
  /** Allow nested AND/OR groups. Default true. */
  allowGroups?: boolean
  /** Max nesting depth (root = 0). Default 3. */
  maxDepth?: number
}

export function QueryBuilder({
  fields,
  value,
  defaultValue,
  onChange,
  allowGroups = true,
  maxDepth = 3,
  className,
  ...rest
}: QueryBuilderProps) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState<QueryGroup>(() => defaultValue ?? emptyGroup())
  const tree = isControlled ? value! : inner

  const emit = useCallback((next: QueryGroup) => {
    if (!isControlled) setInner(next)
    onChange?.(next)
  }, [isControlled, onChange])

  // Immutable tree update by id.
  const updateNode = useCallback((root: QueryGroup, id: string, fn: (n: QueryNode) => QueryNode | null): QueryGroup => {
    const walk = (n: QueryNode): QueryNode | null => {
      if (n.id === id) return fn(n)
      if (isGroup(n)) {
        const rules = n.rules.map(walk).filter((x): x is QueryNode => x !== null)
        return { ...n, rules }
      }
      return n
    }
    return walk(root) as QueryGroup
  }, [])

  const defaultRule = useCallback((): QueryRule => {
    const f = fields[0]
    return { id: uid('r'), field: f.name, op: OPS[f.type][0].value, value: '' }
  }, [fields])

  const addRule = (groupId: string) =>
    emit(updateNode(tree, groupId, (n) => isGroup(n) ? { ...n, rules: [...n.rules, defaultRule()] } : n))

  const addGroup = (groupId: string) =>
    emit(updateNode(tree, groupId, (n) => isGroup(n) ? { ...n, rules: [...n.rules, emptyGroup(n.combinator === 'and' ? 'or' : 'and')] } : n))

  const remove = (id: string) => emit(updateNode(tree, id, () => null))

  const setCombinator = (groupId: string, c: 'and' | 'or') =>
    emit(updateNode(tree, groupId, (n) => isGroup(n) ? { ...n, combinator: c } : n))

  const patchRule = (ruleId: string, patch: Partial<QueryRule>) =>
    emit(updateNode(tree, ruleId, (n) => isGroup(n) ? n : { ...n, ...patch }))

  const renderRule = (rule: QueryRule) => {
    const field = fields.find((f) => f.name === rule.field) ?? fields[0]
    const ops = OPS[field.type]
    const showValue = !NO_VALUE_OPS.has(rule.op)
    return (
      <div key={rule.id} className="flex items-center gap-2 flex-wrap">
        <Select
          size="sm"
          value={rule.field}
          onChange={(v) => {
            const nf = fields.find((f) => f.name === v) ?? fields[0]
            patchRule(rule.id, { field: v as string, op: OPS[nf.type][0].value, value: '' })
          }}
          options={fields.map((f) => ({ value: f.name, label: f.label }))}
        />
        <Select
          size="sm"
          value={rule.op}
          onChange={(v) => patchRule(rule.id, { op: v as string })}
          options={ops}
        />
        {showValue && (
          field.type === 'select' && field.options ? (
            <Select size="sm" value={rule.value || undefined} onChange={(v) => patchRule(rule.id, { value: (v as string) ?? '' })} options={field.options} placeholder="value…" />
          ) : field.type === 'boolean' ? (
            <Select size="sm" value={rule.value || 'true'} onChange={(v) => patchRule(rule.id, { value: v as string })} options={[{ value: 'true', label: 'true' }, { value: 'false', label: 'false' }]} />
          ) : (
            <Input
              size="sm"
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
              value={rule.value}
              onChange={(e) => patchRule(rule.id, { value: e.target.value })}
              placeholder="value…"
              style={{ width: 160 }}
            />
          )
        )}
        <Button size="xs" intent="ghost" iconOnly aria-label="Remove rule" onClick={() => remove(rule.id)}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </Button>
      </div>
    )
  }

  const renderGroup = (group: QueryGroup, depth: number) => (
    <div
      key={group.id}
      className={depth === 0 ? '' : 'border-l-2 border-line pl-3 ml-1'}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="inline-flex rounded-sm border border-line overflow-hidden text-xs">
          {(['and', 'or'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCombinator(group.id, c)}
              className={[
                'px-2 py-0.5 font-medium uppercase',
                group.combinator === c ? 'bg-accent-weak text-accent-ink' : 'text-text-muted hover:bg-bg-sunk',
              ].join(' ')}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="text-xs text-text-dim">{group.rules.length === 0 ? 'no conditions' : `${group.rules.length} condition${group.rules.length > 1 ? 's' : ''}`}</span>
        {depth > 0 && (
          <Button size="xs" intent="ghost" className="ml-auto" onClick={() => remove(group.id)}>Remove group</Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {group.rules.map((n) => isGroup(n) ? renderGroup(n, depth + 1) : renderRule(n))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button size="xs" intent="subtle" onClick={() => addRule(group.id)}>+ Condition</Button>
        {allowGroups && depth < maxDepth - 1 && (
          <Button size="xs" intent="ghost" onClick={() => addGroup(group.id)}>+ Group</Button>
        )}
      </div>
    </div>
  )

  return (
    <div className={className} {...rest}>
      {renderGroup(tree, 0)}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Helper: stringify a query tree to a readable expression                     */
/* -------------------------------------------------------------------------- */

export function queryToString(node: QueryNode, fields: QueryField[]): string {
  if (isGroup(node)) {
    if (node.rules.length === 0) return '∅'
    const parts = node.rules.map((n) => queryToString(n, fields))
    const joined = parts.join(` ${node.combinator.toUpperCase()} `)
    return node.rules.length > 1 ? `(${joined})` : joined
  }
  const f = fields.find((x) => x.name === node.field)
  const opLabel = f ? (OPS[f.type].find((o) => o.value === node.op)?.label ?? node.op) : node.op
  if (NO_VALUE_OPS.has(node.op)) return `${f?.label ?? node.field} ${opLabel}`
  return `${f?.label ?? node.field} ${opLabel} ${JSON.stringify(node.value)}`
}
