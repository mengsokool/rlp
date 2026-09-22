'use client'

import { useI18n } from '@/components/i18n/locale-provider'
import { Button } from '@/components/ui/button'
import { localizedHref } from '@/lib/i18n'
import { Link } from '@/lib/transition'

export default function NotFound() {
  const { locale, dictionary } = useI18n()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-8 text-center">
      <div className="rounded-lg border bg-card px-8 py-10 sm:px-14">
        <p className="mb-3 font-mono text-xs text-accent-foreground">HTTP 404</p>
        <h1 className="mb-3 text-4xl font-semibold">{dictionary.notFound.title}</h1>
        <p className="mb-7 max-w-120 text-sm text-muted-foreground">
          {locale === 'th'
            ? 'ไม่พบหน้าที่คุณต้องการในระบบเอกสาร RLP'
            : 'This route is not part of the RLP documentation.'}
        </p>
        <div className="flex items-center">
          <Button variant="default" asChild>
            <Link
              title={dictionary.notFound.returnHome}
              aria-label={dictionary.notFound.returnHome}
              href={localizedHref('/', locale)}
            >
              {dictionary.notFound.returnHome}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
