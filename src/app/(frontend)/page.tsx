import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from './RenderBlocks'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 2,
    limit: 1,
  })

  const page = docs[0]

  if (!page) {
    return (
      <main id="main" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Served</h1>
        <p>No home page content yet. Visit <a href="/admin">/admin</a> to create content.</p>
      </main>
    )
  }

  return (
    <main id="main">
      <RenderBlocks blocks={(page.layout as any[]) ?? []} />
    </main>
  )
}
