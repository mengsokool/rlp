import { TableAnchor, type TableAnchorProps } from '@/components/toc/anchor'
import { BackToTop } from '@/components/toc/backtotop'
import { Feedback } from '@/components/toc/feedback'
import { type Locale } from '@/lib/i18n'
import { Settings } from '@/types/settings'

interface TableProps {
  tocs: TableAnchorProps
  pathName: string
  frontmatter: { title: string }
  locale?: Locale
}

export function TableOfContents({ tocs, pathName, frontmatter, locale = 'en' }: TableProps) {
  return (
    <>
      {Settings.rightbar && (
        <aside
          className="toc sticky top-20 hidden h-[calc(100vh-6rem)] w-52 flex-none gap-5 px-1 py-2 xl:flex xl:flex-col"
          aria-label="Table of contents"
        >
          {Settings.toc && <TableAnchor tocs={tocs.tocs} />}
          {Settings.feedback && (
            <Feedback slug={pathName} title={frontmatter.title} locale={locale} />
          )}
          {Settings.totop && <BackToTop />}
        </aside>
      )}
    </>
  )
}
