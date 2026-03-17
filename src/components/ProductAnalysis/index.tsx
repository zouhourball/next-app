'use client'

import { useState } from 'react'
import { IngredientAnalysis, IngredientInfo } from '@/lib/ingredientAnalysis'

function IngredientSection({
  title, emoji, items, color, defaultOpen,
}: {
  title: string
  emoji: string
  items: IngredientInfo[]
  color: string
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (items.length === 0) return null
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', padding: '10px 0',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
        <span style={{ fontWeight: 600, color, fontSize: '0.95rem' }}>{title}</span>
        <span style={{
          marginLeft: 'auto', background: color, color: '#fff',
          borderRadius: '12px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600,
        }}>
          {items.length}
        </span>
        <span style={{ color: '#bbb', fontSize: '0.8rem', marginLeft: '6px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' }}>
          {items.map((ing) => (
            <div
              key={ing.name}
              style={{
                background: `${color}10`, border: `1px solid ${color}35`,
                borderRadius: '8px', padding: '8px 12px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.82rem', textTransform: 'capitalize', color: '#222' }}>
                {ing.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '2px' }}>
                {ing.reason}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductAnalysis({ analysis }: { analysis: IngredientAnalysis }) {
  return (
    <div>
      {/* Summary chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        background: '#f8f8f8', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px',
      }}>
        {analysis.bad.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#d0021b', fontWeight: 600 }}>
            🔴 {analysis.bad.length} à éviter
          </span>
        )}
        {analysis.moderate.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#e07b39', fontWeight: 600 }}>
            🟡 {analysis.moderate.length} modérés
          </span>
        )}
        {analysis.good.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#2d9e5f', fontWeight: 600 }}>
            🟢 {analysis.good.length} bénéfiques
          </span>
        )}
        {analysis.unknown.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#999' }}>
            ⚪ {analysis.unknown.length} non évalués
          </span>
        )}
      </div>

      <IngredientSection
        title="À éviter"
        emoji="🔴"
        items={analysis.bad}
        color="#d0021b"
        defaultOpen={true}
      />
      <IngredientSection
        title="Modérés"
        emoji="🟡"
        items={analysis.moderate}
        color="#e07b39"
        defaultOpen={analysis.bad.length === 0}
      />
      <IngredientSection
        title="Bénéfiques"
        emoji="🟢"
        items={analysis.good}
        color="#2d9e5f"
        defaultOpen={analysis.bad.length === 0 && analysis.moderate.length === 0}
      />
    </div>
  )
}
