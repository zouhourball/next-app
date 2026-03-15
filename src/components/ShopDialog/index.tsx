'use client'

import { BeautyFactProductType } from '@/app/types'

interface ShopDialogProps {
  product: BeautyFactProductType
  onClose: () => void
}

interface Retailer {
  name: string
  flag: string
  color: string
  url: (q: string) => string
  tag: string
}

// ── Extract product type (mascara, fond de teint, etc.) ─────────────────────
function extractProductType(product: BeautyFactProductType): string {
  const text = `${product.product_name ?? ''} ${product.categories ?? ''}`.toLowerCase()
  const types: [RegExp, string][] = [
    [/mascara/i,                                  'mascara'],
    [/rouge à lèvres|lipstick|lip gloss|lipgloss/i, 'rouge à lèvres'],
    [/fond de teint|foundation/i,                 'fond de teint'],
    [/highlighter|enlumineur|illuminateur/i,       'highlighter'],
    [/blush|fard à joues/i,                       'blush'],
    [/bronzer|bronzant|terre de soleil/i,          'bronzer'],
    [/palette|fard à paupières|eyeshadow/i,        'palette maquillage'],
    [/anticernes|correcteur|concealer/i,           'correcteur'],
    [/crayon (yeux|lèvres)|eyeliner|eye liner/i,   'eyeliner'],
    [/crème solaire|sunscreen|écran solaire|spf/i, 'crème solaire'],
    [/autobronzant|self.?tan/i,                   'autobronzant'],
    [/shampooing|shampoo/i,                       'shampooing'],
    [/après.shampoo|conditioner/i,                'après-shampooing'],
    [/masque cheveux|hair mask/i,                  'masque cheveux'],
    [/sérum|serum/i,                              'sérum'],
    [/contour des yeux|eye cream/i,               'soin yeux'],
    [/crème|cream|hydratant|moisturizer/i,         'crème visage'],
    [/gel douche|shower gel|gel nettoyant/i,       'gel douche'],
    [/démaquillant|micellar|eau micellaire/i,      'démaquillant'],
    [/parfum|eau de toilette|eau de parfum/i,      'parfum'],
    [/vernis|nail polish/i,                       'vernis à ongles'],
    [/déodorant|deodorant/i,                      'déodorant'],
    [/baume lèvres|lip balm/i,                    'baume à lèvres'],
    [/primer/i,                                   'primer'],
    [/setting spray|spray fixant/i,               'spray fixant'],
  ]
  for (const [re, label] of types) {
    if (re.test(text)) return label
  }
  return ''
}

// ── Brand-owned stores (brands with their own e-commerce) ───────────────────
interface BrandStore extends Retailer {
  match: RegExp
}

const BRAND_STORES: BrandStore[] = [
  {
    match: /kiko/i,
    name: 'KIKO Milano',
    flag: '🇮🇹',
    color: '#c8102e',
    url: (q) => `https://www.kiko.com/fr-fr/search?query=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Livraison gratuite dès 29 €',
  },
  {
    match: /yves rocher/i,
    name: 'Yves Rocher',
    flag: '🇫🇷',
    color: '#2e7d32',
    url: (q) => `https://www.yves-rocher.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Marque propre',
  },
  {
    match: /l.?occitane/i,
    name: "L'Occitane",
    flag: '🇫🇷',
    color: '#8d6e3b',
    url: (q) => `https://fr.loccitane.com/search,fr,sc.html?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Produits provençaux',
  },
  {
    match: /the body shop|body shop/i,
    name: 'The Body Shop',
    flag: '🌿',
    color: '#4e7c59',
    url: (q) => `https://www.thebodyshop.com/fr-fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Cruelty-free',
  },
  {
    match: /nuxe/i,
    name: 'Nuxe',
    flag: '🇫🇷',
    color: '#c9a227',
    url: (q) => `https://www.nuxe.com/fr/catalogsearch/result/?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Cosmétiques naturels',
  },
  {
    match: /la roche.?posay/i,
    name: 'La Roche-Posay',
    flag: '🇫🇷',
    color: '#0066cc',
    url: (q) => `https://www.laroche-posay.fr/nos-soins/recherche?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Peaux sensibles',
  },
  {
    match: /vichy/i,
    name: 'Vichy',
    flag: '🇫🇷',
    color: '#1a6496',
    url: (q) => `https://www.vichy.fr/nos-soins/recherche?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Dermato-cosmétique',
  },
  {
    match: /bioderma/i,
    name: 'Bioderma',
    flag: '🇫🇷',
    color: '#e8502a',
    url: (q) => `https://www.bioderma.fr/nos-produits?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Dermatologie',
  },
  {
    match: /avène|eau thermale avène/i,
    name: 'Avène',
    flag: '🇫🇷',
    color: '#00a0c6',
    url: (q) => `https://www.eau-thermale-avene.fr/recherche?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Eau thermale',
  },
  {
    match: /mac cosmetics|^mac$/i,
    name: 'MAC Cosmetics',
    flag: '🇺🇸',
    color: '#1a1a1a',
    url: (q) => `https://www.maccosmetics.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Pro & grand public',
  },
  {
    match: /charlotte tilbury/i,
    name: 'Charlotte Tilbury',
    flag: '🇬🇧',
    color: '#b5936b',
    url: (q) => `https://www.charlottetilbury.com/fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Luxe accessible',
  },
  {
    match: /nyx/i,
    name: 'NYX Professional Makeup',
    flag: '🇺🇸',
    color: '#000000',
    url: (q) => `https://www.nyxcosmetics.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Maquillage pro',
  },
  {
    match: /clarins/i,
    name: 'Clarins',
    flag: '🇫🇷',
    color: '#c8102e',
    url: (q) => `https://www.clarins.fr/search/?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Soin & maquillage',
  },
  {
    match: /dior|christian dior/i,
    name: 'Dior Beauty',
    flag: '🇫🇷',
    color: '#1a1a1a',
    url: (q) => `https://www.dior.com/fr_fr/beauty/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Haute couture',
  },
  {
    match: /chanel/i,
    name: 'Chanel',
    flag: '🇫🇷',
    color: '#1a1a1a',
    url: (q) => `https://www.chanel.com/fr/beaute/recherche/?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Luxe',
  },
  {
    match: /lancôme|lancome/i,
    name: 'Lancôme',
    flag: '🇫🇷',
    color: '#c8102e',
    url: (q) => `https://www.lancome.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle · Beauté de luxe',
  },
  {
    match: /benefit/i,
    name: 'Benefit Cosmetics',
    flag: '🇺🇸',
    color: '#e91e8c',
    url: (q) => `https://www.benefitcosmetics.com/fr-fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle',
  },
  {
    match: /urban decay/i,
    name: 'Urban Decay',
    flag: '🇺🇸',
    color: '#6a1b9a',
    url: (q) => `https://www.urbandecay.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle',
  },
  {
    match: /too faced/i,
    name: 'Too Faced',
    flag: '🇺🇸',
    color: '#f06292',
    url: (q) => `https://www.toofaced.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Boutique officielle',
  },
]

// ── Generic retailers ───────────────────────────────────────────────────────
const franceRetailers: Retailer[] = [
  {
    name: 'Sephora',
    flag: '🇫🇷',
    color: '#000000',
    url: (q) => `https://www.sephora.fr/search/?q=${encodeURIComponent(q)}`,
    tag: 'Livraison gratuite dès 40 €',
  },
  {
    name: 'Nocibé',
    flag: '🇫🇷',
    color: '#D81B60',
    url: (q) => `https://www.nocibe.fr/search?q=${encodeURIComponent(q)}`,
    tag: 'Click & Collect disponible',
  },
  {
    name: 'Marionnaud',
    flag: '🇫🇷',
    color: '#C62828',
    url: (q) => `https://www.marionnaud.fr/search/?text=${encodeURIComponent(q)}`,
    tag: 'Programme fidélité',
  },
  {
    name: 'Amazon France',
    flag: '🇫🇷',
    color: '#FF9900',
    url: (q) => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&i=beauty`,
    tag: 'Livraison Prime disponible',
  },
  {
    name: 'Lookfantastic FR',
    flag: '🇫🇷',
    color: '#1565C0',
    url: (q) => `https://www.lookfantastic.fr/elysium/search.lst?query=${encodeURIComponent(q)}`,
    tag: 'Livraison internationale',
  },
  {
    name: 'Monoprix',
    flag: '🇫🇷',
    color: '#E53935',
    url: (q) => `https://www.monoprix.fr/recherche?text=${encodeURIComponent(q)}`,
    tag: 'Retrait en magasin',
  },
]

const worldRetailers: Retailer[] = [
  {
    name: 'Amazon (Global)',
    flag: '🌍',
    color: '#FF9900',
    url: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=beauty`,
    tag: 'Expédition internationale',
  },
  {
    name: 'Cult Beauty',
    flag: '🇬🇧',
    color: '#6A1B9A',
    url: (q) => `https://www.cultbeauty.co.uk/search?q=${encodeURIComponent(q)}`,
    tag: 'Livraison en France disponible',
  },
  {
    name: 'Lookfantastic',
    flag: '🇬🇧',
    color: '#1565C0',
    url: (q) => `https://www.lookfantastic.com/elysium/search.lst?query=${encodeURIComponent(q)}`,
    tag: 'Livraison mondiale',
  },
  {
    name: 'iHerb',
    flag: '🌍',
    color: '#388E3C',
    url: (q) => `https://fr.iherb.com/search?kw=${encodeURIComponent(q)}`,
    tag: 'Produits naturels & bio',
  },
  {
    name: 'Strawberrynet',
    flag: '🌍',
    color: '#E91E63',
    url: (q) => `https://fr.strawberrynet.com/search-results/?q=${encodeURIComponent(q)}`,
    tag: 'Expédition mondiale gratuite',
  },
]

// ── Retailer button ─────────────────────────────────────────────────────────
function RetailerButton({ retailer, query }: { retailer: Retailer; query: string }) {
  return (
    <a
      href={retailer.url(query)}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #eee',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background 0.15s',
        background: '#fafafa',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}
    >
      <span style={{ fontSize: '1.4rem' }}>{retailer.flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: retailer.color }}>
          {retailer.name}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '1px' }}>
          {retailer.tag}
        </div>
      </div>
      <svg width="16" height="16" fill="#bbb" viewBox="0 0 16 16">
        <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
        <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
      </svg>
    </a>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ShopDialog({ product, onClose }: ShopDialogProps) {
  // Use first brand only (some products list multiple, comma-separated)
  const mainBrand = (product.brands ?? '').split(',')[0].trim()
  const productType = extractProductType(product)

  // Compact, relevant search query: "Kiko Milano mascara" instead of full product name
  const searchQuery = [mainBrand, productType].filter(Boolean).join(' ')

  // Check if brand has its own official store
  const brandStore = BRAND_STORES.find(b => b.match.test(mainBrand)) ?? null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px', paddingRight: '32px' }}>
          <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Où acheter
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>
            {product.product_name || 'Ce produit'}
          </div>
          {product.brands && (
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: '2px' }}>
              {product.brands}
            </div>
          )}
          {searchQuery && (
            <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '6px' }}>
              Recherche : <em>&quot;{searchQuery}&quot;</em>
            </div>
          )}
        </div>

        {/* Official brand store (if detected) */}
        {brandStore && (
          <>
            <div style={{ marginBottom: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⭐ Site officiel
            </div>
            <div style={{ marginBottom: '20px' }}>
              <RetailerButton retailer={brandStore} query={searchQuery} />
            </div>
          </>
        )}

        {/* France */}
        <div style={{ marginBottom: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🇫🇷 En France
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {franceRetailers.map(r => (
            <RetailerButton key={r.name} retailer={r} query={searchQuery} />
          ))}
        </div>

        {/* World */}
        <div style={{ marginBottom: '8px', fontWeight: 700, fontSize: '0.82rem', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🌍 International (livraison en France)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {worldRetailers.map(r => (
            <RetailerButton key={r.name} retailer={r} query={searchQuery} />
          ))}
        </div>

        <p style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '16px', textAlign: 'center' }}>
          Ces liens pointent vers les pages de recherche de chaque boutique.
        </p>
      </div>
    </div>
  )
}
