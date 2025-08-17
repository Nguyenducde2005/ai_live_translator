import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales } from './i18n/config'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/workspaces', '/glossaries']
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/sign-in', '/sign-up']

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'ja',
  localePrefix: 'always'
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Check if user is authenticated
  const isAuthenticated = !!token

  // Skip middleware for static files
  if (pathname.startsWith('/static/') || pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  // Redirect root path to locale from cookie if available, else fallback to /ja
  if (pathname === '/') {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    if (cookieLocale && ['vi', 'en', 'ja'].includes(cookieLocale)) {
      return NextResponse.redirect(new URL(`/${cookieLocale}`, request.url))
    }
    return NextResponse.redirect(new URL('/ja', request.url))
  }

  // Handle internationalization first
  const response = intlMiddleware(request)

  // Only apply auth redirects after i18n middleware
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en|ja)/, '')

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathnameWithoutLocale) && isAuthenticated) {
    // Extract current locale from pathname
    const currentLocale = pathname.match(/^\/(vi|en|ja)/)?.[1] || 'ja'
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
  }

  // Redirect unauthenticated users to sign-in
  if (protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route)) && !isAuthenticated) {
    // Extract current locale from pathname
    const currentLocale = pathname.match(/^\/(vi|en|ja)/)?.[1] || 'ja'
    return NextResponse.redirect(new URL(`/${currentLocale}/sign-in`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 