import { useEffect, useState } from 'react'

type Health = { ok: boolean }

function App() {
  const [status, setStatus] = useState('checking…')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json() as Promise<Health>)
      .then((data) => setStatus(data.ok ? 'ok' : 'unhealthy'))
      .catch(() => setStatus('unreachable'))
  }, [])

  return (
    <main>
      <h1>anonreport</h1>
      <p>Worker status: {status}</p>
    </main>
  )
}

export default App
