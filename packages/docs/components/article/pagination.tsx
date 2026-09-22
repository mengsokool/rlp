import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { type Locale, localizeDocumentTitle, localizedHref, t } from '@/lib/i18n'
import { getPreviousNext } from '@/lib/markdown'
import { Link } from '@/lib/transition'

interface PaginationProps {
  pathname: string
  locale?: Locale
}

export function Pagination({ pathname, locale = 'en' }: PaginationProps) {
  const res = getPreviousNext(pathname)
  const dictionary = t(locale)

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-border border-t pt-6">
      {res.prev && (
        <Link
          rel="prev"
          href={localizedHref(`/docs${res.prev.href}`, locale)}
          title={`${dictionary.pagination.previous}: ${localizeDocumentTitle(res.prev.href, res.prev.title, locale)}`}
          className="inline-flex min-h-9 items-center justify-center rounded-md border border-input bg-card px-3 py-2 text-xs font-medium no-underline! transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <LuChevronLeft className="mr-1 size-4" />
          <span>{localizeDocumentTitle(res.prev.href, res.prev.title, locale)}</span>
        </Link>
      )}
      {res.next && (
        <Link
          rel="next"
          href={localizedHref(`/docs${res.next.href}`, locale)}
          title={`${dictionary.pagination.next}: ${localizeDocumentTitle(res.next.href, res.next.title, locale)}`}
          className="ml-auto inline-flex min-h-9 items-center justify-center rounded-md border border-input bg-card px-3 py-2 text-xs font-medium no-underline! transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span>{localizeDocumentTitle(res.next.href, res.next.title, locale)}</span>
          <LuChevronRight className="ml-1 size-4" />
        </Link>
      )}
    </div>
  )
}
