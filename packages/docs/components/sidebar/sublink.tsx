import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { useI18n } from '@/components/i18n/locale-provider'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SheetClose } from '@/components/ui/sheet'
import { localizedHref, splitLocalePath } from '@/lib/i18n'
import { type Paths } from '@/lib/pageroutes'
import { cn } from '@/lib/utils'

function isRoute(item: Paths): item is Extract<Paths, { title: string; href: string }> {
  return 'title' in item && 'href' in item
}

export function SubLink(props: Paths & { level: number; isSheet: boolean }) {
  const path = usePathname()
  const { locale, dictionary } = useI18n()
  const routePath = splitLocalePath(path).path
  const currentItemPath = isRoute(props) ? splitLocalePath(props.href).path : ''
  const childPaths =
    isRoute(props) && props.items
      ? props.items.filter(isRoute).map((item) => splitLocalePath(`${props.href}${item.href}`).path)
      : []
  const isCurrentBranch =
    (currentItemPath === '/docs' && routePath === '/docs') ||
    childPaths.some((childPath) => routePath === childPath || routePath.startsWith(`${childPath}/`))
  const [isOpen, setIsOpen] = useState(isCurrentBranch)

  useEffect(() => {
    if (isCurrentBranch) {
      Promise.resolve().then(() => setIsOpen(true))
    }
  }, [isCurrentBranch])

  if (!isRoute(props)) return

  const { title, href, items, noLink, level, isSheet } = props

  const Comp = (
    <Anchor
      activeClassName="text-accent-foreground"
      className="px-2 py-1 text-xs font-medium text-foreground transition-colors duration-150 hover:text-accent-foreground"
      href={href}
    >
      {title}
    </Anchor>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="px-2 pt-2 pb-1 text-[11px] font-medium text-muted-foreground">{title}</h2>
  )

  if (!items) {
    const linkElement = (
      <Anchor
        activeClassName="bg-accent text-accent-foreground font-medium"
        className="flex min-h-9 w-full items-center rounded-md px-3 py-2 text-xs font-normal text-foreground transition-colors duration-150 hover:bg-secondary"
        href={href}
      >
        {title}
      </Anchor>
    )

    return (
      <div className="flex flex-col text-sm w-full">
        {isSheet ? <SheetClose asChild>{linkElement}</SheetClose> : linkElement}
      </div>
    )
  }

  if (noLink) {
    return (
      <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex min-h-8 w-full cursor-pointer items-center rounded-md px-2 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-expanded={isOpen}
          >
            <span>{title}</span>
            {isOpen ? (
              <LuChevronDown className="ml-auto size-3.5" aria-hidden="true" />
            ) : (
              <LuChevronRight className="ml-auto size-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">{dictionary.common.toggle}</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <div className="mt-1 flex flex-col gap-0.5 pl-2">
            {items.map((innerLink) => {
              if (!isRoute(innerLink)) return null

              const modifiedItems = {
                ...innerLink,
                href: localizedHref(`${splitLocalePath(href).path}${innerLink.href}`, locale),
                level: level + 1,
                isSheet,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {noLink ? (
          <CollapsibleTrigger asChild>
            <div className="flex cursor-pointer select-none items-center gap-2 rounded-md py-1 text-xs transition-colors duration-150 hover:bg-secondary">
              {titleOrLink}
              <div className="ml-auto mr-1 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary">
                {!isOpen ? (
                  <LuChevronRight className="size-3.5" />
                ) : (
                  <LuChevronDown className="size-3.5" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            {titleOrLink}
            <CollapsibleTrigger asChild>
              <Button className="ml-auto" variant="ghost" size="icon-xs">
                {!isOpen ? (
                  <LuChevronRight className="text-muted-foreground" />
                ) : (
                  <LuChevronDown className="text-muted-foreground" />
                )}
                <span className="sr-only">{dictionary.common.toggle}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        )}
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              'mt-1 flex flex-col items-start gap-0.5 pl-2 text-xs',
              level > 0 && 'ml-2'
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) {
                return null
              }

              const modifiedItems = {
                ...innerLink,
                href: localizedHref(`${splitLocalePath(href).path}${innerLink.href}`, locale),
                level: level + 1,
                isSheet,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
