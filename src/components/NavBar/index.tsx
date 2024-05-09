import React from 'react'
import Link from 'next/link'

 const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className='nav-link active' href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/membership">MemberShip</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/write">Write</Link>
          </li>
          <li className="nav-item">
            <Link className='nav-link' href="/contact">Contact us</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default NavBar