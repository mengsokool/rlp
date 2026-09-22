'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { LuFileText, LuSearch } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { useI18n } from '@/components/i18n/locale-provider'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  localizeDocumentTitle,
  localizedHref,
  localizeRouteTree,
  splitLocalePath,
} from '@/lib/i18n'
import { advanceSearch, cn, debounce, highlight, type search } from '@/lib/utils'
import { Documents } from '@/settings/documents'

interface Document {
  title?: string
  href?: string
  spacer?: boolean
  items?: Document[]
  noLink?: boolean
}

export function Search() {
  const { locale, dictionary } = useI18n()
  const [searchedInput, setSearchedInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<search[]>([])

  const debounceSearch = useMemo(
    () =>
      debounce((input) => {
        setIsLoading(true)
        const results = advanceSearch(input.trim(), locale)
        setResults(results)
        setIsLoading(false)
      }, 300),
    [locale]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Enter' && results.length > 2) {
        const selected = results[0]
        if ('href' in selected) {
          window.location.href = localizedHref(`/docs${selected.href}`, locale)
          setIsOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, results, locale])

  useEffect(() => {
    if (searchedInput.length < 3) {
      Promise.resolve().then(() => setResults([]))
      return
    }

    debounceSearch(searchedInput)
  }, [searchedInput, debounceSearch])

  function renderDocuments(documents: Document[], parentHref = '/docs'): ReactNode[] {
    if (!Array.isArray(documents) || documents.length === 0) {
      return []
    }

    return documents.flatMap((doc) => {
      if ('spacer' in doc && doc.spacer) {
        return []
      }

      const href = doc.href ? `${parentHref}${doc.href}` : ''
      const routeHref = splitLocalePath(href).path.replace(/^\/docs/, '')

      return [
        !doc.noLink && doc.href && (
          <DialogClose key={href} asChild>
            <Anchor
              className={cn(
                'flex min-h-10 w-full items-center gap-2.5 rounded-md px-3 text-sm transition-colors hover:bg-secondary'
              )}
              href={localizedHref(href, locale)}
            >
              <div className="flex h-full w-fit items-center gap-1.5 py-3 whitespace-nowrap">
                <LuFileText className="h-[1.1rem] w-[1.1rem]" />{' '}
                {localizeDocumentTitle(routeHref, doc.title ?? '', locale)}
              </div>
            </Anchor>
          </DialogClose>
        ),

        ...renderDocuments(doc.items?.filter((item) => !item.noLink) || [], href || parentHref),
      ]
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setTimeout(() => setSearchedInput(''), 200)
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="relative w-full sm:max-w-xs flex-1 cursor-pointer">
          <LuSearch className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 w-full bg-secondary pr-4 pl-9 text-xs shadow-none sm:w-64 lg:w-80"
            placeholder={dictionary.search.placeholder}
            type="search"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="top-[42%] max-w-xs gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">{dictionary.search.label}</DialogTitle>
        <DialogHeader>
          <input
            value={searchedInput}
            onChange={(e) => setSearchedInput(e.target.value)}
            placeholder={dictionary.search.dialogPlaceholder}
            autoFocus
            className="h-12 border-b bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          />
        </DialogHeader>

        {searchedInput.length > 0 && searchedInput.length < 3 && (
          <p className="mx-auto mt-3 text-xs text-accent-foreground">
            {dictionary.search.minCharacters}
          </p>
        )}

        {isLoading ? (
          <p className="mx-auto mt-3 text-xs text-muted-foreground">
            {dictionary.search.searching}
          </p>
        ) : (
          results.length === 0 &&
          searchedInput.length >= 3 && (
            <p className="mx-auto mt-3 text-xs text-muted-foreground">
              {dictionary.search.noResults(searchedInput)}
            </p>
          )
        )}

        <ScrollArea className="max-h-87.5 w-full overflow-hidden">
          <div className="flex w-full flex-col items-start px-1 pt-1 pb-4 sm:px-3">
            {searchedInput
              ? results.map((item) => {
                  if ('href' in item) {
                    return (
                      <DialogClose key={item.href} asChild>
                        <Anchor
                          className={cn(
                            'flex w-full max-w-77.5 flex-col gap-0.5 rounded-md p-3 text-sm transition-colors hover:bg-secondary sm:max-w-120'
                          )}
                          href={localizedHref(`/docs${item.href}`, locale)}
                        >
                          <div className="flex h-full items-center gap-x-2">
                            <LuFileText className="h-[1.1rem] w-[1.1rem]" />
                            <span className="truncate">
                              {localizeDocumentTitle(item.href, item.title, locale)}
                            </span>
                          </div>
                          {'snippet' in item && item.snippet && (
                            <p
                              className="truncate text-xs text-muted-foreground"
                              dangerouslySetInnerHTML={{
                                __html: highlight(item.snippet, searchedInput),
                              }}
                            />
                          )}
                        </Anchor>
                      </DialogClose>
                    )
                  }
                  return null
                })
              : renderDocuments(localizeRouteTree(Documents, locale))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
