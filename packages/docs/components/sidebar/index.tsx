'use client'

import { LuAlignLeft, LuX } from 'react-icons/lu'

import { useI18n } from '@/components/i18n/locale-provider'
import { Logo } from '@/components/navigation/logo'
import { NavMenu } from '@/components/navigation/navbar'
import { PageMenu } from '@/components/sidebar/pagemenu'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'

export function Sidebar() {
  const { dictionary } = useI18n()

  return (
    <aside
      className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 flex-none flex-col border-border border-r bg-card px-3 py-4 md:flex"
      aria-label={dictionary.common.pageNavigation}
    >
      <ScrollArea className="h-full">
        <PageMenu />
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  const { dictionary } = useI18n()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex cursor-pointer md:hidden"
          aria-label={dictionary.common.menu}
          title={dictionary.common.menu}
        >
          <LuAlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-dvh max-h-dvh flex-col gap-0 overflow-hidden px-0"
        side="left"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{dictionary.common.menu}</DialogTitle>
        <SheetHeader className="flex-row items-center justify-between border-b p-3">
          <SheetClose asChild>
            <Logo />
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={dictionary.common.close}
              title={dictionary.common.close}
            >
              <LuX />
            </Button>
          </SheetClose>
        </SheetHeader>
        <SheetDescription className="sr-only">{dictionary.common.pageNavigation}</SheetDescription>
        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-0 mt-2 flex flex-col gap-2 px-3 pb-6">
            <NavMenu isSheet />
            <Separator className="my-2" />
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
