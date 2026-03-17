import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog Beauté',
  description: 'Blog beauté français — produits, tendances et vidéos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}</body>
    </html>
  )
}
