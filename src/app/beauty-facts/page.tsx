import React from 'react'
import { getBeautyFacts } from '@/api'
import { BeautyFactProductType, BeautyFactsResponseType } from '../types'
import { v4 as uuidv4 } from 'uuid'

export default async function BeautyFactsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q ?? 'rouge à lèvres'
  const data: BeautyFactsResponseType = await getBeautyFacts(query)
  const products: BeautyFactProductType[] = data.products ?? []

  return (
    <div className="container px-4 pt-5">
      <div className="row mt-5">
        <div className="col-12">
          <h1>Beauté & Ingrédients</h1>
          <p className="text-muted">
            Open Beauty Facts — données réelles sur les ingrédients des produits français
            {searchParams.q && (
              <span> · Résultats pour : <strong>{searchParams.q}</strong></span>
            )}
          </p>
        </div>
      </div>
      <div className="row mt-4 g-4">
        {products
          .filter((p) => p.product_name)
          .map((product) => (
            <div className="col-12 col-sm-6 col-md-4" key={uuidv4()}>
              <div className="card h-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'contain', padding: '8px' }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: '200px' }}
                  >
                    <span className="text-muted">Pas d&apos;image</span>
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.product_name}</h5>
                  {product.brands && (
                    <p className="text-muted mb-1">
                      <small>Marque : {product.brands}</small>
                    </p>
                  )}
                  {product.quantity && (
                    <p className="mb-1">
                      <small>Quantité : {product.quantity}</small>
                    </p>
                  )}
                  {product.categories && (
                    <p className="mb-1" style={{ fontSize: '0.8rem' }}>
                      <span className="text-muted">Catégories : </span>
                      {product.categories.split(',').slice(0, 2).join(', ')}
                    </p>
                  )}
                  {product.ingredients_text && (
                    <div className="mt-2">
                      <small className="text-muted">Ingrédients :</small>
                      <p style={{ fontSize: '0.75rem' }} className="mt-1">
                        {product.ingredients_text.slice(0, 150)}
                        {product.ingredients_text.length > 150 ? '...' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        {products.filter((p) => p.product_name).length === 0 && (
          <div className="col-12">
            <p className="text-muted">Aucun produit trouvé pour &quot;{query}&quot;.</p>
          </div>
        )}
      </div>
    </div>
  )
}
