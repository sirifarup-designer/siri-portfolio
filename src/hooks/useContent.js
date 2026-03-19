import { useState, useEffect } from 'react'

export function useContent() {
  const [data, setData]     = useState(null)
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('content.json')
      .then(r => { if (!r.ok) throw new Error('Failed to load content.json'); return r.json() })
      .then(json => { setData(json); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return { data, error, loading }
}
