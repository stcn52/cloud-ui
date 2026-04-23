import { Banner } from '@stcn52/cloud-ui'

export default function TODOPage({ name }: { name: string }) {
  return (
    <article className="page">
      <h1>{name}</h1>
      <Banner tone="warn" title="Docs in progress">
        This page is being written. See the{' '}
        <a href={`${import.meta.env.BASE_URL}storybook/`}>Storybook</a> for the live component in the meantime.
      </Banner>
    </article>
  )
}
