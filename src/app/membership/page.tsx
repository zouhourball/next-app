import React from 'react'

export default function page() {
  return (
    <div className='container'>
      <h1>Membership plans</h1>
      <div className="flex-row d-flex">
        <div className="card mx-5">
          <div className="card-body">
            <h5 className="card-title">Regular Member</h5>
            <a href="#" className="btn btn-outline-info my-2">Get Started</a>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
        <div className="card mx-5">
          <div className="card-body">
            <h5 className="card-title">VIP Member</h5>
            <a href="#" className="btn btn-outline-info my-2">Get Started</a>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
