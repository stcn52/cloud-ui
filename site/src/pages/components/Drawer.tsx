import { useState } from 'react'
import {
  Banner,
  Button,
  Drawer,
  DrawerBody,
  DrawerFoot,
  DrawerHead,
  Table,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function DrawerPage() {
  return (
    <article className="page">
      <h1>Drawer</h1>
      <p>
        Side-anchored overlay — slides in from the right or left. Same focus-trap and scroll-lock
        as <code>Dialog</code>, but keeps the rest of the page visible underneath.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Row details, inline editors, filter panels — anything where the user might want to glance
        back at the table behind it. For blocking confirmation, use <code>Dialog</code>.
      </Banner>

      <h2>Right side (default)</h2>
      <RightDemo />

      <h2>Left side</h2>
      <LeftDemo />

      <h2>No backdrop</h2>
      <p>
        Pass <code>backdrop={'{false}'}</code> for a non-blocking panel. You still get scroll lock
        and focus trap.
      </p>
      <NoBackdropDemo />

      <h2>Drawer API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Required.</td></tr>
          <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on Escape or backdrop click.</td></tr>
          <tr><td><code>side</code></td><td><code>'left' | 'right'</code></td><td><code>'right'</code></td><td>Anchor edge.</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Set false to require an explicit action.</td></tr>
          <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Set false to disable click-outside.</td></tr>
          <tr><td><code>backdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Render the dimmed backdrop layer.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Usually <code>DrawerHead</code> + <code>DrawerBody</code> + <code>DrawerFoot</code>.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}

function RightDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer open={open} onClose={() => setOpen(false)}>
  <DrawerHead>
    <strong>api-gateway</strong>
  </DrawerHead>
  <DrawerBody>Any content you want.</DrawerBody>
  <DrawerFoot>
    <Button intent="ghost" onClick={() => setOpen(false)}>Close</Button>
  </DrawerFoot>
</Drawer>`}
    >
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHead>
          <strong>api-gateway</strong>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-muted)' }}>
            v143 · us-east-1
          </span>
        </DrawerHead>
        <DrawerBody>
          Scroll is locked behind the panel. Press <kbd>Esc</kbd> or click the backdrop to close.
        </DrawerBody>
        <DrawerFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Close</Button>
          <Button intent="primary" onClick={() => setOpen(false)}>Save</Button>
        </DrawerFoot>
      </Drawer>
    </Demo>
  )
}

function LeftDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`<Drawer open={open} side="left" onClose={() => setOpen(false)}>
  <DrawerHead>Navigation</DrawerHead>
  <DrawerBody>Pretend this is a nav tree.</DrawerBody>
</Drawer>`}
    >
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open from left
      </Button>
      <Drawer open={open} side="left" onClose={() => setOpen(false)}>
        <DrawerHead>Navigation</DrawerHead>
        <DrawerBody>Pretend this is a nav tree.</DrawerBody>
        <DrawerFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Close</Button>
        </DrawerFoot>
      </Drawer>
    </Demo>
  )
}

function NoBackdropDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`<Drawer
  open={open}
  backdrop={false}
  closeOnBackdrop={false}
  onClose={() => setOpen(false)}
>
  <DrawerHead>Filters</DrawerHead>
  <DrawerBody>No dimmed overlay behind.</DrawerBody>
</Drawer>`}
    >
      <Button intent="subtle" onClick={() => setOpen(true)}>
        Open without backdrop
      </Button>
      <Drawer
        open={open}
        backdrop={false}
        closeOnBackdrop={false}
        onClose={() => setOpen(false)}
      >
        <DrawerHead>Filters</DrawerHead>
        <DrawerBody>No dimmed overlay behind. Use the Close button or Esc.</DrawerBody>
        <DrawerFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Close</Button>
        </DrawerFoot>
      </Drawer>
    </Demo>
  )
}
