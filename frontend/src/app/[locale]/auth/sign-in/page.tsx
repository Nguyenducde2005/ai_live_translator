'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { APP_CONSTANTS } from '@/lib/constants/app'
import { GoogleOAuthButton } from '@/components/GoogleOAuthButton'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const { login, isLoading, error, clearError } = useAuth()
  const { t, locale } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleGoogleError = (error: any) => {
    console.error('Google OAuth error:', error)
    // You can show a notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('auth.backToHome')}
        </Link>

        {/* Sign In Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
          <div className="text-center mb-8">
            {/* Logo - Clickable to home */}
            <div className="flex justify-center mb-6">
              <Link href={`/${locale}`} className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-20 h-20 flex items-center justify-center">
                  {/* New SVG Logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.56073 31" className="w-16 h-16">
                    <path d="M29.79845,3.68473h-.08013a1.7105,1.7105,0,0,0-1.76224,1.6822V16.74162a1.66182,1.66182,0,0,0,1.68215,1.76223h.16022a1.77791,1.77791,0,0,0,1.76228-1.76223V5.447A1.77792,1.77792,0,0,0,29.79845,3.68473Z" fill="#ed2647"/>
                    <rect x="14.01808" y="3.68473" width="3.60465" height="23.63048" rx="1.76228" fill="#ed2647"/>
                    <rect y="12.4961" width="3.60465" height="14.81912" rx="1.76228" fill="#ed2647"/>
                    <path d="M22.90953,0h-.16016a1.77792,1.77792,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77792,0,0,0,22.90953,0Z" fill="#ed2647"/>
                    <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228" fill="#ed2647"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{APP_CONSTANTS.WEBSITE_NAME}</h2>
                </div>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-gray-600">{t('auth.signInToContinue')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t('auth.enterEmail')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t('auth.enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe')}</span>
              </label>
              {/* Temporarily hidden Forgot Password link */}
              {/* <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link> */}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? t('auth.signingIn') : t('auth.signInButton')}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                href={`/${locale}/auth/sign-up`}
                className="text-gray-900 hover:text-red-600 font-semibold transition-colors cursor-pointer"
              >
                {t('auth.signUp')}
              </Link>
            </p>
          </div>

          {/* Social Sign In */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleOAuthButton onError={handleGoogleError} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
