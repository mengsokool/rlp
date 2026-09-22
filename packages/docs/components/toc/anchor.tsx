'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { type MouseEvent } from 'react'

import { useI18n } from '@/components/i18n/locale-provider'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TableAnchorProps {
  tocs: { href: string; level: number; text: string }[]
}

export function TableAnchor({ tocs }: TableAnchorProps) {
  const { dictionary } = useI18n()
  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.startsWith('#') ? href.slice(1) : href
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  if (!tocs.length) return null

  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="px-2 text-xs font-medium">{dictionary.toc.title}</h3>
      <ScrollArea className="pb-3">
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {tocs.map(({ href, level, text }, index) => (
            <Link
              key={`${href}-${index}`}
              href={href}
              title={text}
              aria-label={text}
              scroll={false}
              onClick={(e) => handleSmoothScroll(e, href)}
              className={clsx({
                'rounded-md px-2 py-1.5 transition-colors hover:bg-secondary hover:text-foreground': true,
                'pl-2': level === 2,
                'pl-5': level === 3,
                'pl-8': level === 4,
              })}
            >
              {text}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
