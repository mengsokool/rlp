import { notFound } from 'next/navigation'

import { ArticleBreadcrumb } from '@/components/article/breadcrumb'
import { CategoryOverview } from '@/components/article/category-overview'
import { Pagination } from '@/components/article/pagination'
import { TableOfContents } from '@/components/toc'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import {
  getCategoryDescription,
  isLocale,
  localizeDocumentTitle,
  localizedHref,
  normalizeLocale,
} from '@/lib/i18n'
import { getDocument } from '@/lib/markdown'
import { AllPageRoutes, findRouteByHref } from '@/lib/pageroutes'
import { Settings } from '@/types/settings'

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>
}

export default async function LocalizedPages({ params }: PageProps) {
  const { locale: rawLocale, slug = [] } = await params
  if (!isLocale(rawLocale)) notFound()

  const locale = normalizeLocale(rawLocale)
  const pathName = slug.join('/')
  const routeHref = `/${pathName}`
  const route = findRouteByHref(routeHref)

  if (route?.noLink && route.items) {
    const title = localizeDocumentTitle(routeHref, route.title, locale)
    const description = getCategoryDescription(routeHref, locale)

    return (
      <div className="flex w-full min-w-0 items-start gap-6">
        <section className="mb-6 min-w-0 flex-1 rounded-none border-y bg-card px-5 py-6 sm:rounded-lg sm:border sm:px-8 sm:py-8 lg:px-10">
          <ArticleBreadcrumb paths={slug} locale={locale} />
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-foreground sm:text-[28px]">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
            <Separator />
          </div>
          <CategoryOverview title={title} href={routeHref} items={route.items} locale={locale} />
        </section>
      </div>
    )
  }

  const res = await getDocument(pathName, locale)

  if (!res) notFound()

  const { frontmatter, content, tocs } = res
  const title = localizeDocumentTitle(`/${pathName}`, frontmatter.title, locale)

  return (
    <div className="flex w-full min-w-0 items-start gap-6">
      <section className="mb-6 min-w-0 flex-1 rounded-none border-y bg-card px-5 py-6 sm:rounded-lg sm:border sm:px-8 sm:py-8 lg:px-10">
        <ArticleBreadcrumb paths={slug} locale={locale} />
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-foreground sm:text-[28px]">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>
          <Separator />
        </div>
        <Typography>
          <section>{content}</section>
          <Pagination pathname={pathName} locale={locale} />
        </Typography>
      </section>
      <TableOfContents
        tocs={{ tocs }}
        pathName={pathName}
        frontmatter={{ title }}
        locale={locale}
      />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: rawLocale, slug = [] } = await params
  if (!isLocale(rawLocale)) return null

  const locale = normalizeLocale(rawLocale)
  const pathName = slug.join('/')
  const routeHref = `/${pathName}`
  const route = findRouteByHref(routeHref)

  if (route?.noLink) {
    const title = localizeDocumentTitle(routeHref, route.title, locale)
    const description = getCategoryDescription(routeHref, locale)

    return {
      title: `${title} - ${Settings.title}`,
      description,
      openGraph: {
        title: `${title} - ${Settings.openGraph.title}`,
        description,
        url: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, locale)}`,
        siteName: Settings.openGraph.siteName,
        type: 'article',
        images: Settings.openGraph.images.map((image) => ({
          ...image,
          url: `${Settings.metadataBase}${image.url}`,
        })),
      },
      alternates: {
        canonical: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, locale)}`,
        languages: {
          en: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, 'en')}`,
          th: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, 'th')}`,
        },
      },
    }
  }

  const res = await getDocument(pathName, locale)

  if (!res) return null

  const { frontmatter, lastUpdated } = res
  const title = localizeDocumentTitle(`/${pathName}`, frontmatter.title, locale)

  return {
    title: `${title} - ${Settings.title}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    ...(lastUpdated && {
      lastModified: new Date(lastUpdated).toISOString(),
    }),
    openGraph: {
      title: `${title} - ${Settings.openGraph.title}`,
      description: frontmatter.description || Settings.openGraph.description,
      url: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, locale)}`,
      siteName: Settings.openGraph.siteName,
      type: 'article',
      images: Settings.openGraph.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    twitter: {
      title: `${title} - ${Settings.twitter.title}`,
      description: frontmatter.description || Settings.twitter.description,
      card: Settings.twitter.card,
      site: Settings.twitter.site,
      images: Settings.twitter.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    alternates: {
      canonical: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, locale)}`,
      languages: {
        en: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, 'en')}`,
        th: `${Settings.metadataBase}${localizedHref(`/docs/${pathName}`, 'th')}`,
      },
    },
  }
}

export function generateStaticParams() {
  return ['en', 'th'].flatMap((locale) =>
    AllPageRoutes.filter((item) => item.href).map((item) => ({
      locale,
      slug: item.href.split('/').slice(1),
    }))
  )
}
