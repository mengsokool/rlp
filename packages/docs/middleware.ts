import { type NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'th']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only intercept the root path '/' to perform instant server-side redirect
  if (pathname === '/') {
    // 1. Check cookies for saved locale preference
    const cookieLocale = request.cookies.get('rlp-docs-locale')?.value

    if (cookieLocale && locales.includes(cookieLocale)) {
      return NextResponse.redirect(new URL(`/${cookieLocale}`, request.url))
    }

    // 2. Check Accept-Language header for browser language settings
    const acceptLanguage = request.headers.get('accept-language') || ''
    const prefersThai = acceptLanguage.toLowerCase().includes('th')
    const targetLocale = prefersThai ? 'th' : defaultLocale

    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
