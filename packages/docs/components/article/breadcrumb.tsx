import { Fragment } from 'react'
import { LuHouse } from 'react-icons/lu'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { type Locale, localizeDocumentTitle, localizedHref, t } from '@/lib/i18n'
import { Link } from '@/lib/transition'
import { toTitleCase } from '@/utils/toTitleCase'

interface BreadcrumbProps {
  paths: string[]
  locale?: Locale
}

function breadcrumbTitle(paths: string[], index: number, locale: Locale) {
  const href = `/${paths.slice(0, index + 1).join('/')}`
  return localizeDocumentTitle(href, toTitleCase(paths[index]), locale)
}

export function ArticleBreadcrumb({ paths, locale = 'en' }: BreadcrumbProps) {
  const dictionary = t(locale)

  return (
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              title={dictionary.common.documentationHome}
              aria-label={dictionary.common.documentationHome}
              href={localizedHref('/docs', locale)}
            >
              <LuHouse className="size-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.length > 2 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  title={toTitleCase(paths[0])}
                  aria-label={breadcrumbTitle(paths, 0, locale)}
                  href={localizedHref(`/docs/${paths[0]}`, locale)}
                >
                  {breadcrumbTitle(paths, 0, locale)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="h-1" />
            </BreadcrumbItem>

            {paths.slice(-1).map((path, i) => {
              const index = paths.length - 1 + i
              const href = `/docs/${paths.slice(0, index + 1).join('/')}`

              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index < paths.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link
                          title={breadcrumbTitle(paths, index, locale)}
                          aria-label={breadcrumbTitle(paths, index, locale)}
                          href={localizedHref(href, locale)}
                        >
                          {breadcrumbTitle(paths, index, locale)}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumbTitle(paths, index, locale)}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </>
        ) : (
          paths.map((path, index) => {
            const href = `/docs/${paths.slice(0, index + 1).join('/')}`

            return (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index < paths.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link
                        title={breadcrumbTitle(paths, index, locale)}
                        aria-label={breadcrumbTitle(paths, index, locale)}
                        href={localizedHref(href, locale)}
                      >
                        {breadcrumbTitle(paths, index, locale)}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="b">
                      {breadcrumbTitle(paths, index, locale)}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
