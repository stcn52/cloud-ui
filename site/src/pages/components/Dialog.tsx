import { useState } from 'react'
import {
  Banner,
  Button,
  Dialog,
  DialogBody,
  DialogFoot,
  DialogHead,
  Table,
  toast,
} from '@stcn52/cloud-ui'
import { Demo } from '../../components/Demo'

export default function DialogPage() {
  return (
    <article className="page">
      <h1>Dialog</h1>
      <p>
        Modal overlay for content and confirmation flows. Traps focus, locks scroll, closes on
        Escape and backdrop click. Compose with <code>DialogHead</code>, <code>DialogBody</code>,
        and <code>DialogFoot</code>.
      </p>

      <Banner tone="neutral" title="When to use" style={{ margin: '16px 0' }}>
        Anything that blocks the rest of the UI until the user responds — destructive confirmation,
        short forms, prompts. For non-blocking side panels, use <code>Drawer</code>. For transient
        feedback, use <code>Toast</code>.
      </Banner>

      <h2>Basic</h2>
      <BasicDemo />

      <h2>With actions</h2>
      <p>
        Drop a <code>DialogFoot</code> at the bottom for the primary/secondary action pair.
      </p>
      <ActionsDemo />

      <h2>Destructive confirm</h2>
      <p>
        Pass <code>danger</code> to <code>DialogHead</code> to tint the icon red and use a{' '}
        <code>danger</code> button in the footer.
      </p>
      <ConfirmDemo />

      <h2>Dialog API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Required.</td></tr>
          <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on Escape or backdrop click.</td></tr>
          <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Set false to require an explicit action.</td></tr>
          <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Set false to disable click-outside.</td></tr>
          <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Usually <code>DialogHead</code> + <code>DialogBody</code> + <code>DialogFoot</code>.</td></tr>
        </tbody>
      </Table>

      <h2>DialogHead API</h2>
      <Table>
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>Heading line.</td></tr>
          <tr><td><code>description</code></td><td><code>ReactNode</code></td><td>—</td><td>Muted second line.</td></tr>
          <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered in a rounded square at the start.</td></tr>
          <tr><td><code>danger</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Tints the icon square red.</td></tr>
        </tbody>
      </Table>
    </article>
  )
}

function BasicDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open</Button>

<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogHead title="Hello" description="A plain modal." />
  <DialogBody>Anything goes here.</DialogBody>
</Dialog>`}
    >
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHead title="Hello" description="A plain modal." />
        <DialogBody>
          Focus is trapped inside while open. Press <kbd>Esc</kbd> or click the backdrop to close.
        </DialogBody>
      </Dialog>
    </Demo>
  )
}

function ActionsDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogHead
    title="Invite teammate"
    description="They'll get an email with a signup link."
  />
  <DialogBody>Pretend this is a form.</DialogBody>
  <DialogFoot>
    <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button intent="primary" onClick={() => setOpen(false)}>Send invite</Button>
  </DialogFoot>
</Dialog>`}
    >
      <Button intent="primary" onClick={() => setOpen(true)}>
        Invite teammate
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHead title="Invite teammate" description="They'll get an email with a signup link." />
        <DialogBody>Pretend this is a form with a name + email input.</DialogBody>
        <DialogFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            intent="primary"
            onClick={() => {
              setOpen(false)
              toast.success('Invite sent')
            }}
          >
            Send invite
          </Button>
        </DialogFoot>
      </Dialog>
    </Demo>
  )
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Demo
      code={`<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogHead
    danger
    icon={<span>!</span>}
    title="Delete api-gateway?"
    description="This removes the service and all 42 environments. Cannot be undone."
  />
  <DialogFoot>
    <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button intent="danger" onClick={() => setOpen(false)}>Delete</Button>
  </DialogFoot>
</Dialog>`}
    >
      <Button intent="danger" onClick={() => setOpen(true)}>
        Delete api-gateway
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHead
          danger
          icon={<span style={{ fontWeight: 700 }}>!</span>}
          title="Delete api-gateway?"
          description="This removes the service and all 42 environments. Cannot be undone."
        />
        <DialogFoot>
          <Button intent="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            intent="danger"
            onClick={() => {
              setOpen(false)
              toast.error('api-gateway deleted')
            }}
          >
            Delete
          </Button>
        </DialogFoot>
      </Dialog>
    </Demo>
  )
}
