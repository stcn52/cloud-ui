import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Card, Pill, Segmented } from '../..'
import { useState } from 'react'

const meta: Meta = {
  title: '07 · Compositions/Plan picker',
  parameters: {
    docs: {
      description: {
        component: 'Three-tier with a featured middle plan. Billing toggle on top.',
      },
    },
  },
}
export default meta
type Story = StoryObj

interface Plan {
  name: string
  price: number
  priceSuffix: string
  desc: string
  features: string[]
  cta: string
  featured?: boolean
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: 0,
    priceSuffix: '/mo',
    desc: 'For solo devs & side projects.',
    features: ['1 workspace', '2 services', '100 GB bandwidth', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Pro',
    price: 29,
    priceSuffix: '/mo · per seat',
    desc: 'For teams shipping production workloads.',
    features: ['Unlimited services', 'Preview envs per PR', 'Audit logs', 'Email support'],
    cta: 'Upgrade',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 0,
    priceSuffix: 'custom',
    desc: 'For regulated orgs at scale.',
    features: ['SSO & SAML', 'SOC 2 report', 'Dedicated support', 'Custom contracts'],
    cta: 'Contact sales',
  },
]

const check = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const ThreeTiers: Story = {
  render: () => {
    const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
    return (
      <div className="flex flex-col items-center gap-4" style={{ width: 900 }}>
        <Segmented
          value={cycle}
          onChange={setCycle}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: <>Yearly <span className="text-accent-ink ml-1">−20%</span></> },
          ]}
        />
        <div className="grid grid-cols-3 gap-3 w-full">
          {plans.map((p) => (
            <Card
              key={p.name}
              style={p.featured ? { borderColor: 'var(--color-accent)', boxShadow: 'var(--shadow-md)' } : undefined}
            >
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{p.name}</div>
                  {p.featured && <Pill tone="info">Most popular</Pill>}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="mono text-3xl font-semibold tracking-tight">
                    {p.price === 0 && p.priceSuffix === 'custom' ? '—' : `$${p.price}`}
                  </span>
                  <span className="text-xs text-text-dim">{p.priceSuffix}</span>
                </div>
                <div className="text-sm text-text-muted mt-1">{p.desc}</div>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">{check}</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Button
                    intent={p.featured ? 'primary' : 'default'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {p.cta}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  },
}
