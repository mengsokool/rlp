import Link from 'next/link'
import { LuArrowUpRight } from 'react-icons/lu'

import { type Locale, t } from '@/lib/i18n'
import { GitHubLink } from '@/settings/navigation'

interface FeedbackProps {
  title: string
  slug: string
  locale?: Locale
}

export function Feedback({ slug, title, locale = 'en' }: FeedbackProps) {
  const dictionary = t(locale)
  const feedbackUrl = `${GitHubLink.href}/issues/new?title=Feedback for "${title}"&labels=feedback`
  const editUrl = `${GitHubLink.href}/edit/main/contents/docs/${slug}/index.mdx`

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-2 text-xs font-medium">{dictionary.toc.content}</h3>
      <div className="flex flex-col gap-0.5">
        <Link
          href={feedbackUrl}
          title={dictionary.toc.giveFeedback}
          aria-label={dictionary.toc.giveFeedback}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LuArrowUpRight className="mr-1 inline-block size-3.5" />
          <span>{dictionary.toc.feedback}</span>
        </Link>
        <Link
          href={editUrl}
          title={dictionary.toc.editThisPage}
          aria-label={dictionary.toc.editThisPage}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LuArrowUpRight className="mr-1 inline-block size-3.5" />
          <span>{dictionary.toc.editPage}</span>
        </Link>
      </div>
    </div>
  )
}
