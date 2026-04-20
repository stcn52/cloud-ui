import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Field, Input } from '../Input'
import { Dialog, DialogBody, DialogFoot, DialogHead } from './index'

const meta = {
  title: '05 · Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const DestructiveConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState('')
    return (
      <>
        <Button intent="danger" onClick={() => setOpen(true)}>Delete service…</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHead
            danger
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M6 6l1 14h10l1-14" />
              </svg>
            }
            title={<>Delete <span className="mono">api-gateway</span>?</>}
            description="This will tear down 12 running instances, delete the latest 142 deployments, and revoke 4 API keys. This cannot be undone."
          />
          <DialogBody>
            <Field label="Type the service name to confirm">
              <Input mono placeholder="api-gateway" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
          </DialogBody>
          <DialogFoot>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              intent="danger"
              disabled={confirm !== 'api-gateway'}
              onClick={() => { setOpen(false); setConfirm('') }}
            >
              Delete service
            </Button>
          </DialogFoot>
        </Dialog>
      </>
    )
  },
}
