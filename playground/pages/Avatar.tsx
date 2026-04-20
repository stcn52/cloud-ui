import { Avatar, AvatarStack } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function AvatarPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Avatar"
        lede="User or entity glyph. Initials by default; gradient fill by default. Stack for compact group representation."
      />

      <div className="demo">
        <div className="demo-label">Shapes, sizes, stack</div>
        <div className="demo-body">
          <Avatar size="sm">MC</Avatar>
          <Avatar>JP</Avatar>
          <Avatar size="lg">AP</Avatar>
          <Avatar shape="square">JK</Avatar>
          <AvatarStack>
            <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 40), oklch(0.55 0.12 10))' }}>
              MC
            </Avatar>
            <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 180), oklch(0.55 0.12 210))' }}>
              TW
            </Avatar>
            <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 280), oklch(0.55 0.12 310))' }}>
              AP
            </Avatar>
            <Avatar style={{ background: 'linear-gradient(135deg, oklch(0.78 0.08 120), oklch(0.55 0.12 150))' }}>
              JK
            </Avatar>
            <Avatar
              style={{
                background: 'var(--bg-sunk)',
                color: 'var(--text-muted)',
                border: '1px solid var(--line)',
              }}
            >
              +3
            </Avatar>
          </AvatarStack>
        </div>
      </div>
    </>
  )
}
