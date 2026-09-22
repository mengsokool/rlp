'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { HomePage } from '@/components/home/home-page'
import { isLocale } from '@/lib/i18n'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 1. Check local storage for previously selected language
    const savedLocale = window.localStorage.getItem('rlp-docs-locale')
    if (savedLocale && isLocale(savedLocale)) {
      router.replace(`/${savedLocale}`)
      return
    }

    // 2. Check browser languages
    const browserLanguages = window.navigator.languages || [window.navigator.language]
    const hasThai = browserLanguages.some((lang) => lang.toLowerCase().startsWith('th'))
    const targetLocale = hasThai ? 'th' : 'en'

    router.replace(`/${targetLocale}`)
  }, [router])

  // SEO Fallback: default to English homepage if JavaScript is disabled
  return <HomePage locale="en" />
}
