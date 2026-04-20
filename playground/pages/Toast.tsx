import { useState } from 'react'
import { Button, Toast, ToastStack } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

interface Item {
  id: number
  tone: 'neutral' | 'ok' | 'err'
  msg: string
}

export function ToastPage() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, tone: 'ok', msg: 'Deployed api-gateway@v143' },
    { id: 2, tone: 'neutral', msg: 'API key ak_••••71 copied' },
    { id: 3, tone: 'err', msg: 'Build failed: test suite · 3 errors' },
  ])
  let nextId = items.reduce((m, i) => Math.max(m, i.id), 0) + 1

  const push = (tone: Item['tone'], msg: string) => {
    const id = nextId++
    setItems((arr) => [...arr, { id, tone, msg }])
    setTimeout(() => setItems((arr) => arr.filter((i) => i.id !== id)), 4000)
  }
  const remove = (id: number) => setItems((arr) => arr.filter((i) => i.id !== id))

  return (
    <>
      <PageHeader
        kicker="05 · Overlays"
        title="Toast"
        lede="Ephemeral feedback for actions that succeeded or failed. Auto-dismiss; optionally lets the user undo. Stacks in a fixed corner."
      />

      <div className="demo">
        <div className="demo-label">Trigger</div>
        <div className="demo-body">
          <Button onClick={() => push('ok', 'Deployed api-gateway@v' + (143 + items.length))}>Success</Button>
          <Button onClick={() => push('neutral', 'Copied ak_••••71')}>Neutral</Button>
          <Button intent="danger" onClick={() => push('err', 'Build failed: 3 errors')}>
            Failure
          </Button>
        </div>
      </div>

      <ToastStack>
        {items.map((i) => (
          <Toast key={i.id} tone={i.tone} onClose={() => remove(i.id)}>
            {i.msg}
          </Toast>
        ))}
      </ToastStack>
    </>
  )
}
