import { NextResponse } from 'next/server'

const tagMap: { keywords: string[]; tags: string[] }[] = [
  {
    keywords: ['mascara'],
    tags: ['volume', 'allongeant', 'waterproof', 'vegan', 'longue tenue', 'noir', 'naturel', 'courbe'],
  },
  {
    keywords: ['rouge à lèvres', 'lipstick', 'lip rouge'],
    tags: ['mat', 'brillant', 'hydratant', 'longue tenue', 'nude', 'rouge', 'rose', 'vegan'],
  },
  {
    keywords: ['gloss', 'brillant à lèvres'],
    tags: ['brillant', 'volumateur', 'hydratant', 'transparent', 'nude', 'rose', 'teinté'],
  },
  {
    keywords: ['fond de teint', 'foundation'],
    tags: ['couvrant', 'léger', 'mat', 'lumineux', 'longue tenue', 'SPF', 'naturel', 'vegan'],
  },
  {
    keywords: ['correcteur', 'anti-cernes', 'concealer'],
    tags: ['couvrant', 'hydratant', 'anti-cernes', 'longue tenue', 'naturel', 'léger'],
  },
  {
    keywords: ['blush', 'fard à joues'],
    tags: ['rose', 'pêche', 'corail', 'mat', 'nacré', 'naturel', 'longue tenue', 'vegan'],
  },
  {
    keywords: ['eye liner', 'eyeliner', 'liner'],
    tags: ['liquide', 'crayon', 'noir', 'waterproof', 'précis', 'longue tenue', 'gel'],
  },
  {
    keywords: ['fard à paupières', 'ombre à paupières', 'eyeshadow', 'palette'],
    tags: ['mat', 'nacré', 'palette', 'smoky', 'naturel', 'longue tenue', 'vegan', 'scintillant'],
  },
  {
    keywords: ['poudre'],
    tags: ['compacte', 'libre', 'matifiante', 'translucide', 'fixante', 'illuminatrice', 'naturel'],
  },
  {
    keywords: ['bronzer', 'bronzant', 'terra'],
    tags: ['mat', 'nacré', 'naturel', 'doré', 'bonne mine', 'soleil', 'vegan'],
  },
  {
    keywords: ['highlighter', 'illuminateur', 'enlumineur'],
    tags: ['doré', 'rosé', 'lumineux', 'nacré', 'scintillant', 'naturel', 'discret'],
  },
  {
    keywords: ['contour', 'contouring'],
    tags: ['mat', 'naturel', 'palette', 'poudre', 'crème', 'longue tenue'],
  },
  {
    keywords: ['crayon', 'khôl', 'kohl'],
    tags: ['noir', 'yeux', 'waterproof', 'longue tenue', 'naturel', 'smoky', 'crayon'],
  },
  {
    keywords: ['soin', 'sérum', 'crème', 'hydratant', 'moisturizer'],
    tags: ['hydratant', 'anti-âge', 'vegan', 'naturel', 'bio', 'peaux sèches', 'peaux mixtes', 'SPF'],
  },
  {
    keywords: ['huile', 'oil'],
    tags: ['visage', 'corps', 'cheveux', 'naturel', 'bio', 'vegan', 'nourrissant', 'éclat'],
  },
  {
    keywords: ['shampoing', 'shampoo'],
    tags: ['cheveux secs', 'cheveux gras', 'volume', 'naturel', 'bio', 'vegan', 'sans sulfate', 'éclat'],
  },
  {
    keywords: ['parfum', 'fragrance'],
    tags: ['floral', 'boisé', 'fruité', 'frais', 'oriental', 'léger', 'longue tenue', 'naturel'],
  },
  {
    keywords: ['vernis', 'nail', 'ongles'],
    tags: ['longue tenue', 'mat', 'brillant', 'gel', 'naturel', 'vegan', 'sans BHA', 'couleur nude'],
  },
  {
    keywords: ['déodorant'],
    tags: ['naturel', 'bio', 'vegan', 'sans aluminium', 'longue durée', '48h', '72h'],
  },
  {
    keywords: ['démaquillant', 'nettoyant'],
    tags: ['doux', 'naturel', 'bio', 'peaux sensibles', 'huile', 'eau micellaire', 'vegan'],
  },
  {
    keywords: ['solaire', 'crème solaire', 'sunscreen', 'sun cream', 'spf', 'écran solaire', 'protection solaire'],
    tags: ['SPF 30', 'SPF 50', 'SPF 50+', 'visage', 'corps', 'enfants', 'waterproof', 'naturel', 'minéral', 'teinté'],
  },
  {
    keywords: ['autobronzant', 'self tanning', 'tanning'],
    tags: ['progressif', 'naturel', 'visage', 'corps', 'bonne mine', 'sans UV', 'vegan'],
  },
]

const defaultTags = ['naturel', 'vegan', 'bio', 'longue tenue', 'hydratant', 'sans paraben', 'french pharmacy']

function getTags(term: string): string[] {
  const lower = term.toLowerCase()

  for (const entry of tagMap) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.tags
    }
  }

  return defaultTags
}

export async function POST(req: Request) {
  const { term } = await req.json()

  if (!term || term.trim().length < 2) {
    return NextResponse.json({ tags: [] })
  }

  const tags = getTags(term.trim())
  return NextResponse.json({ tags })
}
