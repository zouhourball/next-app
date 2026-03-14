'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchForm({ defaultValue }: { defaultValue: string }) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/videos?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3" style={{ maxWidth: '500px' }}>
      <input
        type="text"
        className="form-control"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher des shorts beauté..."
      />
      <button type="submit" className="btn btn-dark">Rechercher</button>
    </form>
  )
}
