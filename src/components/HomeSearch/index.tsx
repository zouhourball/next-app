'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { BeautyFactProductType } from '@/app/types'
import { analyseIngredients } from '@/lib/ingredientAnalysis'
import ProductPlaceholder from '@/components/ProductPlaceholder'

const BarcodeScanner = lazy(() => import('@/components/BarcodeScanner'))
const ShopDialog     = lazy(() => import('@/components/ShopDialog'))

// ── Score badge ────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return '#2d9e5f'
  if (score >= 60) return '#6abf69'
  if (score >= 40) return '#f5a623'
  if (score >= 20) return '#e07b39'
  return '#d0021b'
}
function MiniScore({ score }: { score: number }) {
  return (
    <div style={{
      position: 'absolute', top: 8, right: 8,
      width: 36, height: 36, borderRadius: '50%',
      background: scoreColor(score), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.75rem', fontWeight: 700,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    }}>{score}</div>
  )
}

// ── Label icon chips ───────────────────────────────────────────────────────────
const LABEL_MAP: { match: RegExp; icon: string; label: string; color: string }[] = [
  { match: /vegan|végétalien/i,           icon: '🌱', label: 'Vegan',          color: '#2e7d32' },
  { match: /bio|organic/i,                icon: '🌿', label: 'Bio',            color: '#388e3c' },
  { match: /cruelty.free|sans cruauté/i,  icon: '🐰', label: 'Cruelty-free',   color: '#c2185b' },
  { match: /natural|naturel/i,            icon: '✨', label: 'Naturel',        color: '#00796b' },
  { match: /sulfate.free|sans sulfate/i,  icon: '💧', label: 'Sans sulfate',   color: '#0277bd' },
  { match: /paraben.free|sans paraben/i,  icon: '🚫', label: 'Sans paraben',   color: '#e65100' },
  { match: /gluten.free|sans gluten/i,    icon: '🌾', label: 'Sans gluten',    color: '#f57f17' },
  { match: /fair.trade|commerce équit/i,  icon: '🤝', label: 'Éco-responsable',color: '#4e342e' },
  { match: /recycl/i,                     icon: '♻️', label: 'Recyclable',     color: '#1b5e20' },
]

function LabelChips({ labels }: { labels?: string }) {
  if (!labels) return null
  const matched = LABEL_MAP.filter(l => l.match.test(labels))
  if (!matched.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
      {matched.map(l => (
        <span key={l.label} style={{
          fontSize: '0.65rem', fontWeight: 600,
          color: l.color, background: `${l.color}18`,
          border: `1px solid ${l.color}40`,
          borderRadius: '10px', padding: '2px 7px',
        }}>
          {l.icon} {l.label}
        </span>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HomeSearch() {
  const [query, setQuery]         = useState('')
  const [tags, setTags]           = useState<string[]>([])
  const [results, setResults]     = useState<BeautyFactProductType[]>([])
  const [normalizedQuery, setNorm]= useState('')
  const [loading, setLoading]     = useState(false)
  const [scanning, setScanning]   = useState(false)
  const [shopProduct, setShopProduct] = useState<BeautyFactProductType | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setTags([]); setResults([]); return }

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
        const tagsData     = await tagsRes.json()
        const productsData = await productsRes.json()
        setTags(tagsData.tags ?? [])
        setResults(productsData.products ?? [])
        setNorm(productsData.normalizedQuery ?? query.trim())
      } catch {
        setTags([]); setResults([])
      } finally {
        setLoading(false)
      }
    }, 600)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/beauty-facts?q=${encodeURIComponent(query.trim())}`)
  }

  const handleTagClick = (tag: string) => {
    setQuery(q => q.trim() ? `${q.trim()} ${tag}` : tag)
  }

  // Barcode scan → navigate directly to product page
  const handleScan = (barcode: string) => {
    setScanning(false)
    router.push(`/product/${barcode}`)
  }

  return (
    <div className="container py-5">

      {/* Hero */}
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2.4rem' }}>Votre blog beauté français</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Recherchez un produit, une marque ou un ingrédient
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="d-flex gap-2 mx-auto" style={{ maxWidth: '640px' }}>
        <div className="position-relative flex-grow-1">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm pe-5"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex : mascara, rouge à lèvres, fond de teint..."
            style={{ borderRadius: '12px', fontSize: '1.1rem' }}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setScanning(true)}
            title="Scanner un code-barres"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6c757d' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6A.5.5 0 0 1 3 8z"/>
            </svg>
          </button>
        </div>
        <button type="submit" className="btn btn-dark btn-lg px-4" style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>
          Voir tout
        </button>
      </form>

      {/* Tags */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mt-3" style={{ minHeight: '40px' }}>
        {loading && <span className="text-muted" style={{ fontSize: '0.9rem' }}>Recherche en cours...</span>}
        {!loading && tags.map(tag => (
          <button key={tag} onClick={() => handleTagClick(tag)}
            className="badge rounded-pill text-bg-light border"
            style={{ fontSize: '0.88rem', padding: '7px 14px', cursor: 'pointer', fontWeight: 400 }}>
            {tag}
          </button>
        ))}
      </div>

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
              const analysis = product.ingredients_text ? analyseIngredients(product.ingredients_text) : null
              return (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={i}>
                  <div
                    className="card h-100 product-card"
                    onClick={() => router.push(`/product/${product.code}`)}
                  >
                    {/* Image or cartoon placeholder */}
                    <div style={{ position: 'relative' }}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.product_name}
                          className="card-img-top"
                          style={{ height: '180px', objectFit: 'contain', padding: '8px' }}
                        />
                      ) : (
                        <ProductPlaceholder product={product} height={180} />
                      )}
                      {analysis && <MiniScore score={analysis.score} />}
                    </div>

                    <div className="card-body">
                      <h6 className="card-title" style={{ fontSize: '0.88rem' }}>{product.product_name}</h6>
                      {product.brands && (
                        <p className="text-muted mb-1" style={{ fontSize: '0.78rem' }}>{product.brands}</p>
                      )}
                      {product.quantity && (
                        <p className="mb-0" style={{ fontSize: '0.75rem' }}>{product.quantity}</p>
                      )}

                      {/* Eco/label chips */}
                      <LabelChips labels={product.labels} />

                      {/* Mini ingredient summary */}
                      {analysis && (
                        <div className="mt-2 d-flex gap-2 flex-wrap">
                          {analysis.bad.length > 0 && (
                            <span style={{ fontSize: '0.68rem', color: '#d0021b' }}>🔴 {analysis.bad.length} à éviter</span>
                          )}
                          {analysis.moderate.length > 0 && (
                            <span style={{ fontSize: '0.68rem', color: '#e07b39' }}>🟡 {analysis.moderate.length} modérés</span>
                          )}
                          {analysis.good.length > 0 && (
                            <span style={{ fontSize: '0.68rem', color: '#2d9e5f' }}>🟢 {analysis.good.length} bénéfiques</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer actions */}
                    <div className="card-footer bg-transparent border-top-0 pb-3 pt-0 d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary flex-grow-1"
                        style={{ fontSize: '0.72rem', borderRadius: '8px' }}
                        onClick={e => { e.stopPropagation(); router.push(`/product/${product.code}`) }}
                      >
                        🔬 Analyse
                      </button>
                      <button
                        className="btn btn-sm btn-dark flex-grow-1"
                        style={{ fontSize: '0.72rem', borderRadius: '8px' }}
                        onClick={e => { e.stopPropagation(); setShopProduct(product) }}
                      >
                        🛒 Acheter
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <p className="text-center text-muted mt-5">Aucun produit trouvé pour &quot;{query}&quot;.</p>
      )}

      {/* Barcode scanner overlay */}
      {scanning && (
        <Suspense fallback={null}>
          <BarcodeScanner onScan={handleScan} onClose={() => setScanning(false)} />
        </Suspense>
      )}

      {/* Shop dialog */}
      {shopProduct && (
        <Suspense fallback={null}>
          <ShopDialog product={shopProduct} onClose={() => setShopProduct(null)} />
        </Suspense>
      )}

    </div>
  )
}
