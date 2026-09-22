import { type Paths } from '@/lib/pageroutes'

export const locales = ['en', 'th'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย',
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function splitLocalePath(pathname: string): { locale: Locale | null; path: string } {
  const parts = pathname.split('/').filter(Boolean)
  const maybeLocale = parts[0]

  if (isLocale(maybeLocale)) {
    const rest = `/${parts.slice(1).join('/')}`
    return { locale: maybeLocale, path: rest === '/' ? '/' : rest }
  }

  return { locale: null, path: pathname || '/' }
}

export function pathWithLocale(pathname: string, locale: Locale): string {
  const { path } = splitLocalePath(pathname)
  const cleanPath = path === '/' ? '' : path
  return `/${locale}${cleanPath}`
}

export function localizedHref(href: string, locale: Locale): string {
  if (href.startsWith('http')) return href
  const normalized = href.startsWith('/') ? href : `/${href}`
  return pathWithLocale(normalized, locale)
}

const ui = {
  en: {
    navigation: {
      Docs: 'Docs',
      GitHub: 'GitHub',
    },
    common: {
      menu: 'Menu',
      close: 'Close',
      pageNavigation: 'Page navigation',
      documentationHome: 'Documentation Home',
      toggle: 'Toggle',
      toggleTheme: 'Toggle theme',
      switchLanguage: 'Switch language',
    },
    search: {
      label: 'Search',
      placeholder: 'Search',
      dialogPlaceholder: 'Search...',
      minCharacters: 'Please enter at least 3 characters.',
      searching: 'Searching...',
      noResults: (query: string) => `No results found for "${query}"`,
    },
    toc: {
      title: 'On this page',
      content: 'Content',
      feedback: 'Feedback',
      giveFeedback: 'Give Feedback',
      editPage: 'Edit page',
      editThisPage: 'Edit this page',
      scrollToTop: 'Scroll to top',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
    },
    home: {
      tagline: 'A compact binary TCP protocol for direct IoT device communication.',
      description:
        'Raina Link Protocol (RLP) is designed for devices that just need to talk to a server. Zero broker overhead, numeric channels, persistent 1:1 TCP sessions, and sub-millisecond event loop latency.',
      getStarted: 'Read Documentation',
      previewAlt: 'Raina Link Protocol architecture and wire framing diagram',
      features: [
        'Fixed 4-byte frame header',
        'Direct 1:1 client-server topology',
        'Zero broker / pub-sub overhead',
        'Validated for 10,000+ persistent connections',
      ],
    },
    notFound: {
      title: 'Page not found',
      returnHome: 'Return Home',
    },
    category: {
      description: 'Explore the technical topics in this section.',
      topics: 'Topics in this section',
    },
  },
  th: {
    navigation: {
      Docs: 'เอกสาร',
      GitHub: 'GitHub',
    },
    common: {
      menu: 'เมนู',
      close: 'ปิด',
      pageNavigation: 'เมนูหน้าเอกสาร',
      documentationHome: 'หน้าแรกเอกสาร',
      toggle: 'เปิด/ปิด',
      toggleTheme: 'เปลี่ยนธีม',
      switchLanguage: 'เปลี่ยนภาษา',
    },
    search: {
      label: 'ค้นหา',
      placeholder: 'ค้นหา',
      dialogPlaceholder: 'ค้นหา...',
      minCharacters: 'กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร',
      searching: 'กำลังค้นหา...',
      noResults: (query: string) => `ไม่พบผลลัพธ์สำหรับ "${query}"`,
    },
    toc: {
      title: 'ในหน้านี้',
      content: 'เนื้อหา',
      feedback: 'แจ้งปัญหา',
      giveFeedback: 'แจ้งปัญหา',
      editPage: 'แก้ไขหน้านี้',
      editThisPage: 'แก้ไขหน้านี้',
      scrollToTop: 'กลับขึ้นด้านบน',
    },
    pagination: {
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
    },
    home: {
      tagline: 'ไบนารีโปรโตคอลขนาดกะทัดรัดสำหรับอุปกรณ์ IoT คุยกับเซิร์ฟเวอร์โดยตรง',
      description:
        'Raina Link Protocol (RLP) ออกแบบมาเพื่ออุปกรณ์ที่ต้องการสื่อสารกับเซิร์ฟเวอร์โดยตรงผ่าน TCP ตัด Broker overhead ออกทั้งหมด ใช้ Numeric Channels และประหยัดทรัพยากรระดับ Microsecond',
      getStarted: 'อ่านเอกสารข้อกำหนด',
      previewAlt: 'แผนผังสถาปัตยกรรมและการเข้ารหัสเฟรมของ Raina Link Protocol',
      features: [
        'Header คงที่เพียง 4 ไบต์',
        'สถาปัตยกรรม Client-Server 1:1 โดยตรง',
        'ไม่มี Overhead ของ Broker หรือ Pub/Sub',
        'ผ่านการทดสอบ 10,000 Concurrent Connections',
      ],
    },
    notFound: {
      title: 'ไม่พบหน้านี้',
      returnHome: 'กลับหน้าแรก',
    },
    category: {
      description: 'เลือกหัวข้อทางเทคนิคที่คุณต้องการศึกษาในหมวดนี้',
      topics: 'หัวข้อในหมวดนี้',
    },
  },
} as const

const documentTitles: Record<Locale, Record<string, string>> = {
  en: {},
  th: {
    '/': 'ภาพรวมและสถาปัตยกรรม',
    '/getting-started': 'เริ่มต้นใช้งาน',
    '/spec': 'ข้อกำหนดโปรโตคอล',
    '/spec/framing': 'โครงสร้างเฟรมและการจัดการ Stream',
    '/spec/data-types': 'ชนิดข้อมูล Value Types',
    '/spec/packets': 'รายการ Packet Types ทั้งหมด',
    '/spec/lifecycle': 'วงจรการเชื่อมต่อและ State Machine',
    '/spec/errors': 'รหัสข้อผิดพลาดและการจัดการ Error',
    '/examples': 'ตัวอย่างบนสายสัญญาณ',
    '/examples/wire-frames': 'ตัวอย่างเฟรมและ Hex Dumps',
    '/examples/session-trace': 'ลำดับการทำงานตลอดทั้ง Session',
    '/implementation': 'การนำไปพัฒนา',
    '/implementation/embedded-c': 'คู่มือฝั่ง Embedded C Client',
    '/implementation/conformance': 'เกณฑ์การตรวจสอบความสอดคล้อง',
    '/benchmarks': 'ประสิทธิภาพและการทดสอบ',
    '/benchmarks/results': 'ผลการทดสอบโหลดและ Capacity',
  },
}

const categoryTitles: Record<Locale, Record<string, string>> = {
  en: {},
  th: {
    Overview: 'ภาพรวม',
    'Protocol Specification': 'ข้อกำหนดโปรโตคอล',
    'Wire Examples': 'ตัวอย่างบนสายสัญญาณ',
    Implementation: 'การนำไปพัฒนา',
    Performance: 'ประสิทธิภาพ',
  },
}

const categoryDescriptions: Record<Locale, Record<string, string>> = {
  en: {
    '/spec': 'Detailed wire format, framing, value types, packets, and state transition rules.',
    '/examples': 'Concrete hexadecimal packet dumps and end-to-end conversation traces.',
    '/implementation': 'Guides and checklists for building independent clients and servers.',
    '/benchmarks': 'Load testing methodology, capacity metrics, and resource footprints.',
  },
  th: {
    '/spec': 'ข้อกำหนดโครงสร้างเฟรมระดับไบต์ ชนิดข้อมูล แพ็กเก็ต และ State Machine อย่างละเอียด',
    '/examples': 'ตัวอย่าง Hex dump ของทุกแพ็กเก็ต และลำดับขั้นตอนการรับส่งจริงตลอดทั้ง Session',
    '/implementation': 'คู่มือและเกณฑ์ Checklist สำหรับการสร้าง Client และ Server แบบอิสระ',
    '/benchmarks': 'ระเบียบวิธีการทดสอบโหลด สถิติด้าน Throughput และการใช้ Memory ในสภาพแวดล้อมจริง',
  },
}

export function t(locale: Locale) {
  return ui[locale]
}

export function localizeDocumentTitle(href: string, title: string, locale: Locale): string {
  return documentTitles[locale][href] ?? title
}

export function localizeNavigationTitle(title: string, locale: Locale): string {
  const translated = ui[locale].navigation[title as keyof (typeof ui)[Locale]['navigation']]
  return translated ?? title
}

export function localizeCategoryTitle(title: string, locale: Locale): string {
  return categoryTitles[locale][title] ?? title
}

export function getCategoryDescription(href: string, locale: Locale): string {
  return categoryDescriptions[locale][href] ?? ui[locale].category.description
}

export function getCategoryTopicsTitle(locale: Locale): string {
  return ui[locale].category.topics
}

export function localizeRouteTree(items: Paths[], locale: Locale, basePath = ''): Paths[] {
  return items.map((item) => {
    if ('spacer' in item) {
      return item
    }

    const currentHref = item.href ? `${basePath}${item.href}` : basePath
    const title = localizeDocumentTitle(currentHref, item.title, locale)
    const heading = item.heading ? localizeCategoryTitle(item.heading, locale) : undefined

    return {
      ...item,
      title,
      ...(heading !== undefined ? { heading } : {}),
      ...(item.items ? { items: localizeRouteTree(item.items, locale, currentHref) } : {}),
    }
  })
}
