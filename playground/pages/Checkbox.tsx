import { CheckRow, Checkbox, Radio, RadioRow, Switch } from '@stcn52/cloud-ui'
import { PageHeader } from '../Layout'

export function CheckboxPage() {
  return (
    <>
      <PageHeader
        kicker="02 · Primitives"
        title="Checkbox / Radio / Switch"
        lede="Binary and single-select form atoms. All three share a native-input foundation — they're just appearance-none inputs with a precise visual reset."
      />

      <div className="demo">
        <div className="demo-label">Checkbox</div>
        <div className="demo-body">
          <CheckRow label="Unchecked">
            <Checkbox />
          </CheckRow>
          <CheckRow label="Checked">
            <Checkbox defaultChecked />
          </CheckRow>
          <CheckRow label="Indeterminate">
            <Checkbox indeterminate />
          </CheckRow>
          <CheckRow
            label={<span style={{ color: 'var(--text-dim)' }}>Disabled</span>}
          >
            <Checkbox disabled />
          </CheckRow>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Radio</div>
        <div className="demo-body">
          <RadioRow label="Public">
            <Radio name="access" />
          </RadioRow>
          <RadioRow label="Team only">
            <Radio name="access" defaultChecked />
          </RadioRow>
          <RadioRow label="Owner only">
            <Radio name="access" />
          </RadioRow>
          <RadioRow label={<span style={{ color: 'var(--text-dim)' }}>Enterprise</span>}>
            <Radio name="access" disabled />
          </RadioRow>
        </div>
      </div>

      <div className="demo">
        <div className="demo-label">Switch</div>
        <div className="demo-body">
          <CheckRow label="Auto-deploy main">
            <Switch />
          </CheckRow>
          <CheckRow label="Preview deploys">
            <Switch defaultChecked />
          </CheckRow>
          <CheckRow label="2FA required">
            <Switch defaultChecked />
          </CheckRow>
          <CheckRow label={<span style={{ color: 'var(--text-dim)' }}>Audit log (Enterprise)</span>}>
            <Switch disabled />
          </CheckRow>
        </div>
      </div>
    </>
  )
}
