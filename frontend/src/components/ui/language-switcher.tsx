'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { flagComponents, type FlagCode } from '@/components/ui/flag-icons'

const languages = [
  { 
    code: 'vi' as FlagCode, 
    name: 'Tiếng Việt', 
    nativeName: 'Tiếng Việt'
  },
  { 
    code: 'en' as FlagCode, 
    name: 'English', 
    nativeName: 'English'
  },
  { 
    code: 'ja' as FlagCode, 
    name: '日本語', 
    nativeName: '日本語'
  },
]

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isChanging, setIsChanging] = React.useState(false)

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale || isChanging) return
    
    setIsChanging(true)
    
    try {
      // Remove the current locale from the pathname
      const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
      
      // Construct the new path with the new locale
      const newPath = `/${newLocale}${pathnameWithoutLocale}`
      
      await router.push(newPath)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  const currentLanguage = languages.find(lang => lang.code === locale)
  const CurrentFlag = currentLanguage ? flagComponents[currentLanguage.code] : null

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
                     <Button 
             variant="ghost" 
             size="sm" 
             className={cn("h-10 w-10 p-0 hover:bg-accent transition-colors", className)}
             aria-label="Select language"
             disabled={isChanging}
           >
            {isChanging ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                {CurrentFlag && (
                  <CurrentFlag size={20} className="rounded-sm shadow-sm border border-gray-200" />
                )}
                <Globe className="h-4 w-4" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => {
            const FlagComponent = flagComponents[language.code]
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "cursor-pointer flex items-center justify-between py-2.5 transition-colors",
                  locale === language.code && "bg-accent"
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleLanguageChange(language.code)
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <FlagComponent size={20} className="rounded-sm" />
                  <span className="text-sm font-medium">{language.nativeName}</span>
                </div>
                {locale === language.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
              <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("gap-2 hover:bg-accent transition-colors", className)}
            aria-label="Select language"
            disabled={isChanging}
          >
            {isChanging ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                {CurrentFlag && <CurrentFlag size={24} className="rounded-sm border border-gray-200" />}
                <Globe className="h-4 w-4" />
              </div>
            )}
            <span className="hidden md:inline">{currentLanguage?.nativeName}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
          {languages.map((language) => {
            const FlagComponent = flagComponents[language.code]
            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "cursor-pointer flex items-center justify-between py-3 transition-colors",
                  locale === language.code && "bg-accent"
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleLanguageChange(language.code)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <FlagComponent size={24} className="rounded-sm" />
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{language.name}</span>
                  </div>
                </div>
                {locale === language.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
    </DropdownMenu>
  )
} 