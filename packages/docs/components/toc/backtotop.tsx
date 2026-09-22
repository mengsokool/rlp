'use client'

import { type ReactElement, useEffect, useRef } from 'react'
import { LuArrowUp } from 'react-icons/lu'

import { useI18n } from '@/components/i18n/locale-provider'

function ScrollToTop() {
  if (typeof window !== 'undefined') {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }
}

export function BackToTop(): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)
  const { dictionary } = useI18n()

  useEffect(() => {
    function toggleVisible() {
      const { scrollTop } = document.documentElement
      if (ref.current) {
        ref.current.classList.toggle('opacity-0', scrollTop < 300)
      }
    }

    window.addEventListener('scroll', toggleVisible)
    return () => {
      window.removeEventListener('scroll', toggleVisible)
    }
  }, [])

  return (
    <button
      ref={ref}
      onClick={ScrollToTop}
      title={dictionary.toc.scrollToTop}
      aria-label={dictionary.toc.scrollToTop}
      type="button"
      className="flex cursor-pointer items-center self-start rounded-md px-2 py-1.5 text-xs text-muted-foreground opacity-0 transition-colors hover:bg-secondary hover:text-foreground"
    >
      <LuArrowUp className="mr-1 inline-block size-3.5 align-middle" />
      <span>{dictionary.toc.scrollToTop}</span>
    </button>
  )
}
