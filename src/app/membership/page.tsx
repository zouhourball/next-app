import React from 'react'

export default function page() {
  return (
    <div className='container'>
      <h1>Nos abonnements</h1>
      <div className="flex-row d-flex">
        <div className="card mx-5">
          <div className="card-body">
            <h5 className="card-title">Membre Standard</h5>
            <a href="#" className="btn btn-outline-info my-2">Commencer</a>
            <p className="card-text">Accédez aux articles beauté, aux tendances du marché français et aux conseils produits.</p>
          </div>
        </div>
        <div className="card mx-5">
          <div className="card-body">
            <h5 className="card-title">Membre VIP</h5>
            <a href="#" className="btn btn-outline-info my-2">Commencer</a>
            <p className="card-text">Profitez d&apos;un accès exclusif aux nouveautés, aux shorts beauté en avant-première et aux offres partenaires.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
