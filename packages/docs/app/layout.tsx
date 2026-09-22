import { GoogleTagManager } from '@next/third-parties/google'
import { type Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import { type ReactNode } from 'react'

import { Navbar } from '@/components/navigation/navbar'
import { Providers } from '@/providers'
import { Settings } from '@/types/settings'

import '@/styles/globals.css'

const workbenchFont = Noto_Sans_Thai({
  adjustFontFallback: true,
  display: 'swap',
  preload: true,
  subsets: ['latin', 'thai'],
  variable: '--font-workbench',
})

const baseUrl = Settings.metadataBase

export const metadata: Metadata = {
  title: Settings.title,
  metadataBase: new URL(baseUrl),
  description: Settings.description,
  keywords: Settings.keywords,
  openGraph: {
    type: Settings.openGraph.type,
    url: baseUrl,
    title: Settings.openGraph.title,
    description: Settings.openGraph.description,
    siteName: Settings.openGraph.siteName,
    images: Settings.openGraph.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  twitter: {
    card: Settings.twitter.card,
    title: Settings.twitter.title,
    description: Settings.twitter.description,
    site: Settings.twitter.site,
    images: Settings.twitter.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  publisher: Settings.name,
  alternates: {
    canonical: baseUrl,
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      {Settings.gtmconnected && <GoogleTagManager gtmId={Settings.gtm} />}
      <body className={`${workbenchFont.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main className="h-auto px-0">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
