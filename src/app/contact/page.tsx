'use client'
import React from 'react'

export default function page() {
  //old way
  const makeCall = async () => {
    await fetch('/api/create-api',{
      method: 'POST',
      body: JSON.stringify({hello: 'world'})
    })

  }
  return (
    <div>
      <h1>Page de contact</h1>
      <button onClick={makeCall}>Envoyer</button>
    </div>
  )
}
