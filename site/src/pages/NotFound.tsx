import { Empty, Button } from '@stcn52/cloud-ui'
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: 80 }}>
      <Empty
        title="Page not found"
        description="The page you requested doesn't exist."
        actions={<Button intent="primary" onClick={() => navigate('/')}>Go home</Button>}
      />
    </div>
  )
}
