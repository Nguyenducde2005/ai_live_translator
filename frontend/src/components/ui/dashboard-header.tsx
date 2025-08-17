'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { usePathname } from 'next/navigation'
import { APP_CONSTANTS } from '@/lib/constants/app'

interface DashboardHeaderProps {
  showDashboardButton?: boolean
}

export function DashboardHeader({ showDashboardButton = false }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const { t, locale } = useTranslation()
  const pathname = usePathname()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Tự động phát hiện khi nào cần hiển thị button Dashboard
  const shouldShowDashboardButton = showDashboardButton || 
    (pathname && pathname !== `/${locale}/dashboard` && pathname.startsWith(`/${locale}/dashboard`))

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={APP_CONSTANTS.LOGO_PATH} alt="Logo" className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{APP_CONSTANTS.WEBSITE_NAME}</h2>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {shouldShowDashboardButton && (
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" size="sm">
                  {t('navigation.dashboard')}
                </Button>
              </Link>
            )}
            
            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />
            
            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {user?.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={user?.name || 'User'} />
                    ) : null}
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                      {getInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/settings`} className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('navigation.settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
} 