import { LuArrowRight } from 'react-icons/lu'

import { type Locale, localizeDocumentTitle, localizedHref, localizeRouteTree, t } from '@/lib/i18n'
import { type Paths } from '@/lib/pageroutes'
import { Link } from '@/lib/transition'

function isRoute(item: Paths): item is Extract<Paths, { title: string; href: string }> {
  return 'title' in item && 'href' in item
}

interface CategoryOverviewProps {
  title: string
  href: string
  items: Paths[]
  locale: Locale
}

export function CategoryOverview({ title, href, items, locale }: CategoryOverviewProps) {
  const dictionary = t(locale)
  const localizedItems = localizeRouteTree(items, locale, href).filter(isRoute)

  return (
    <div className="mt-7">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-foreground">{dictionary.category.topics}</h2>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        {localizedItems.map((item) => {
          const fullHref = `${href}${item.href}`
          return (
            <Link
              key={fullHref}
              href={localizedHref(`/docs${fullHref}`, locale)}
              className="group flex min-h-11 items-center justify-between border-border border-b px-4 py-3 text-sm no-underline! transition-colors last:border-b-0 hover:bg-secondary"
            >
              <span className="font-normal text-foreground group-hover:text-accent-foreground">
                {localizeDocumentTitle(fullHref, item.title, locale)}
              </span>
              <LuArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent-foreground" />
            </Link>
          )
        })}
      </div>
      <p className="sr-only">{title}</p>
    </div>
  )
}
