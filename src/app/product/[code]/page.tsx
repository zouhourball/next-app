import { analyseIngredients } from '@/lib/ingredientAnalysisAPI'
import { getYoutubeVideos } from '@/api'
import { BeautyFactProductType, YoutubeVideoType } from '@/app/types'
import Link from 'next/link'
import ProductAnalysis from '@/components/ProductAnalysis'
import YoutubeCarousel from '@/components/YoutubeCarousel'
import WhereToBuy from '@/components/WhereToBuy'

// ── Fetch product by barcode from Open Beauty Facts ─────────────────────────
async function fetchProduct(code: string): Promise<BeautyFactProductType | null> {
  const urls = [
    `https://fr.openbeautyfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
    `https://world.openbeautyfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) continue
      const data = await res.json()
      if (data.status === 1 && data.product) {
        const p = data.product
        return {
          code: p.code ?? code,
          product_name: p.product_name ?? p.product_name_fr ?? '',
          brands: p.brands ?? '',
          // Prefer the full-size front image for the hero
          image_url: p.image_front_url ?? p.image_url ?? '',
          ingredients_text: p.ingredients_text ?? p.ingredients_text_fr ?? '',
          categories: p.categories ?? '',
          quantity: p.quantity ?? '',
          labels: p.labels ?? '',
        }
      }
    } catch { /* try next URL */ }
  }
  return null
}

// ── Extract product type for YouTube query ───────────────────────────────────
function extractProductType(product: BeautyFactProductType): string {
  const text = `${product.product_name} ${product.categories}`.toLowerCase()
  const types: [RegExp, string][] = [
    [/mascara/i,                          'mascara'],
    [/rouge à lèvres|lipstick|lip gloss/i,'rouge à lèvres'],
    [/fond de teint|foundation/i,         'fond de teint'],
    [/palette|eyeshadow|fard à paupières/i,'palette maquillage'],
    [/blush|fard à joues/i,               'blush'],
    [/highlighter|enlumineur/i,           'highlighter'],
    [/bronzer|bronzant/i,                 'bronzer'],
    [/anticernes|concealer|correcteur/i,  'correcteur'],
    [/eyeliner|eye liner|crayon yeux/i,   'eyeliner'],
    [/crème solaire|sunscreen|spf/i,      'crème solaire'],
    [/sérum|serum/i,                      'sérum'],
    [/shampoo|shampooing/i,               'shampooing'],
    [/parfum|eau de toilette/i,           'parfum'],
    [/vernis|nail/i,                      'vernis ongles'],
    [/déodorant/i,                        'déodorant'],
    [/crème|cream|hydratant/i,            'soin visage'],
  ]
  for (const [re, label] of types) {
    if (re.test(text)) return label
  }
  return 'maquillage'
}

function scoreColor(score: number) {
  if (score >= 80) return '#2d9e5f'
  if (score >= 60) return '#6abf69'
  if (score >= 40) return '#f5a623'
  if (score >= 20) return '#e07b39'
  return '#d0021b'
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductPage({ params }: { params: { code: string } }) {
  const product = await fetchProduct(params.code)

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <h2 className="fw-bold mb-3">Produit non trouvé</h2>
        <p className="text-muted mb-4">Aucun produit ne correspond au code &quot;{params.code}&quot;.</p>
        <Link href="/" className="btn btn-dark px-4" style={{ borderRadius: '10px' }}>
          ← Retour à la recherche
        </Link>
      </div>
    )
  }

  const analysis = product.ingredients_text
    ? await analyseIngredients(product.ingredients_text)
    : null

  const mainBrand = (product.brands ?? '').split(',')[0].trim()
  const productType = extractProductType(product)
  const youtubeQuery = [mainBrand, productType].filter(Boolean).join(' ')

  let videos: YoutubeVideoType[] = []
  try {
    const ytData = await getYoutubeVideos(youtubeQuery, 12)
    videos = ytData.items ?? []
  } catch { /* no videos */ }

  return (
    <div>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
        padding: '32px 0 40px',
      }}>
        <div className="container">
          {/* Back link */}
          <Link href="/" style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '28px',
          }}>
            ← Retour à la recherche
          </Link>

          <div className="d-flex gap-4 align-items-center flex-wrap">
            {/* Product image */}
            <div style={{
              width: 160, height: 160, borderRadius: '18px', background: '#fff',
              flexShrink: 0, overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                />
              ) : (
                <span style={{ fontSize: '4rem' }}>💄</span>
              )}
            </div>

            {/* Product info */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              {product.brands && (
                <div style={{
                  fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px',
                }}>
                  {product.brands}
                </div>
              )}

              <h1 style={{
                fontSize: 'clamp(1.25rem, 3vw, 2rem)', fontWeight: 700,
                margin: '0 0 8px', lineHeight: 1.25, color: '#fff',
              }}>
                {product.product_name || 'Produit sans nom'}
              </h1>

              {product.quantity && (
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginBottom: '16px' }}>
                  {product.quantity}
                </div>
              )}

              {/* Score badge */}
              {analysis && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '14px',
                  background: 'rgba(255,255,255,0.1)', borderRadius: '14px',
                  padding: '10px 18px', backdropFilter: 'blur(4px)',
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: scoreColor(analysis.score),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.15rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                    boxShadow: `0 4px 14px ${scoreColor(analysis.score)}88`,
                  }}>
                    {analysis.score}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700, fontSize: '1rem',
                      color: scoreColor(analysis.score),
                    }}>
                      {analysis.scoreLabel}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                      score de sécurité / 100
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container py-5">
        <div>

          {/* Ingredients + Where to buy — side by side, equal height */}
          <div className="row g-4 mb-5 align-items-stretch">
            {analysis && (
              <div className="col-12 col-lg-6 d-flex flex-column">
                <h4 className="fw-bold mb-4" style={{ fontSize: '1.1rem' }}>
                  🔬 Analyse des ingrédients
                </h4>
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: 480, paddingRight: 4 }}>
                  <ProductAnalysis analysis={analysis} />
                </div>
              </div>
            )}
            <div className={`${analysis ? 'col-12 col-lg-6' : 'col-12'} d-flex flex-column`}>
              <h4 className="fw-bold mb-4" style={{ fontSize: '1.1rem' }}>
                🛒 Où acheter
              </h4>
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: 480, paddingRight: 4 }}>
                <WhereToBuy product={product} />
              </div>
            </div>
          </div>

          {/* YouTube Shorts — full row */}
          {videos.length > 0 && (
            <div>
              <h4 className="fw-bold mb-4" style={{ fontSize: '1.1rem' }}>
                ▶ Shorts YouTube —{' '}
                <span style={{ fontWeight: 400, color: '#888' }}>{youtubeQuery}</span>
              </h4>
              <YoutubeCarousel videos={videos} />
            </div>
          )}

        </div>
      </div>

    </div>
  )
}
