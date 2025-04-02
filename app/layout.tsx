import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IntegriGuide',
  description: 'Platform generasi dokumen SMAP dan Pancek berbasis AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}