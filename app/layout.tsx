import type { Metadata } from 'next'
import { Baloo_2 } from 'next/font/google'
import './globals.css'

// Baloo 2 is a friendly, rounded "bubble" font with personality.
const baloo = Baloo_2({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' })

export const metadata: Metadata = {
  title: 'NextBook',
  description: 'Your next favorite book discovery platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={baloo.className}>
        {children}
      </body>
    </html>
  )
}

