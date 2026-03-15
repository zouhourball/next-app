'use client'

import { IngredientAnalysis, IngredientInfo } from '@/lib/ingredientAnalysis'
import { BeautyFactProductType } from '@/app/types'
import { useState } from 'react'

interface ScanResultProps {
  product: BeautyFactProductType
  analysis: IngredientAnalysis | null
  onClose: () => void
}

function scoreColor(score: number): string {
  if (score >= 80) return '#2d9e5f'
  if (score >= 60) return '#6abf69'
  if (score >= 40) return '#f5a623'
  if (score >= 20) return '#e07b39'
  return '#d0021b'
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color = scoreColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {score}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color }}>{label}</div>
        <div style={{ fontSize: '0.78rem', color: '#666' }}>score de sécurité / 100</div>
      </div>
    </div>
  )
}

function IngredientSection({
  title,
  emoji,
  items,
  color,
  defaultOpen,
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
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
        <span style={{ fontWeight: 600, color, fontSize: '0.95rem' }}>
          {title}
        </span>
        <span style={{
          marginLeft: 'auto',
          background: color,
          color: '#fff',
          borderRadius: '12px',
          padding: '1px 9px',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}>
          {items.length}
        </span>
        <span style={{ color: '#999', fontSize: '0.8rem', marginLeft: '6px' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' }}>
          {items.map((ing) => (
            <div
              key={ing.name}
              style={{
                background: `${color}12`,
                border: `1px solid ${color}40`,
                borderRadius: '8px',
                padding: '8px 12px',
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

export default function ScanResult({ product, analysis, onClose }: ScanResultProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      zIndex: 9998,
      overflowY: 'auto',
      padding: '24px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '480px',
        padding: '24px',
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Product header */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: '10px', background: '#f7f7f7', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '10px', background: '#f0f0f0', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3 }}>
              {product.product_name || 'Produit scanné'}
            </div>
            {product.brands && (
              <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '2px' }}>{product.brands}</div>
            )}
            {product.quantity && (
              <div style={{ fontSize: '0.78rem', color: '#999' }}>{product.quantity}</div>
            )}
          </div>
        </div>

        {/* Score */}
        {analysis && (
          <>
            <div style={{ marginBottom: '20px', padding: '14px', background: '#f8f8f8', borderRadius: '12px' }}>
              <ScoreBadge score={analysis.score} label={analysis.scoreLabel} />
            </div>

            <hr style={{ margin: '0 0 16px', borderColor: '#eee' }} />

            {/* Ingredient sections */}
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#333', marginBottom: '10px' }}>
              Analyse des ingrédients
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

            {analysis.unknown.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999' }}>
                + {analysis.unknown.length} ingrédient{analysis.unknown.length > 1 ? 's' : ''} non évalué{analysis.unknown.length > 1 ? 's' : ''}
              </div>
            )}
          </>
        )}

        {!analysis && (
          <p style={{ fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
            Liste d&apos;ingrédients non disponible pour ce produit.
          </p>
        )}
      </div>
    </div>
  )
}
