import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogLine } from '../..'

const meta: Meta = {
  title: '08 · Layouts/IDE shell',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const railIcons = ['📁', '🔍', '🌿', '🐞', '⚙']
const files = [
  { name: 'src/', isDir: true, depth: 0 },
  { name: 'components/', isDir: true, depth: 1 },
  { name: 'Button.tsx', isDir: false, depth: 2 },
  { name: 'Input.tsx', isDir: false, depth: 2, active: true },
  { name: 'index.ts', isDir: false, depth: 1 },
  { name: 'package.json', isDir: false, depth: 0 },
  { name: 'README.md', isDir: false, depth: 0 },
]

const code = `import { forwardRef, type InputHTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

export const inputStyles = tv({
  base: [
    'w-full border border-line rounded-sm bg-bg-elev text-text',
    'transition-colors duration-[.12s]',
    'focus:border-accent focus:shadow-[var(--shadow-focus)]',
  ],
})

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={inputStyles({ class: className })} {...rest} />
  },
)`

export const Editor: Story = {
  render: () => (
    <div className="grid grid-rows-[1fr_180px] h-[640px] bg-bg">
      <div className="grid grid-cols-[48px_220px_1fr_240px] overflow-hidden border-t border-line">
        {/* rail */}
        <aside className="border-r border-line bg-panel flex flex-col items-center py-2 gap-2 text-lg">
          {railIcons.map((ic, i) => (
            <div
              key={i}
              className={
                i === 0
                  ? 'w-8 h-8 grid place-items-center rounded bg-accent-weak'
                  : 'w-8 h-8 grid place-items-center rounded text-text-dim hover:bg-bg-sunk cursor-pointer'
              }
            >
              {ic}
            </div>
          ))}
        </aside>

        {/* tree */}
        <div className="border-r border-line overflow-auto py-2 text-sm">
          {files.map((f) => (
            <div
              key={f.name}
              className={
                f.active
                  ? 'px-2 py-1 bg-accent-weak text-accent-ink flex items-center gap-1 cursor-pointer'
                  : 'px-2 py-1 hover:bg-bg-sunk flex items-center gap-1 cursor-pointer'
              }
              style={{ paddingLeft: 8 + f.depth * 12 }}
            >
              <span className="w-3 text-text-dim text-xs">{f.isDir ? '▸' : ' '}</span>
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>

        {/* editor */}
        <div className="overflow-hidden flex flex-col">
          <div className="flex items-center border-b border-line text-xs">
            <div className="px-3 py-1.5 bg-bg border-r border-line">Input.tsx</div>
            <div className="px-3 py-1.5 text-text-muted border-r border-line">Button.tsx</div>
          </div>
          <pre className="flex-1 overflow-auto mono p-3 text-[12px] leading-[1.55]">
            {code}
          </pre>
        </div>

        {/* inspector */}
        <aside className="border-l border-line overflow-auto p-3 text-xs">
          <div className="font-semibold mb-2 text-sm">Outline</div>
          <div className="space-y-1 text-text-muted">
            <div>inputStyles</div>
            <div>Input</div>
          </div>
        </aside>
      </div>

      <div className="border-t border-line bg-bg-sunk overflow-auto py-1">
        <LogLine level="info" timestamp="14:22:01" message="vite: ready in 186ms" />
        <LogLine level="info" timestamp="14:22:02" message="hmr update /src/Input.tsx" />
        <LogLine level="ok" timestamp="14:22:04" message="tsc --noEmit · 0 errors" />
      </div>
    </div>
  ),
}
