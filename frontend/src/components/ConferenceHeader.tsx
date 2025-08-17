'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu,
  X,
  Globe,
  ChevronDown,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { APP_CONSTANTS } from "@/lib/constants/app";

export default function ConferenceHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const navigationItems = [
    { name: t('navigation.features'), href: "#features" },
    { name: t('navigation.howItWorks'), href: "#how-it-works" },
    { name: t('navigation.languages'), href: "#languages" },
  ];

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    try {
      // Remove the current locale from the pathname
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
      
      // Construct the new path with the new locale
      const newPath = `/${newLocale}${pathnameWithoutLocale}`;
      
      // Set locale cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      
      // Use router.push for proper navigation
      await router.push(newPath);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href={`/${locale}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <svg
                width="32"
                height="32"
                viewBox="0 0 31.56073 31"
                className="text-red-600"
                fill="currentColor"
              >
                <path d="M29.79845,3.68473h-.08013a1.7105,1.7105,0,0,0-1.76224,1.6822V16.74162a1.66182,1.66182,0,0,0,1.68215,1.76223h.16022a1.77791,1.77791,0,0,0,1.76228-1.76223V5.447A1.77792,1.77792,0,0,0,29.79845,3.68473Z"></path>
                <rect x="14.01808" y="3.68473" width="3.60465" height="23.63048" rx="1.76228"></rect>
                <rect y="12.4961" width="3.60465" height="14.81912" rx="1.76228"></rect>
                <path d="M22.90953,0h-.16016a1.77792,1.77791,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77791,0,0,0,22.90953,0Z" fill="#ed2647"></path>
                <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228" fill="#ed2647"></rect>
              </svg>
              <span className="text-2xl font-bold text-black">
                {APP_CONSTANTS.WEBSITE_NAME}
              </span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-black hover:text-red-600 transition-colors cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side - Language selector and auth buttons */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-black hover:text-red-600 transition-colors px-3 py-2 h-auto">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{locale.toUpperCase()}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 mt-2 bg-white border border-gray-200 shadow-lg">
                    {languages.map((language) => (
                      <DropdownMenuItem 
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className="cursor-pointer text-gray-700 hover:text-red-600 hover:bg-gray-50"
                      >
                        <span className="mr-2">{language.flag}</span>
                        <span>{language.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth buttons */}
            <Button variant="ghost" size="sm" className="text-black hover:text-red-600 bg-gray-100 hover:bg-gray-200" asChild>
              <a href={`/${locale}/auth/sign-in`}>
                <LogIn className="w-4 h-4 mr-2" />
                {t('auth.signIn')}
              </a>
            </Button>
            <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0" asChild>
              <a href={`/${locale}/auth/sign-up`}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t('auth.signUp')}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-6 py-2 text-black hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div className="px-6 pt-4 border-t border-gray-200 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-black hover:text-red-600 bg-gray-100 hover:bg-gray-200" asChild>
                  <a href={`/${locale}/auth/sign-in`}>
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('auth.signIn')}
                  </a>
                </Button>
                <Button variant="default" size="sm" className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0" asChild>
                  <a href={`/${locale}/auth/sign-up`}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('auth.signUp')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
