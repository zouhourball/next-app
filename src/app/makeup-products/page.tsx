import React from 'react'
import { getMakeupProducts } from '@/api'
import { MakeupProductType } from '../types'
import { v4 as uuidv4 } from 'uuid'

export default async function MakeupProductsPage() {
  const products: MakeupProductType[] = await getMakeupProducts('lipstick')

  return (
    <div className="container px-4 pt-5">
      <div className="row mt-5">
        <div className="col-12">
          <h1>Produits Maquillage</h1>
          <p className="text-muted">Rouges à lèvres — via Makeup API</p>
        </div>
      </div>
      <div className="row mt-4 g-4">
        {products.slice(0, 20).map((product) => (
          <div className="col-12 col-sm-6 col-md-4" key={uuidv4()}>
            <div className="card h-100">
              <img
                src={product.image_link ?? 'https://picsum.photos/300/200'}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                {product.brand && (
                  <p className="text-muted mb-1">
                    <small>Marque : {product.brand}</small>
                  </p>
                )}
                {product.price && (
                  <p className="mb-1">
                    <strong>
                      {product.price_sign ?? '$'}{product.price}
                    </strong>
                  </p>
                )}
                {product.rating && (
                  <p className="mb-1">
                    <small>Note : {product.rating} / 5</small>
                  </p>
                )}
                {product.description && (
                  <p className="card-text mt-2" style={{ fontSize: '0.85rem' }}>
                    {product.description.slice(0, 120)}
                    {product.description.length > 120 ? '...' : ''}
                  </p>
                )}
                {product.tag_list?.length > 0 && (
                  <div className="mt-auto pt-2">
                    {product.tag_list.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {product.product_link && (
                  <a
                    href={product.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-dark mt-3"
                  >
                    Voir le produit
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
