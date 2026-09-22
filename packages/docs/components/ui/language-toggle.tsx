'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LuLanguages } from 'react-icons/lu'

import { useI18n } from '@/components/i18n/locale-provider'
import { Button } from '@/components/ui/button'
import { type Locale, localeNames, pathWithLocale } from '@/lib/i18n'

const nextLocale: Record<Locale, Locale> = {
  en: 'th',
  th: 'en',
}

export function LanguageToggle() {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, dictionary } = useI18n()
  const targetLocale = nextLocale[locale]

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => router.push(pathWithLocale(pathname, targetLocale))}
      className="size-8 cursor-pointer"
      title={`${dictionary.common.switchLanguage}: ${localeNames[targetLocale]}`}
      aria-label={`${dictionary.common.switchLanguage}: ${localeNames[targetLocale]}`}
    >
      <LuLanguages />
      <span className="sr-only">
        {dictionary.common.switchLanguage}: {localeNames[targetLocale]}
      </span>
    </Button>
  )
}
