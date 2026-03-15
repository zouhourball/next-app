import { NextRequest, NextResponse } from 'next/server'
import { analyseIngredients } from '@/lib/ingredientAnalysis'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Code manquant' }, { status: 400 })
  }

  try {
    // Try French subdomain first, fall back to world database for broader coverage
    const urls = [
      `https://fr.openbeautyfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
      `https://world.openbeautyfacts.org/api/v0/product/${encodeURIComponent(code)}.json`,
    ]

    let data: { status: number; product?: Record<string, string> } | null = null
    for (const url of urls) {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      const json = await res.json()
      if (json.status === 1 && json.product) {
        data = json
        break
      }
    }

    if (!data) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    const p = data.product!
    const ingredientsText = p.ingredients_text_fr ?? p.ingredients_text ?? ''

    const product = {
      code: p.code ?? code,
      product_name: p.product_name ?? p.product_name_fr ?? '',
      brands: p.brands ?? '',
      quantity: p.quantity ?? '',
      image_url: p.image_front_url ?? p.image_url ?? '',
      ingredients_text: ingredientsText,
      categories: p.categories ?? '',
    }

    const analysis = ingredientsText ? analyseIngredients(ingredientsText) : null

    return NextResponse.json({ product, analysis })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
