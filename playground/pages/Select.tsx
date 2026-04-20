import { Field, Select, Textarea } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function SelectPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Select & Textarea"
        lede="Native select for small option sets; vertically resizable textarea for free-form input. Use Combobox (advanced) for searchable/large sets."
      />

      <div className="demo">
        <div className="demo-label">Native select & textarea</div>
        <div
          className="demo-body"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}
        >
          <Field label="Region">
            <Select defaultValue="us-east-1">
              <option value="us-east-1">us-east-1 (N. Virginia)</option>
              <option value="us-west-2">us-west-2 (Oregon)</option>
              <option value="eu-west-1">eu-west-1 (Ireland)</option>
            </Select>
          </Field>
          <Field label="Plan">
            <Select defaultValue="starter">
              <option value="starter">Starter · $7 /mo</option>
              <option value="pro-2x">Pro 2× · $24 /mo</option>
              <option value="pro-4x">Pro 4× · $48 /mo</option>
            </Select>
          </Field>
          <Field label="Notes">
            <Textarea placeholder="Migration runbook…" />
          </Field>
        </div>
      </div>
    </>
  )
}
