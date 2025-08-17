'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, User, Bell, Shield, Database, Save, Eye, EyeOff, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { apiClient } from '@/lib/api-client'
import { setAuthCookies, getAuthData } from '@/lib/cookies'
import { DashboardHeader } from '@/components/ui/dashboard-header'

interface UpdateProfileForm {
  name: string
  email: string
}

interface ChangePasswordForm {
  current_password: string
  new_password: string
  confirm_password: string
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Gán thông tin user vào form khi user đã đăng nhập
  const [profileForm, setProfileForm] = useState<UpdateProfileForm>({
    name: user?.name || '',
    email: user?.email || ''
  })

  // Language settings
  const [selectedLocale, setSelectedLocale] = useState<string>(user?.locale || 'en')

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      })
      setSelectedLocale(user.locale || 'en')
    }
  }, [user])

  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [notifications, setNotifications] = useState(true)
  const [autoTranslate, setAutoTranslate] = useState(true)

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLocaleChange = async (newLocale: string) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await apiClient.put('/users/update-locale', { locale: newLocale })
      // Lấy lại user mới nhất từ backend
      const updatedUser = await apiClient.get('/users/me') as any
      // Cập nhật lại cookie và state
      const authData = getAuthData()
      if (authData.token) {
        setAuthCookies(authData.token, updatedUser)
      }
      setSelectedLocale(newLocale)
      setSuccess(t('settings.language.languageUpdated'))
      
      // Redirect đến URL mới với locale mới thay vì reload
      setTimeout(() => {
        const currentPath = window.location.pathname
        const pathWithoutLocale = currentPath.replace(/^\/(vi|en|ja)/, '')
        const newUrl = `/${newLocale}${pathWithoutLocale}`
        window.location.href = newUrl
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || t('settings.language.failedToUpdateLanguage'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await apiClient.put('/users/update-profile', { name: profileForm.name })
      // Lấy lại user mới nhất từ backend
      const updatedUser = await apiClient.get('/users/me') as any
      // Cập nhật lại cookie và state
      const authData = getAuthData()
      if (authData.token) {
        setAuthCookies(authData.token, updatedUser)
      }
      setProfileForm({
        name: updatedUser.name,
        email: updatedUser.email
      })
      setSuccess(t('settings.profile.profileUpdated'))
    } catch (err: any) {
      setError(err.response?.data?.message || t('settings.profile.failedToUpdateProfile'))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError(t('settings.security.passwordsDoNotMatch'))
      return
    }

    if (passwordForm.new_password.length < 6) {
      setError(t('settings.security.passwordTooShort'))
      return
    }

    setIsLoading(true)

    try {
      await apiClient.put('/users/update-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      })
      setSuccess(t('settings.security.passwordChanged'))
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (err: any) {
      setError(err.response?.data?.message || t('settings.security.failedToChangePassword'))
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href={`/${locale}/dashboard`} className="hover:text-gray-700 transition-colors">
            {t('navigation.dashboard')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{t('settings.title')}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
          <p className="text-gray-600">{t('settings.description')}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('settings.profile.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('settings.profile.fullName')} *</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('settings.profile.emailAddress')} *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    name="email"
                    value={profileForm.email}
                    readOnly
                    required
                    className="mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>{isLoading ? t('settings.profile.updating') : t('settings.profile.updateProfile')}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.language.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.language.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">{t('settings.language.defaultLanguage')}</Label>
                  <Select value={selectedLocale} onValueChange={handleLocaleChange} disabled={isLoading}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('settings.language.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('settings.language.english')}</SelectItem>
                      <SelectItem value="vi">{t('settings.language.vietnamese')}</SelectItem>
                      <SelectItem value="ja">{t('settings.language.japanese')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{t('settings.language.currentLanguage')}: <span className="font-medium">
                    {selectedLocale === 'en' ? t('settings.language.english') : 
                     selectedLocale === 'vi' ? t('settings.language.vietnamese') : 
                     t('settings.language.japanese')}
                  </span></p>
                  <p>{t('settings.language.languageDescription')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('settings.security.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.security.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="current_password">{t('settings.security.currentPassword')} *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="current_password"
                      name="current_password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={handlePasswordInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new_password">{t('settings.security.newPassword')} *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="new_password"
                      name="new_password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={handlePasswordInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm_password">{t('settings.security.confirmPassword')} *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordInputChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <span>{isLoading ? t('settings.security.changing') : t('settings.security.changePassword')}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Temporarily commented out Notification Settings and Advanced Settings
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoTranslate">Auto Translation</Label>
                  <p className="text-sm text-gray-500">Automatically translate messages</p>
                </div>
                <Switch
                  id="autoTranslate"
                  checked={autoTranslate}
                  onCheckedChange={setAutoTranslate}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Advanced configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey" 
                    type="password" 
                    placeholder="Enter your API key" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input 
                    id="webhook" 
                    placeholder="https://your-webhook-url.com" 
                    className="mt-1"
                  />
                </div>
                <Button variant="outline" className="w-full">Test Connection</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        */}
      </div>
    </div>
  )
} 