'use client'

import { usePathname } from 'next/navigation'

import { useI18n } from '@/components/i18n/locale-provider'
import { SubLink } from '@/components/sidebar/sublink'
import { Separator } from '@/components/ui/separator'
import { localizedHref, localizeRouteTree, splitLocalePath } from '@/lib/i18n'
import { Routes } from '@/lib/pageroutes'

export function PageMenu({ isSheet = false }) {
  const path = usePathname()
  const { locale } = useI18n()
  const routePath = splitLocalePath(path).path
  const routes = localizeRouteTree(Routes, locale)

  if (!routePath.startsWith('/docs')) return null

  return (
    <div className="flex flex-col gap-1 pb-6">
      {routes.map((item, index) => {
        if ('spacer' in item) {
          return <Separator key={`spacer-${index}`} className="my-3" />
        }

        return (
          <div key={item.title + index} className="flex flex-col gap-1">
            {item.heading && item.heading !== item.title && (
              <div className="mt-3 mb-1 px-2 text-[11px] font-medium text-muted-foreground">
                {item.heading}
              </div>
            )}
            <SubLink
              {...{
                ...item,
                href: localizedHref(`/docs${item.href}`, locale),
                level: 0,
                isSheet,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
