import { type MetadataRoute } from 'next/types'

import { PageRoutes } from '@/lib/pageroutes'
import { Settings } from '@/types/settings'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return [
    {
      url: Settings.metadataBase,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${Settings.metadataBase}/en`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${Settings.metadataBase}/th`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...['en', 'th'].flatMap((locale) =>
      PageRoutes.map((page) => ({
        url: `${Settings.metadataBase}/${locale}/docs${page.href}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    ),
  ]
}
