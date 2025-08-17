'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { setAuthCookies } from '@/lib/cookies'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      router.push(`/${locale}/sign-in?error=oauth_failed`)
      return
    }

    if (!token) {
      console.error('No token received')
      router.push(`/${locale}/sign-in?error=no_token`)
      return
    }

    // Decode JWT token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name || '',
        avatar_url: payload.avatar_url || '',
      }

      // Store auth data in cookies
      setAuthCookies(token, user)

      // Redirect to home page instead of dashboard
      router.push(`/${locale}`)
    } catch (error) {
      console.error('Token decode error:', error)
      router.push(`/${locale}/sign-in?error=invalid_token`)
    }
  }, [searchParams, router, locale])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('auth.processing')}</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
} 