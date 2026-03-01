'use client'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Something went wrong</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        {error.message}
      </pre>
    </div>
  )
}
