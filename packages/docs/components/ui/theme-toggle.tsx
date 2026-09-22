'use client'

import { useTheme } from 'next-themes'
import { RxMoon, RxSun } from 'react-icons/rx'

import { useI18n } from '@/components/i18n/locale-provider'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { dictionary } = useI18n()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="size-8 cursor-pointer"
      title={dictionary.common.toggleTheme}
      aria-label={dictionary.common.toggleTheme}
    >
      <RxSun className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <RxMoon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{dictionary.common.toggleTheme}</span>
    </Button>
  )
}
