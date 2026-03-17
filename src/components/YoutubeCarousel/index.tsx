'use client'

import { useRef, useState } from 'react'
import { YoutubeVideoType } from '@/app/types'

// Card dimensions — 9:16 portrait
const CARD_W = 160
const CARD_H = Math.round(CARD_W * (16 / 9)) // 284px

export default function YoutubeCarousel({ videos }: { videos: YoutubeVideoType[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? CARD_W + 12 : -(CARD_W + 12), behavior: 'smooth' })
  }

  if (videos.length === 0) return null

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Prev */}
        <button
          onClick={() => scroll('left')}
          aria-label="Précédent"
          style={{
            position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, width: 40, height: 40, borderRadius: '50%',
            background: '#fff', border: '1px solid #e0e0e0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', color: '#333', lineHeight: 1,
          }}
        >‹</button>

        {/* Next */}
        <button
          onClick={() => scroll('right')}
          aria-label="Suivant"
          style={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, width: 40, height: 40, borderRadius: '50%',
            background: '#fff', border: '1px solid #e0e0e0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', color: '#333', lineHeight: 1,
          }}
        >›</button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
          }}
        >
          {videos.map((video) => (
            <button
              key={video.id.videoId}
              onClick={() => setActiveId(video.id.videoId)}
              aria-label={`Regarder : ${video.snippet.title}`}
              style={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                width: CARD_W,
                height: CARD_H,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'block',
                position: 'relative',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                background: '#000',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.04)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Thumbnail */}
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                }}
              />

              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.72) 100%)',
              }} />

              {/* Play button */}
              <div style={{
                position: 'absolute', top: '38%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 42, height: 42, borderRadius: '50%',
                background: '#ff0000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(0,0,0,0.45)',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff">
                  <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                </svg>
              </div>

              {/* Title overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 9px 10px' }}>
                <div style={{
                  fontSize: '0.72rem', fontWeight: 600, color: '#fff', lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                } as React.CSSProperties}>
                  {video.snippet.title}
                </div>
                <div style={{
                  fontSize: '0.62rem', color: 'rgba(255,255,255,0.65)', marginTop: '3px',
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}>
                  {video.snippet.channelTitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Inline player lightbox ── */}
      {activeId && (
        <div
          onClick={() => setActiveId(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(360px, 88vw)',
              aspectRatio: '9/16',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />

            {/* Close button */}
            <button
              onClick={() => setActiveId(null)}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', fontSize: '1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
