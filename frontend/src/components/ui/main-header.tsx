'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, User, Settings, LogIn, UserPlus, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { APP_CONSTANTS } from '@/lib/constants/app'
import { useRouter } from 'next/navigation'

const menuItems = [
    { name: 'navigation.howItWorks', href: '#how-it-works', isAnchor: true },
    { name: 'navigation.setup', href: '/guide' },
    { name: 'navigation.whySlackSync', href: '#why-slacksync', isAnchor: true },
]

export function MainHeader() {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { isAuthenticated, user, logout } = useAuth()
    const locale = useLocale()
    const t = useTranslations()
    const router = useRouter()

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            
            // Check if we're on the home page
            const isHomePage = window.location.pathname === `/${locale}` || window.location.pathname === `/${locale}/`
            
            if (isHomePage) {
                // If on home page, just scroll to the section
                const element = document.querySelector(href)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            } else {
                // If on another page, navigate to home page with the anchor
                window.location.href = `/${locale}${href}`
            }
        }
    }

    const handleLogout = () => {
        logout()
        router.push(`/${locale}/sign-in`)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav data-state={menuState && 'active'} className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-black/30 backdrop-blur-xl max-w-4xl rounded-2xl border border-white/20 lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <div className="flex items-center gap-3">
                                <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.56073 31" className="w-8 h-8">
                                        <path d="M29.79845,3.68473h-.08013a1.7105,1.7105,0,0,0-1.76224,1.6822V16.74162a1.66182,1.66182,0,0,0,1.68215,1.76223h.16022a1.77791,1.77791,0,0,0,1.76228-1.76223V5.447A1.77792,1.77792,0,0,0,29.79845,3.68473Z" fill="#ed2647"/>
                                        <rect x="14.01808" y="3.68473" width="3.60465" height="23.63048" rx="1.76228" fill="#ed2647"/>
                                        <rect y="12.4961" width="3.60465" height="14.81912" rx="1.76228" fill="#ed2647"/>
                                        <path d="M22.90953,0h-.16016a1.77792,1.77792,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77792,0,0,0,22.90953,0Z" fill="#ed2647"/>
                                        <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228" fill="#ed2647"/>
                                    </svg>
                                    <span className="text-xl font-bold text-white">{APP_CONSTANTS.WEBSITE_NAME}</span>
                                </Link>
                            </div>
                            <button onClick={() => setMenuState(!menuState)} aria-label={menuState == true ? 'Close Menu' : 'Open Menu'} className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="hidden lg:flex items-center gap-8 text-base">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link 
                                            href={`/${locale}${item.href}`} 
                                            onClick={(e) => handleAnchorClick(e, item.href)}
                                            className="text-white hover:text-red-400 block duration-150 relative"
                                        >
                                            <span>{t(item.name)}</span>
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-150 hover:w-full"></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-black/30 backdrop-blur-xl group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/20 p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    <li>
                                        <a href="#features" className="text-white hover:text-red-400 transition-colors">
                                            {t('navigation.features')}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#how-it-works" className="text-white hover:text-red-400 transition-colors">
                                            {t('navigation.howItWorks')}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#languages" className="text-white hover:text-red-400 transition-colors">
                                            {t('navigation.languages')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:hidden">
                                <LanguageSwitcher />
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {/* Language Switcher */}
                                <div className="flex items-center space-x-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-white hover:text-red-400 transition-colors px-3 py-2 h-auto">
                                                <Globe className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">EN</span>
                                                <ChevronDown className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 mt-2">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <span className="mr-2">🇺🇸</span>
                                                <span>English</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <span className="mr-2">🇻🇳</span>
                                                <span>Tiếng Việt</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <span className="mr-2">🇯🇵</span>
                                                <span>日本語</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                    {/* Auth buttons */}
                                    {isAuthenticated ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 px-3 py-2 h-auto">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'User'} />
                                                            <AvatarFallback className="bg-gray-700 text-white text-sm font-medium">
                                                                {getInitials(user?.full_name || '')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-medium text-white">{user?.full_name}</span>
                                                    </div>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 mt-2">
                                                <DropdownMenuLabel className="text-white">{t('header.welcomeBack', { name: user?.full_name || 'User' })}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)}>
                                                    <User className="w-4 h-4 mr-2" />
                                                    {t('profile.myProfile')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/${locale}/settings`)}>
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    {t('settings.title')}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={handleLogout}>
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    {t('auth.signOut')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <>
                                            <Button variant="ghost" size="sm" className="text-white hover:text-red-400 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20" asChild>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
} 