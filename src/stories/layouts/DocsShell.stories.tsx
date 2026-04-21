import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: '08 · Layouts/Docs shell',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const toc = [
  { group: 'Getting started', items: ['Install', 'Quick start', 'Theming'] },
  { group: 'Guides', items: ['Theming with CSS variables', 'Custom locale', 'Dark mode', 'SSR'] },
  { group: 'Components', items: ['Button', 'Input', 'Dialog', 'Command palette', 'more…'] },
]

const anchors = [
  'Install',
  'Peer dependencies',
  'First component',
  'ConfigProvider',
  'Next steps',
]

export const ApiReference: Story = {
  render: () => (
    <div className="grid grid-cols-[220px_1fr_200px] min-h-[640px] bg-bg border-t border-line">
      <aside className="border-r border-line bg-panel p-3 overflow-auto">
        {toc.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-1 px-2">
              {g.group}
            </div>
            {g.items.map((it, i) => (
              <div
                key={it}
                className={
                  g.group === 'Getting started' && i === 1
                    ? 'px-2 py-1 rounded-xs text-sm bg-accent-weak text-accent-ink font-medium cursor-pointer'
                    : 'px-2 py-1 rounded-xs text-sm text-text-muted hover:bg-bg-sunk cursor-pointer'
                }
              >
                {it}
              </div>
            ))}
          </div>
        ))}
      </aside>

      <article className="px-8 py-6 overflow-auto">
        <div className="text-xs text-text-dim mono mb-2">Getting started ›</div>
        <h1 className="text-3xl font-semibold tracking-tight">Quick start</h1>
        <p className="text-text-muted mt-2 leading-relaxed max-w-2xl">
          Install cloud-ui, import the stylesheet, and drop components in. All
          tokens are CSS variables — themes and density are controlled from a
          single ConfigProvider.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Install</h2>
        <pre className="bg-bg-sunk border border-line rounded-md p-3 text-[12px] mono">
$ pnpm add @stcn52/cloud-ui
        </pre>

        <h2 className="text-xl font-semibold mt-8 mb-2">Peer dependencies</h2>
        <p className="text-text-muted mt-1 leading-relaxed max-w-2xl">
          React 18 and react-dom. Tailwind is optional — cloud-ui ships a
          prebuilt stylesheet.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">First component</h2>
        <pre className="bg-bg-sunk border border-line rounded-md p-3 text-[12px] mono">
{`import '@stcn52/cloud-ui/styles.css'
import { Button } from '@stcn52/cloud-ui'

export default () => <Button intent="primary">Deploy</Button>`}
        </pre>
      </article>

      <aside className="border-l border-line p-3 text-xs overflow-auto sticky top-0 h-[640px]">
        <div className="text-[10px] uppercase tracking-wider text-text-dim font-semibold mb-2">
          On this page
        </div>
        <div className="space-y-1">
          {anchors.map((a, i) => (
            <div
              key={a}
              className={
                i === 0
                  ? 'text-accent-ink border-l-2 border-accent pl-2'
                  : 'text-text-muted border-l-2 border-transparent pl-2 hover:text-text cursor-pointer'
              }
            >
              {a}
            </div>
          ))}
        </div>
      </aside>
    </div>
  ),
}
