'use client'

import { BeautyFactProductType } from '@/app/types'

interface Retailer {
  name: string
  flag: string
  color: string
  url: (q: string) => string
  tag: string
}

// ── Product type extraction (for search query) ──────────────────────────────
function extractProductType(product: BeautyFactProductType): string {
  const text = `${product.product_name ?? ''} ${product.categories ?? ''}`.toLowerCase()
  const types: [RegExp, string][] = [
    [/mascara/i,                               'mascara'],
    [/rouge à lèvres|lipstick|lip gloss/i,     'rouge à lèvres'],
    [/fond de teint|foundation/i,              'fond de teint'],
    [/blush|fard à joues/i,                    'blush'],
    [/palette|eyeshadow/i,                     'palette maquillage'],
    [/highlighter|enlumineur/i,                'highlighter'],
    [/bronzer|bronzant/i,                      'bronzer'],
    [/anticernes|concealer|correcteur/i,       'correcteur'],
    [/eyeliner|crayon yeux/i,                  'eyeliner'],
    [/crème solaire|sunscreen|spf/i,           'crème solaire'],
    [/sérum|serum/i,                           'sérum'],
    [/shampoo|shampooing/i,                    'shampooing'],
    [/parfum|eau de toilette/i,                'parfum'],
    [/vernis|nail/i,                           'vernis ongles'],
    [/déodorant/i,                             'déodorant'],
    [/crème|cream|hydratant/i,                 'soin visage'],
  ]
  for (const [re, label] of types) {
    if (re.test(text)) return label
  }
  return ''
}

// ── Official brand stores ────────────────────────────────────────────────────
const BRAND_STORES: { match: RegExp; name: string; flag: string; color: string; url: (q: string) => string; tag: string }[] = [
  { match: /kiko/i,                  name: 'KIKO Milano',          flag: '🇮🇹', color: '#c8102e', url: q => `https://www.kiko.com/fr-fr/search?query=${encodeURIComponent(q)}`,                    tag: 'Boutique officielle' },
  { match: /yves rocher/i,           name: 'Yves Rocher',          flag: '🇫🇷', color: '#2e7d32', url: q => `https://www.yves-rocher.fr/search?q=${encodeURIComponent(q)}`,                       tag: 'Boutique officielle' },
  { match: /l.?occitane/i,           name: "L'Occitane",           flag: '🇫🇷', color: '#8d6e3b', url: q => `https://fr.loccitane.com/search,fr,sc.html?q=${encodeURIComponent(q)}`,              tag: 'Boutique officielle' },
  { match: /the body shop/i,         name: 'The Body Shop',        flag: '🌿', color: '#4e7c59',  url: q => `https://www.thebodyshop.com/fr-fr/search?q=${encodeURIComponent(q)}`,                 tag: 'Boutique officielle' },
  { match: /nuxe/i,                  name: 'Nuxe',                 flag: '🇫🇷', color: '#c9a227', url: q => `https://www.nuxe.com/fr/catalogsearch/result/?q=${encodeURIComponent(q)}`,            tag: 'Boutique officielle' },
  { match: /la roche.?posay/i,       name: 'La Roche-Posay',       flag: '🇫🇷', color: '#0066cc', url: q => `https://www.laroche-posay.fr/nos-soins/recherche?q=${encodeURIComponent(q)}`,         tag: 'Boutique officielle' },
  { match: /vichy/i,                 name: 'Vichy',                flag: '🇫🇷', color: '#1a6496', url: q => `https://www.vichy.fr/nos-soins/recherche?q=${encodeURIComponent(q)}`,                 tag: 'Boutique officielle' },
  { match: /bioderma/i,              name: 'Bioderma',             flag: '🇫🇷', color: '#e8502a', url: q => `https://www.bioderma.fr/nos-produits?q=${encodeURIComponent(q)}`,                    tag: 'Boutique officielle' },
  { match: /avène/i,                 name: 'Avène',                flag: '🇫🇷', color: '#00a0c6', url: q => `https://www.eau-thermale-avene.fr/recherche?q=${encodeURIComponent(q)}`,              tag: 'Boutique officielle' },
  { match: /mac cosmetics|^mac$/i,   name: 'MAC Cosmetics',        flag: '🇺🇸', color: '#1a1a1a', url: q => `https://www.maccosmetics.fr/search?q=${encodeURIComponent(q)}`,                      tag: 'Boutique officielle' },
  { match: /charlotte tilbury/i,     name: 'Charlotte Tilbury',   flag: '🇬🇧', color: '#b5936b', url: q => `https://www.charlottetilbury.com/fr/search?q=${encodeURIComponent(q)}`,               tag: 'Boutique officielle' },
  { match: /nyx/i,                   name: 'NYX Makeup',           flag: '🇺🇸', color: '#000000', url: q => `https://www.nyxcosmetics.fr/search?q=${encodeURIComponent(q)}`,                      tag: 'Boutique officielle' },
  { match: /clarins/i,               name: 'Clarins',              flag: '🇫🇷', color: '#c8102e', url: q => `https://www.clarins.fr/search/?q=${encodeURIComponent(q)}`,                          tag: 'Boutique officielle' },
  { match: /dior|christian dior/i,   name: 'Dior Beauty',          flag: '🇫🇷', color: '#1a1a1a', url: q => `https://www.dior.com/fr_fr/beauty/search?q=${encodeURIComponent(q)}`,                tag: 'Boutique officielle' },
  { match: /chanel/i,                name: 'Chanel',               flag: '🇫🇷', color: '#1a1a1a', url: q => `https://www.chanel.com/fr/beaute/recherche/?q=${encodeURIComponent(q)}`,              tag: 'Boutique officielle' },
  { match: /lancôme|lancome/i,       name: 'Lancôme',              flag: '🇫🇷', color: '#c8102e', url: q => `https://www.lancome.fr/search?q=${encodeURIComponent(q)}`,                           tag: 'Boutique officielle' },
  { match: /benefit/i,               name: 'Benefit Cosmetics',    flag: '🇺🇸', color: '#e91e8c', url: q => `https://www.benefitcosmetics.com/fr-fr/search?q=${encodeURIComponent(q)}`,            tag: 'Boutique officielle' },
  { match: /urban decay/i,           name: 'Urban Decay',          flag: '🇺🇸', color: '#6a1b9a', url: q => `https://www.urbandecay.fr/search?q=${encodeURIComponent(q)}`,                        tag: 'Boutique officielle' },
]

// ── Generic retailers ────────────────────────────────────────────────────────
const franceRetailers: Retailer[] = [
  { name: 'Sephora',         flag: '🇫🇷', color: '#000',    url: q => `https://www.sephora.fr/search/?q=${encodeURIComponent(q)}`,                          tag: 'Livraison gratuite dès 40 €' },
  { name: 'Nocibé',          flag: '🇫🇷', color: '#D81B60', url: q => `https://www.nocibe.fr/search?q=${encodeURIComponent(q)}`,                            tag: 'Click & Collect disponible' },
  { name: 'Marionnaud',      flag: '🇫🇷', color: '#C62828', url: q => `https://www.marionnaud.fr/search/?text=${encodeURIComponent(q)}`,                   tag: 'Programme fidélité' },
  { name: 'Amazon France',   flag: '🇫🇷', color: '#FF9900', url: q => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&i=beauty`,                       tag: 'Livraison Prime' },
  { name: 'Lookfantastic FR',flag: '🇫🇷', color: '#1565C0', url: q => `https://www.lookfantastic.fr/elysium/search.lst?query=${encodeURIComponent(q)}`,     tag: 'Livraison internationale' },
  { name: 'Monoprix',        flag: '🇫🇷', color: '#E53935', url: q => `https://www.monoprix.fr/recherche?text=${encodeURIComponent(q)}`,                   tag: 'Retrait en magasin' },
]

const worldRetailers: Retailer[] = [
  { name: 'Amazon Global',   flag: '🌍', color: '#FF9900', url: q => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=beauty`,                       tag: 'Expédition internationale' },
  { name: 'Cult Beauty',     flag: '🇬🇧', color: '#6A1B9A', url: q => `https://www.cultbeauty.co.uk/search?q=${encodeURIComponent(q)}`,                    tag: 'Livraison en France' },
  { name: 'Lookfantastic',   flag: '🇬🇧', color: '#1565C0', url: q => `https://www.lookfantastic.com/elysium/search.lst?query=${encodeURIComponent(q)}`,   tag: 'Livraison mondiale' },
  { name: 'iHerb',           flag: '🌍', color: '#388E3C', url: q => `https://fr.iherb.com/search?kw=${encodeURIComponent(q)}`,                            tag: 'Bio & naturel' },
  { name: 'Strawberrynet',   flag: '🌍', color: '#E91E63', url: q => `https://fr.strawberrynet.com/search-results/?q=${encodeURIComponent(q)}`,            tag: 'Expédition gratuite' },
]

// ── Compact retailer row ─────────────────────────────────────────────────────
function RetailerRow({ name, flag, color, tag, href }: { name: string; flag: string; color: string; tag: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '10px',
        border: '1px solid #eee', background: '#fafafa',
        textDecoration: 'none', color: 'inherit',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
      onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}
    >
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.82rem', color }}>{name}</div>
        <div style={{ fontSize: '0.68rem', color: '#999', marginTop: '1px' }}>{tag}</div>
      </div>
      <svg width="13" height="13" fill="#ccc" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
        <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
        <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
      </svg>
    </a>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.72rem', fontWeight: 700, color: '#777',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: '8px', marginTop: '16px',
    }}>
      {children}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function WhereToBuy({ product }: { product: BeautyFactProductType }) {
  const mainBrand = (product.brands ?? '').split(',')[0].trim()
  const productType = extractProductType(product)
  const query = [mainBrand, productType].filter(Boolean).join(' ')

  const brandStore = BRAND_STORES.find(b => b.match.test(mainBrand)) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

      {brandStore && (
        <>
          <SectionLabel>⭐ Site officiel</SectionLabel>
          <RetailerRow
            name={brandStore.name}
            flag={brandStore.flag}
            color={brandStore.color}
            tag={brandStore.tag}
            href={brandStore.url(query)}
          />
        </>
      )}

      <SectionLabel>🇫🇷 En France</SectionLabel>
      {franceRetailers.map(r => (
        <RetailerRow key={r.name} name={r.name} flag={r.flag} color={r.color} tag={r.tag} href={r.url(query)} />
      ))}

      <SectionLabel>🌍 International</SectionLabel>
      {worldRetailers.map(r => (
        <RetailerRow key={r.name} name={r.name} flag={r.flag} color={r.color} tag={r.tag} href={r.url(query)} />
      ))}

      <p style={{ fontSize: '0.65rem', color: '#ccc', marginTop: '10px', marginBottom: 0 }}>
        Liens vers les pages de recherche de chaque boutique.
      </p>
    </div>
  )
}
