import { useState } from 'react'
import {
  Transfer,
  type TransferItem,
  type TransferTargetEntry,
  Dialog,
  DialogHead,
  DialogBody,
  DialogFoot,
  Button,
  Table,
  Banner,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

const FIELDS: TransferItem[] = [
  { key: 'title', label: 'Title', disabled: true },
  { key: 'id', label: 'ID' },
  { key: 'type', label: 'Work item type' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
  { key: 'parent', label: 'Parent item' },
  { key: 'start', label: 'Start date' },
  { key: 'end', label: 'Due date' },
  { key: 'watchers', label: 'Watchers' },
  { key: 'priority', label: 'Priority' },
  { key: 'severity', label: 'Severity' },
  { key: 'sprint', label: 'Sprint' },
  { key: 'estimate', label: 'Estimate' },
  { key: 'tags', label: 'Tags' },
]

function BasicTransferDemo() {
  const [value, setValue] = useState<TransferTargetEntry[]>([
    { key: 'id' }, { key: 'title' }, { key: 'status' }, { key: 'owner' }, { key: 'priority' },
  ])
  return (
    <div style={{ width: 640 }}>
      <Transfer
        items={FIELDS}
        value={value}
        onChange={setValue}
        titles={['Available columns', 'Shown columns']}
        onResetDefaults={() => setValue([{ key: 'id' }, { key: 'title' }, { key: 'status' }, { key: 'owner' }])}
      />
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 8 }}>
        selected: {value.map((e) => e.key).join(', ')}
      </p>
    </div>
  )
}

function GroupedTransferDemo() {
  const [value, setValue] = useState<TransferTargetEntry[]>([
    { key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' },
    { key: 'status' }, { key: 'priority' }, { key: 'owner' }, { key: 'parent' },
  ])
  return (
    <div style={{ width: 640 }}>
      <Transfer
        items={FIELDS}
        value={value}
        onChange={setValue}
        titles={['Available columns', 'Shown columns']}
        groups={[{ id: 'frozen', label: 'Frozen', max: 3 }]}
        ungroupedLabel="Scrollable"
        onResetDefaults={() => setValue([{ key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' }, { key: 'status' }, { key: 'owner' }])}
      />
    </div>
  )
}

function DialogTransferDemo() {
  const DEFAULT: TransferTargetEntry[] = [
    { key: 'id', group: 'frozen' }, { key: 'title', group: 'frozen' },
    { key: 'status' }, { key: 'owner' }, { key: 'priority' }, { key: 'parent' }, { key: 'severity' },
  ]
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<TransferTargetEntry[]>(DEFAULT)
  const [draft, setDraft] = useState<TransferTargetEntry[]>(DEFAULT)
  return (
    <div>
      <Button onClick={() => { setDraft(applied); setOpen(true) }}>Configure columns…</Button>
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 8 }}>
        applied ({applied.length}): {applied.map((e) => (e.group ? `🔒${e.key}` : e.key)).join(', ')}
      </p>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHead title="Column settings" />
        <DialogBody>
          <div style={{ width: 720 }}>
            <Transfer
              items={FIELDS}
              value={draft}
              onChange={setDraft}
              titles={[`Available · ${FIELDS.length}`, `Shown · ${draft.length}`]}
              groups={[{ id: 'frozen', label: 'Frozen', max: 3 }]}
              ungroupedLabel="Scrollable"
              onResetDefaults={() => setDraft(DEFAULT)}
              paneHeight={320}
            />
          </div>
        </DialogBody>
        <DialogFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button intent="primary" onClick={() => { setApplied(draft); setOpen(false) }}>Apply</Button>
        </DialogFoot>
      </Dialog>
    </div>
  )
}

export default function TransferPage() {
  return (
    <article className="page">
      <h1>Transfer</h1>
      <p>
        Two-list picker — move items from an <em>available</em> pane to a <em>selected</em> pane (and
        back) by clicking, with per-pane search and "add all" / "remove all". The selected side is
        ordered; with <code>sortable</code> (on by default) you can drag-reorder it. Pass{' '}
        <code>groups</code> to split the selected pane into capped buckets — exactly the
        "Frozen / Scrollable" column manager pattern (it's what <code>NxTable</code>'s{' '}
        <code>columnManager="dialog"</code> uses under the hood).
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Configuring which columns a table shows, assigning members to a group, picking a subset of
        options where order matters. For a flat multi-select with no second pane, use a tag input or
        a multi-select combobox instead.
      </Banner>

      <h2>Basic</h2>
      <p>
        Controlled via <code>value</code> + <code>onChange</code> (or uncontrolled via{' '}
        <code>defaultValue</code>). <code>value</code> entries are <code>{'{ key, group? }'}</code>{' '}
        objects (a bare <code>string</code> key works too); <code>onChange</code> always reports
        normalized <code>TransferTargetEntry[]</code>, in display order. <code>disabled</code> items
        (here <em>Title</em>) stay put and can't be moved.
      </p>
      <Demo
        code={`const [value, setValue] = useState<TransferTargetEntry[]>([
  { key: 'id' }, { key: 'title' }, { key: 'status' }, { key: 'owner' },
])

<Transfer
  items={FIELDS}
  value={value}
  onChange={setValue}
  titles={['Available columns', 'Shown columns']}
  onResetDefaults={() => setValue(DEFAULT)}
/>`}
      >
        <BasicTransferDemo />
      </Demo>

      <h2>Grouped target (frozen bucket)</h2>
      <p>
        Pass <code>groups</code> and the selected pane is split into those buckets (in declared
        order), plus an implicit "ungrouped" bucket (<code>ungroupedLabel</code>) for entries with
        no <code>group</code>. A group with <code>max</code> rejects drops past the cap and shows a{' '}
        <code>(n/max)</code> counter. Drag rows between buckets.
      </p>
      <Demo
        code={`<Transfer
  items={FIELDS}
  value={value}
  onChange={setValue}
  groups={[{ id: 'frozen', label: 'Frozen', max: 3 }]}
  ungroupedLabel="Scrollable"
/>`}
      >
        <GroupedTransferDemo />
      </Demo>

      <h2>In a dialog</h2>
      <p>
        The canonical "configure table columns" flow — <code>Transfer</code> inside a{' '}
        <code>Dialog</code>, editing a draft that's applied on confirm.
      </p>
      <Demo
        code={`<Dialog open={open} onClose={close}>
  <DialogHead title="Column settings" />
  <DialogBody>
    <Transfer items={FIELDS} value={draft} onChange={setDraft}
      groups={[{ id: 'frozen', label: 'Frozen', max: 3 }]}
      ungroupedLabel="Scrollable" paneHeight={320} />
  </DialogBody>
  <DialogFoot>
    <Button intent="ghost" onClick={close}>Cancel</Button>
    <Button intent="primary" onClick={() => { setApplied(draft); close() }}>Apply</Button>
  </DialogFoot>
</Dialog>`}
      >
        <DialogTransferDemo />
      </Demo>

      <h2>Not sortable</h2>
      <p>
        <code>sortable={'{false}'}</code> turns it into a plain two-list picker — no drag handles,
        no group buckets.
      </p>
      <Demo
        code={`<Transfer items={FIELDS} value={value} onChange={setValue} sortable={false} />`}
      >
        <div style={{ width: 560 }}>
          <Transfer
            items={FIELDS.slice(0, 9)}
            defaultValue={[{ key: 'id' }, { key: 'title' }, { key: 'status' }]}
            sortable={false}
          />
        </div>
      </Demo>

      <h2>Transfer API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>items</code></td><td><code>TransferItem[]</code></td><td>—</td><td>The full pool of items (across both panes). Required.</td></tr>
          <tr><td><code>value</code></td><td><code>(string | TransferTargetEntry)[]</code></td><td>—</td><td>Controlled — keys (with optional group) currently on the target side, in order.</td></tr>
          <tr><td><code>defaultValue</code></td><td><code>(string | TransferTargetEntry)[]</code></td><td><code>[]</code></td><td>Uncontrolled initial target.</td></tr>
          <tr><td><code>onChange</code></td><td><code>(value: TransferTargetEntry[]) =&gt; void</code></td><td>—</td><td>Fires with the new ordered target entries.</td></tr>
          <tr><td><code>groups</code></td><td><code>TransferGroup[]</code></td><td>—</td><td>Split the target pane into these buckets (plus an implicit ungrouped one).</td></tr>
          <tr><td><code>ungroupedLabel</code></td><td><code>ReactNode</code></td><td><code>'Other'</code></td><td>Heading for the implicit ungrouped bucket (only with <code>groups</code>).</td></tr>
          <tr><td><code>sortable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Drag-to-reorder (and drag-between-groups) on the target side.</td></tr>
          <tr><td><code>titles</code></td><td><code>[ReactNode, ReactNode]</code></td><td><code>['Available', 'Selected']</code></td><td>Headings above the source / target panes.</td></tr>
          <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show the search box in each pane.</td></tr>
          <tr><td><code>searchPlaceholder</code></td><td><code>string</code></td><td><code>'Search…'</code></td><td>Placeholder for the search inputs.</td></tr>
          <tr><td><code>onResetDefaults</code></td><td><code>() =&gt; void</code></td><td>—</td><td>When provided, a "Restore defaults" link is shown.</td></tr>
          <tr><td><code>emptyText</code></td><td><code>ReactNode</code></td><td><code>'Nothing here'</code></td><td>Shown when a pane has no items.</td></tr>
          <tr><td><code>paneHeight</code></td><td><code>number</code></td><td><code>280</code></td><td>Fixed pane height in px.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable all interaction.</td></tr>
        </tbody>
      </Table>

      <h2>TransferItem</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>key</code></td><td><code>string</code></td><td>—</td><td>Unique identifier. Required.</td></tr>
          <tr><td><code>label</code></td><td><code>ReactNode</code></td><td>—</td><td>Row content. Required.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Leading element on the row.</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Item can't be moved (stays on whichever side it starts).</td></tr>
          <tr><td><code>searchText</code></td><td><code>string</code></td><td>—</td><td>Plain-text projection for search; falls back to <code>label</code> when it's a string, else <code>key</code>.</td></tr>
        </tbody>
      </Table>

      <h2>TransferTargetEntry / TransferGroup</h2>
      <Table>
        <thead>
          <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>TransferTargetEntry.key</code></td><td><code>string</code></td><td>—</td><td>Which item this entry refers to.</td></tr>
          <tr><td><code>TransferTargetEntry.group</code></td><td><code>string</code></td><td>—</td><td>Which target group (matches <code>TransferGroup.id</code>) this entry sits in.</td></tr>
          <tr><td><code>TransferGroup.id</code></td><td><code>string</code></td><td>—</td><td>Group identifier.</td></tr>
          <tr><td><code>TransferGroup.label</code></td><td><code>ReactNode</code></td><td>—</td><td>Group heading.</td></tr>
          <tr><td><code>TransferGroup.max</code></td><td><code>number</code></td><td>—</td><td>Cap on entries this group accepts; omit for unlimited.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}
