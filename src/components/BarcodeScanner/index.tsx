'use client'

import { useEffect, useRef, useState } from 'react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

// BarcodeDetector is not in all TS lib versions — declare it manually
declare class BarcodeDetector {
  constructor(options?: { formats: string[] })
  detect(source: HTMLVideoElement): Promise<{ rawValue: string; format: string }[]>
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animRef = useRef<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [supported] = useState(() => 'BarcodeDetector' in window)

  useEffect(() => {
    if (!supported) return

    const detector = new BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code'],
    })

    const scan = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        animRef.current = requestAnimationFrame(scan)
        return
      }
      try {
        const barcodes = await detector.detect(videoRef.current)
        if (barcodes.length > 0) {
          stopCamera()
          onScan(barcodes[0].rawValue)
          return
        }
      } catch {
        // frame not ready yet, continue
      }
      animRef.current = requestAnimationFrame(scan)
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          animRef.current = requestAnimationFrame(scan)
        }
      } catch {
        setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
      }
    }

    startCamera()

    return () => stopCamera()
  }, [supported, onScan])

  const stopCamera = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.93)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {!supported ? (
        <div className="text-white text-center">
          <p style={{ fontSize: '1.1rem' }}>
            Votre navigateur ne supporte pas le scan de code-barres.
          </p>
          <p className="text-secondary">Utilisez Chrome ou Safari 17+.</p>
        </div>
      ) : error ? (
        <div className="text-white text-center">
          <p style={{ fontSize: '1.1rem' }}>{error}</p>
        </div>
      ) : (
        <>
          <p className="text-white mb-3" style={{ fontSize: '1rem' }}>
            Pointez la caméra vers le code-barres du produit
          </p>

          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <video
              ref={videoRef}
              muted
              playsInline
              style={{ width: '100%', borderRadius: '14px', display: 'block' }}
            />
            {/* scanning frame */}
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '10%',
                right: '10%',
                bottom: '25%',
                border: '2px solid rgba(255,255,255,0.7)',
                borderRadius: '8px',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
              }}
            />
            {/* corner accents */}
            {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((pos) => (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderColor: '#fff',
                  borderStyle: 'solid',
                  borderWidth: 0,
                  ...(pos === 'topLeft' && { top: '25%', left: '10%', borderTopWidth: 3, borderLeftWidth: 3, borderRadius: '4px 0 0 0' }),
                  ...(pos === 'topRight' && { top: '25%', right: '10%', borderTopWidth: 3, borderRightWidth: 3, borderRadius: '0 4px 0 0' }),
                  ...(pos === 'bottomLeft' && { bottom: '25%', left: '10%', borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: '0 0 0 4px' }),
                  ...(pos === 'bottomRight' && { bottom: '25%', right: '10%', borderBottomWidth: 3, borderRightWidth: 3, borderRadius: '0 0 4px 0' }),
                }}
              />
            ))}
          </div>
        </>
      )}

      <button
        onClick={handleClose}
        className="btn btn-outline-light mt-4 px-4"
        style={{ borderRadius: '10px' }}
      >
        Fermer
      </button>
    </div>
  )
}
