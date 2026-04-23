import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardTab, CardTabs } from './CardTabs'

const meta = {
  title: '04 · Navigation/CardTabs',
  component: CardTabs,
  tags: ['autodocs'],
  args: { value: 'b', onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Chrome-style tabs. Active tab blends with the content panel below. Use when each tab owns a full panel (file browser, document editor). For in-page section tabs prefer `<Tabs>` / `<Tab>` (underline style).',
      },
    },
  },
} satisfies Meta<typeof CardTabs>

export default meta
type Story = StoryObj<typeof meta>

const folderIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0c14b">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
)

export const Basic: Story = {
  render: () => {
    const [active, setActive] = useState('b')
    return (
      <div>
        <CardTabs value={active} onChange={setActive}>
          <CardTab id="a">Overview</CardTab>
          <CardTab id="b">Deployments</CardTab>
          <CardTab id="c">Logs</CardTab>
        </CardTabs>
        <div className="border border-line border-t-0 bg-bg-elev p-4 rounded-b-md">
          Panel for <span className="mono">{active}</span>
        </div>
      </div>
    )
  },
}

export const FileBrowser: Story = {
  render: () => {
    const [tabs, setTabs] = useState([
      { id: 'a', label: 'install' },
      { id: 'b', label: 'install' },
      { id: 'c', label: 'install' },
    ])
    const [active, setActive] = useState('c')
    const close = (id: string) =>
      setTabs((ts) => {
        const next = ts.filter((t) => t.id !== id)
        if (active === id && next.length) setActive(next[next.length - 1].id)
        return next
      })
    return (
      <div className="bg-bg-sunk pt-2 px-3">
        <CardTabs value={active} onChange={setActive}>
          {tabs.map((t) => (
            <CardTab
              key={t.id}
              id={t.id}
              closable
              icon={folderIcon}
              onClose={() => close(t.id)}
            >
              {t.label}
            </CardTab>
          ))}
          <button
            type="button"
            className="inline-grid place-items-center w-6 h-6 text-text-dim hover:text-text hover:bg-bg-elev rounded"
            onClick={() =>
              setTabs((ts) => [...ts, { id: String(Math.random()), label: 'install' }])
            }
          >
            +
          </button>
        </CardTabs>
        <div className="bg-bg-elev border border-line border-t-0 p-6 h-40">
          Content for <span className="mono">{active}</span>
        </div>
      </div>
    )
  },
}
