"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from "@/hooks/use-auth";
import { User, Settings, LogOut, ChevronDown, Globe, Video } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { user, logout } = useAuth();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/auth/sign-in`);
  };

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    
    // Set cookie for next-intl
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Navigate to new locale
    router.push(newPath);
    setIsLanguageMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLanguageName = (code: string) => {
    const languages = {
      'en': 'English',
      'vi': 'Tiếng Việt',
      'ja': '日本語'
    };
    return languages[code as keyof typeof languages] || code;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo only */}
        <div className="flex items-center">
          {/* Logo - Clickable to go home */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 31.56073 31" className="text-red-600" fill="currentColor">
              <path d="M29.79845,3.68473h-.08013a1.7105,1.7105,0,0,0-1.76224,1.6822V16.74162a1.66182,1.66182,0,0,0,1.68215,1.76223h.16022a1.77791,1.77791,0,0,0,1.76228-1.76223V5.447A1.77792,1.77791,0,0,0,29.79845,3.68473Z"></path>
              <rect x="14.01808" y="3.68473" width="3.60465" height="23.63048" rx="1.76228"></rect>
              <rect y="12.4961" width="3.60465" height="14.81912" rx="1.76228"></rect>
              <path d="M22.90953,0h-.16016a1.77792,1.77791,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77791,0,0,0,22.90953,0Z" fill="#ed2647"></path>
              <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228" fill="#ed2647"></rect>
            </svg>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GiantyLive</h1>
            </div>
          </Link>
        </div>

        {/* Right side - Language Switcher and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{getLanguageName(locale)}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {['en', 'vi', 'ja'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        locale === lang ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {getLanguageName(lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-gray-100">
                <Avatar className="w-9 h-9 ring-2 ring-gray-200">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-sm font-semibold">
                    {getInitials(user?.full_name || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-gray-800 bg-gray-50 px-3 py-2 rounded-t-md">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-semibold">
                      {getInitials(user?.full_name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)} className="cursor-pointer px-3 py-2">
                <Video className="w-4 h-4 mr-3 text-gray-500" />
                <span>Conferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)} className="cursor-pointer px-3 py-2">
                <User className="w-4 h-4 mr-3 text-gray-500" />
                <span>My Conferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)} className="cursor-pointer px-3 py-2">
                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                <span>{t('settings.title')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 px-3 py-2 hover:bg-red-50 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-3" />
                <span>{t('auth.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}