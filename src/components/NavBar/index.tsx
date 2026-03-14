import React from 'react'
import Link from 'next/link'

 const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className='nav-link active' href="/">Accueil</Link>
          </li>
          
          <li className="nav-item">
            <Link className='nav-link' href="/makeup-products">Produits Maquillage</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/beauty-facts">Beauté & Ingrédients</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/videos">Vidéos</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default NavBar
