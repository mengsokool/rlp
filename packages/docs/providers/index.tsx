'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'

import { LocaleProvider } from '@/components/i18n/locale-provider'
import { ViewTransitions } from '@/lib/transition'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProgressProvider
        height="3px"
        color="#e2a500"
        options={{ showSpinner: false, indeterminate: true }}
        shallowRouting
      >
        <LocaleProvider>
          <ViewTransitions>{children}</ViewTransitions>
        </LocaleProvider>
      </ProgressProvider>
    </ThemeProvider>
  )
}
