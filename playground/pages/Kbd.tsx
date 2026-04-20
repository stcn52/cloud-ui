import { Kbd } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function KbdPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Keyboard"
        lede="Inline keyboard shortcut markers. Use sparingly — typically in command palettes, tooltips, and help docs."
      />

      <div className="demo">
        <div className="demo-label">Keys</div>
        <div className="demo-body">
          <span className="row" style={{ gap: 4, fontSize: 'var(--fs-sm)' }}>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> open palette
          </span>
          <span className="row" style={{ gap: 4, fontSize: 'var(--fs-sm)' }}>
            <Kbd>⇧</Kbd>
            <Kbd>/</Kbd> shortcuts
          </span>
          <span className="row" style={{ gap: 4, fontSize: 'var(--fs-sm)' }}>
            <Kbd>G</Kbd> then <Kbd>D</Kbd> go to deployments
          </span>
          <span className="row" style={{ gap: 4, fontSize: 'var(--fs-sm)' }}>
            <Kbd>↵</Kbd> confirm
          </span>
          <span className="row" style={{ gap: 4, fontSize: 'var(--fs-sm)' }}>
            <Kbd>Esc</Kbd> dismiss
          </span>
        </div>
      </div>
    </>
  )
}
