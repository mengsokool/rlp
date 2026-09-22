'use client'

import { LuArrowUpRight } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { useI18n } from '@/components/i18n/locale-provider'
import { Logo } from '@/components/navigation/logo'
import { Search } from '@/components/navigation/search'
import { SheetLeft } from '@/components/sidebar'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { SheetClose } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { localizedHref, localizeNavigationTitle } from '@/lib/i18n'
import { Navigations } from '@/settings/navigation'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 mx-auto flex h-14 w-full items-center justify-between gap-3 border-b bg-card px-3 md:px-4">
      <div className="flex items-center gap-4">
        <SheetLeft />
        <div className="hidden md:block">
          <Logo />
        </div>
        <div className="hidden items-center gap-1 text-xs font-medium text-muted-foreground md:flex">
          <NavMenu />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Search />
        <div className="flex gap-1.5">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  const { locale } = useI18n()

  return (
    <>
      {Navigations.map((item) => {
        const title = localizeNavigationTitle(item.title, locale)
        const Comp = (
          <Anchor
            key={item.title + item.href}
            absolute
            activeClassName="bg-accent text-accent-foreground"
            className="flex h-8 items-center gap-1 rounded-md px-2.5 text-xs transition-colors hover:bg-secondary hover:text-foreground"
            href={localizedHref(item.href, locale)}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
          >
            {title}{' '}
            {item.external && <LuArrowUpRight className="size-3.5 align-super" strokeWidth={2} />}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
