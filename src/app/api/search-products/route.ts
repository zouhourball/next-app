import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Maps English / informal product terms → French equivalents for the FR database
const termAliases: Record<string, string> = {
  'sunscreen': 'crème solaire',
  'sunscreens': 'crème solaire',
  'sun screen': 'crème solaire',
  'sun cream': 'crème solaire',
  'sunlotion': 'crème solaire',
  'spf': 'crème solaire',
  'tanning': 'autobronzant',
  'self tanning': 'autobronzant',
  'self-tanning': 'autobronzant',
  'moisturizer': 'hydratant',
  'moisturiser': 'hydratant',
  'foundation': 'fond de teint',
  'lipstick': 'rouge à lèvres',
  'eyeshadow': 'ombre à paupières',
  'eyeliner': 'eye liner',
  'concealer': 'correcteur',
  'blush': 'blush',
  'mascara': 'mascara',
  'primer': 'base de maquillage',
  'highlighter': 'illuminateur',
  'bronzer': 'bronzant',
  'shampoo': 'shampoing',
  'conditioner': 'après-shampoing',
  'serum': 'sérum',
  'toner': 'tonique',
  'cleanser': 'nettoyant',
  'micellar': 'eau micellaire',
  'deodorant': 'déodorant',
  'perfume': 'parfum',
  'nail polish': 'vernis à ongles',
}

// Maps simplified/misspelled brand names → correct searchable name
const brandAliases: Record<string, string> = {
  // L'Oréal
  'loreal': "l'oréal",
  "l'oreal": "l'oréal",
  'l oreal': "l'oréal",
  'loréal': "l'oréal",

  // L'Occitane
  'loccitane': "l'occitane",
  'l occitane': "l'occitane",
  "l'occitan": "l'occitane",

  // Lancôme
  'lancome': 'lancôme',
  'lankome': 'lancôme',

  // Maybelline
  'maybelyne': 'maybelline',
  'mabelline': 'maybelline',
  'maybeline': 'maybelline',
  'maybellin': 'maybelline',

  // Yves Saint Laurent
  'ysl': 'yves saint laurent',
  'yves saint lauren': 'yves saint laurent',

  // La Roche-Posay
  'la roche posay': 'la roche-posay',
  'laroche posay': 'la roche-posay',
  'larochepossay': 'la roche-posay',
  'larocheposay': 'la roche-posay',

  // Avène
  'avene': 'avène',

  // Make Up For Ever
  'makeup forever': 'make up for ever',
  'make up forever': 'make up for ever',
  'makeup for ever': 'make up for ever',
  'makeupforever': 'make up for ever',

  // Estée Lauder
  'estee lauder': 'estée lauder',
  'esteelauder': 'estée lauder',

  // Giorgio Armani
  'armani': 'giorgio armani',
  'armani beauty': 'giorgio armani',

  // Common single-word
  'bioderma': 'bioderma',
  'garnier': 'garnier',
  'vichy': 'vichy',
  'clarins': 'clarins',
  'givenchy': 'givenchy',
  'guerlain': 'guerlain',
  'sisley': 'sisley',
  'nars': 'nars',
  'clinique': 'clinique',
  'rimmel': 'rimmel',
  'bourjois': 'bourjois',
  'kiko': 'kiko',
  'catrice': 'catrice',
  'essence': 'essence cosmetics',
  'nuxe': 'nuxe',
  'caudalie': 'caudalie',
  'sephora': 'sephora',
}

function normalizeTerm(term: string): string {
  let normalized = term.toLowerCase().trim()

  // Apply product term aliases first (longest match wins)
  const multiTerms = Object.entries(termAliases)
    .sort((a, b) => b[0].length - a[0].length)

  for (const [alias, correct] of multiTerms) {
    if (normalized.includes(alias)) {
      normalized = normalized.replace(alias, correct)
      break // one product-type substitution is enough
    }
  }

  // Apply multi-word brand aliases (longest match wins)
  const multiBrands = Object.entries(brandAliases)
    .filter(([k]) => k.includes(' '))
    .sort((a, b) => b[0].length - a[0].length)

  for (const [alias, correct] of multiBrands) {
    if (normalized.includes(alias)) {
      normalized = normalized.replace(alias, correct)
    }
  }

  // Then single-word brand aliases on remaining words
  const words = normalized.split(/\s+/)
  const result = words.map((word) => brandAliases[word] ?? word)

  return result.join(' ')
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ products: [] })
  }

  const normalized = normalizeTerm(q)

  const res = await fetch(
    `https://fr.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalized)}&json=1&page_size=12`,
    { next: { revalidate: 3600 } }
  )
  const data = await res.json()

  const products = (data.products ?? []).filter(
    (p: { product_name?: string }) => p.product_name
  )

  return NextResponse.json({ products, normalizedQuery: normalized })
}
