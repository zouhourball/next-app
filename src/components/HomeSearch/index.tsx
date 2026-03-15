'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { BeautyFactProductType } from '@/app/types'
import { IngredientAnalysis, analyseIngredients } from '@/lib/ingredientAnalysis'

const BarcodeScanner = lazy(() => import('@/components/BarcodeScanner'))
const ScanResult = lazy(() => import('@/components/ScanResult'))

function scoreColor(score: number): string {
  if (score >= 80) return '#2d9e5f'
  if (score >= 60) return '#6abf69'
  if (score >= 40) return '#f5a623'
  if (score >= 20) return '#e07b39'
  return '#d0021b'
}

function MiniScore({ score }: { score: number }) {
  return (
    <div style={{
      position: 'absolute',
      top: 8,
      right: 8,
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: scoreColor(score),
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 700,
      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
    }}>
      {score}
    </div>
  )
}

export default function HomeSearch() {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [results, setResults] = useState<BeautyFactProductType[]>([])
  const [normalizedQuery, setNormalizedQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProduct, setScanProduct] = useState<BeautyFactProductType | null>(null)
  const [scanAnalysis, setScanAnalysis] = useState<IngredientAnalysis | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setTags([])
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const [tagsRes, productsRes] = await Promise.all([
          fetch('/api/suggest-tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ term: query.trim() }),
          }),
          fetch(`/api/search-products?q=${encodeURIComponent(query.trim())}`),
        ])
        const tagsData = await tagsRes.json()
        const productsData = await productsRes.json()
        setTags(tagsData.tags ?? [])
        setResults(productsData.products ?? [])
        setNormalizedQuery(productsData.normalizedQuery ?? query.trim())
      } catch {
        setTags([])
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/beauty-facts?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleTagClick = (tag: string) => {
    const combined = query.trim() ? `${query.trim()} ${tag}` : tag
    setQuery(combined)
  }

  const handleScan = async (barcode: string) => {
    setScanning(false)
    setScanProduct(null)
    setScanAnalysis(null)
    setScanError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/scan-barcode?code=${encodeURIComponent(barcode)}`)
      const data = await res.json()
      if (!res.ok || !data.product) {
        setScanError('Produit non trouvé pour ce code-barres.')
      } else {
        setScanProduct(data.product)
        setScanAnalysis(data.analysis ?? null)
      }
    } catch {
      setScanError('Erreur lors de la recherche du produit.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: BeautyFactProductType) => {
    const analysis = product.ingredients_text
      ? analyseIngredients(product.ingredients_text)
      : null
    setScanProduct(product)
    setScanAnalysis(analysis)
  }

  return (
    <div className="container py-5">

      {/* Hero */}
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2.4rem' }}>
          Votre blog beauté français
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Recherchez un produit, une marque ou un ingrédient
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSubmit}
        className="d-flex gap-2 mx-auto"
        style={{ maxWidth: '640px' }}
      >
        <div className="position-relative flex-grow-1">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm pe-5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : mascara, rouge à lèvres, fond de teint..."
            style={{ borderRadius: '12px', fontSize: '1.1rem' }}
            autoFocus
          />
          <button
            type="button"
            onClick={() => { setScanProduct(null); setScanAnalysis(null); setScanError(null); setScanning(true) }}
            title="Scanner un code-barres"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#6c757d',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6A.5.5 0 0 1 3 8z"/>
            </svg>
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-dark btn-lg px-4"
          style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}
        >
          Voir tout
        </button>
      </form>

      {/* Tags */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mt-3" style={{ minHeight: '40px' }}>
        {loading && (
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>
            Recherche en cours...
          </span>
        )}
        {!loading && tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="badge rounded-pill text-bg-light border"
            style={{ fontSize: '0.88rem', padding: '7px 14px', cursor: 'pointer', fontWeight: 400 }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Scan error */}
      {scanError && (
        <p className="text-center text-danger mt-4">{scanError}</p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="mt-5">
          <h5 className="mb-4 text-muted">
            Résultats pour <strong className="text-dark">&quot;{normalizedQuery}&quot;</strong>
            {normalizedQuery.toLowerCase() !== query.trim().toLowerCase() && (
              <span className="ms-2 text-secondary" style={{ fontSize: '0.8rem' }}>
                (corrigé depuis &quot;{query.trim()}&quot;)
              </span>
            )}
            <span className="ms-2" style={{ fontSize: '0.85rem' }}>· {results.length} produits</span>
          </h5>
          <div className="row g-4">
            {results.map((product, i) => {
              const analysis = product.ingredients_text
                ? analyseIngredients(product.ingredients_text)
                : null
              return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
                  <div
                    className="card h-100"
                    onClick={() => handleProductClick(product)}
                    style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
                  >
                    <div style={{ position: 'relative' }}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="card-img-top"
                          style={{ height: '180px', objectFit: 'contain', padding: '8px' }}
                        />
                      ) : (
                        <div
                          className="card-img-top bg-light d-flex align-items-center justify-content-center"
                          style={{ height: '180px' }}
                        >
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>Pas d&apos;image</span>
                        </div>
                      )}
                      {analysis && <MiniScore score={analysis.score} />}
                    </div>
                    <div className="card-body">
                      <h6 className="card-title">{product.product_name}</h6>
                      {product.brands && (
                        <p className="text-muted mb-1" style={{ fontSize: '0.82rem' }}>
                          {product.brands}
                        </p>
                      )}
                      {product.quantity && (
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>{product.quantity}</p>
                      )}
                      {analysis && (
                        <div className="mt-2 d-flex gap-1 flex-wrap">
                          {analysis.bad.length > 0 && (
                            <span style={{ fontSize: '0.72rem', color: '#d0021b' }}>
                              🔴 {analysis.bad.length} à éviter
                            </span>
                          )}
                          {analysis.moderate.length > 0 && (
                            <span style={{ fontSize: '0.72rem', color: '#e07b39' }}>
                              🟡 {analysis.moderate.length} modérés
                            </span>
                          )}
                          {analysis.good.length > 0 && (
                            <span style={{ fontSize: '0.72rem', color: '#2d9e5f' }}>
                              🟢 {analysis.good.length} bénéfiques
                            </span>
                          )}
                        </div>
                      )}
                      {!analysis && product.ingredients_text && (
                        <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.72rem' }}>
                          {product.ingredients_text.slice(0, 80)}...
                        </p>
                      )}
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-3">
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        Cliquez pour l&apos;analyse complète →
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !scanProduct && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-center text-muted mt-5">
          Aucun produit trouvé pour &quot;{query}&quot;.
        </p>
      )}

      {/* Barcode scanner overlay */}
      {scanning && (
        <Suspense fallback={null}>
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setScanning(false)}
          />
        </Suspense>
      )}

      {/* Product detail modal (scan OR card click) */}
      {scanProduct && (
        <Suspense fallback={null}>
          <ScanResult
            product={scanProduct}
            analysis={scanAnalysis}
            onClose={() => { setScanProduct(null); setScanAnalysis(null) }}
          />
        </Suspense>
      )}

    </div>
  )
}
