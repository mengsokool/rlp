'use client'

import { useState } from 'react'
import { LuArrowRight, LuCheck, LuCopy } from 'react-icons/lu'

import { buttonVariants } from '@/components/ui/button'
import { type Locale, localizedHref, t } from '@/lib/i18n'
import { Link } from '@/lib/transition'

export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = t(locale)
  const [copied, setCopied] = useState(false)

  const copyInstall = async () => {
    await navigator.clipboard.writeText('pnpm add @raina-iot/rlp')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-between bg-card text-foreground">
      {/* Hero Section */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 pt-4 pb-8 text-center sm:px-6 sm:pt-8 sm:pb-12">
        {/* Massive RLP Typography */}
        <div className="select-none font-mono text-7xl font-black tracking-[-0.05em] text-foreground sm:text-8xl md:text-9xl lg:text-[10.5rem] leading-none mb-3 sm:mb-4">
          RLP
        </div>

        {/* Primary Headline */}
        <h1 className="max-w-2xl text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {locale === 'th'
            ? 'โปรโตคอลสำหรับอุปกรณ์ที่แค่ต้องการคุยกับเซิร์ฟเวอร์ตรงๆ'
            : 'A protocol for devices that just need to talk to a server.'}
        </h1>

        {/* Crisp Subtitle */}
        <p className="mt-3 max-w-xl text-balance text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {locale === 'th'
            ? 'Raina Link Protocol (RLP) คือไบนารีโปรโตคอลขนาดกะทัดรัดบน Persistent TCP ที่มี Header คงที่เพียง 4 ไบต์ และตัดความซับซ้อนของ Broker ออกทั้งหมด'
            : 'A compact binary protocol over persistent TCP with a fixed 4-byte header, numeric channels, and zero broker overhead.'}
        </p>

        {/* Action Group */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localizedHref('/docs', locale)}
            className={buttonVariants({ size: 'default' })}
          >
            {dictionary.home.getStarted}
            <LuArrowRight data-icon="inline-end" />
          </Link>

          <button
            type="button"
            onClick={copyInstall}
            className="group inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 font-mono text-xs text-foreground transition-colors hover:bg-muted"
            title="Copy install command"
          >
            <span className="text-muted-foreground">$</span>
            <span>pnpm add @raina-iot/rlp</span>
            {copied ? (
              <LuCheck className="size-3.5 text-emerald-500" />
            ) : (
              <LuCopy className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
            )}
          </button>
        </div>

        {/* Centerpiece: The Wire-First Frame Diagram */}
        <div className="mt-8 w-full max-w-2xl sm:mt-10">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>WIRE FORMAT</span>
            <span>BIG-ENDIAN · NETWORK BYTE ORDER</span>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-background text-left shadow-xs sm:text-center">
            {/* Header Byte Offsets */}
            <div className="grid grid-cols-4 border-b border-border bg-muted/40 font-mono text-[10px] text-muted-foreground">
              <div className="border-r border-border px-2 py-1.5">Byte 0</div>
              <div className="border-r border-border px-2 py-1.5">Byte 1</div>
              <div className="border-r border-border px-2 py-1.5">Bytes 2 – 3</div>
              <div className="px-2 py-1.5">Bytes 4+</div>
            </div>

            {/* Field Names and Types */}
            <div className="grid grid-cols-4 items-stretch divide-x divide-border font-mono text-xs">
              <div className="flex flex-col items-center justify-center p-3">
                <span className="font-semibold text-foreground">Type</span>
                <span className="mt-1 text-[10px] text-muted-foreground">u8</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3">
                <span className="font-semibold text-foreground">Flags</span>
                <span className="mt-1 text-[10px] text-muted-foreground">u8</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3">
                <span className="font-semibold text-foreground">Payload Length</span>
                <span className="mt-1 text-[10px] text-muted-foreground">u16be</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-muted/20 p-3">
                <span className="font-semibold text-foreground">Payload Data</span>
                <span className="mt-1 text-[10px] text-muted-foreground">0 – 65,535 B</span>
              </div>
            </div>

            {/* Sub-label banner */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
              <span>◄ Fixed 4-byte Header ►</span>
              <span>Variable Data Payload ►</span>
            </div>
          </div>
        </div>
      </div>

      {/* Understated Minimalist Tenets */}
      <footer className="border-t border-border/60 py-3.5 sm:py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-primary" />
            {locale === 'th' ? 'การเชื่อมต่อ Client-Server 1:1' : 'Direct 1:1 Connection'}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-primary" />
            {locale === 'th' ? 'Header คงที่เพียง 4 ไบต์' : '4-Byte Fixed Header'}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-primary" />
            {locale === 'th' ? 'ไม่มี Broker หรือ Pub-Sub Overhead' : 'Zero Broker Overhead'}
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-primary" />
            {locale === 'th' ? 'ทดสอบแล้ว 10,000+ อุปกรณ์' : '10,000+ Tested Connections'}
          </span>
        </div>
      </footer>
    </main>
  )
}
