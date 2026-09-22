import { notFound } from 'next/navigation'

import { HomePage } from '@/components/home/home-page'
import { isLocale, type Locale } from '@/lib/i18n'

interface LocaleHomeProps {
  params: Promise<{ locale: string }>
}

export default async function LocaleHome({ params }: LocaleHomeProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <HomePage locale={locale as Locale} />
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'th' }]
}
