"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { APP_CONSTANTS } from "@/lib/constants/app";
import { useAuth } from "@/hooks/use-auth";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  BarChart3,
  Languages,
  Mic,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Globe,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const { user, isAuthenticated, logout } = useAuth();

  const currentLocale = pathname.split('/')[1] || 'en';

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

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsVisible(false);
        console.log('Header hidden - scrolling down');
      } else {
        // Scrolling up or at top - show header
        setIsVisible(true);
        console.log('Header shown - scrolling up or at top');
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLanguageChange = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/20 shadow-lg transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100 shadow-lg' 
          : '-translate-y-full opacity-0 shadow-none'
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href={`/${currentLocale}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
                <path d="M22.90953,0h-.16016a1.77792,1.77791,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77791,0,0,0,22.90953,0Z"></path>
                <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228"></rect>
              </svg>
              <span className="text-2xl font-bold text-white">
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
                className="text-white hover:text-red-400 transition-colors cursor-pointer"
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
                  <Button variant="ghost" size="sm" className="text-white hover:text-red-400 transition-colors px-3 py-2 h-auto">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">EN</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2 bg-gray-900/90 backdrop-blur-xl border border-gray-700">
                  <DropdownMenuItem className="cursor-pointer text-white hover:text-red-400 hover:bg-gray-800/80">
                    <span className="mr-2">🇺🇸</span>
                    <span>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white hover:text-red-400 hover:bg-gray-800/80">
                    <span className="mr-2">🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-white hover:text-red-400 hover:bg-gray-800/80">
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
                  <Button variant="ghost" size="sm" className="text-white hover:text-red-400 transition-colors px-3 py-2 h-auto">
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
                <DropdownMenuContent align="end" className="w-48 mt-2 bg-gray-900/90 backdrop-blur-xl border border-gray-700">
                  <DropdownMenuLabel className="text-white bg-gray-800/80 px-2 py-1 rounded-t-md">{t('header.welcomeBack', { name: user?.full_name || 'User' })}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem onClick={() => router.push(`/${currentLocale}/dashboard/profile`)} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                    <User className="w-4 h-4 mr-2" />
                    {t('profile.myProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/${currentLocale}/dashboard/settings`)} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('settings.title')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('auth.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors px-3 py-2 h-auto" asChild>
                  <a href={`/${currentLocale}/auth/sign-in`}>
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('auth.signIn')}
                  </a>
                </Button>
                <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700 text-white border-0 px-3 py-2 h-auto" asChild>
                  <a href={`/${currentLocale}/auth/sign-up`}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('auth.signUp')}
                  </a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-black/30 backdrop-blur-xl">
            <div className="py-4 space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-6 py-2 text-white hover:text-red-400 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <div className="px-6 pt-4 border-t border-white/20 space-y-2">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:text-red-400 transition-colors px-3 py-2 h-auto">
                        <div className="flex items-center gap-3 w-full">
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
                    <DropdownMenuContent align="end" className="w-48 mt-2 bg-gray-900/90 backdrop-blur-xl border border-gray-700">
                      <DropdownMenuLabel className="text-white bg-gray-800/80 px-2 py-1 rounded-t-md">{t('header.welcomeBack', { name: user?.full_name || 'User' })}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-600" />
                      <DropdownMenuItem onClick={() => router.push(`/${currentLocale}/dashboard/profile`)} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                        <User className="w-4 h-4 mr-2" />
                        {t('profile.myProfile')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/${currentLocale}/dashboard/settings`)} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                        <Settings className="w-4 h-4 mr-2" />
                        {t('settings.title')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-600" />
                      <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-red-400 hover:bg-gray-800/80">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('auth.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:text-red-400 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20" asChild>
                      <a href={`/${currentLocale}/auth/sign-in`}>
                        <LogIn className="w-4 h-4 mr-2" />
                        {t('auth.signIn')}
                      </a>
                    </Button>
                    <Button variant="default" size="sm" className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0" asChild>
                      <a href={`/${currentLocale}/auth/sign-up`}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {t('auth.signUp')}
                      </a>
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start border-white/30 text-white hover:text-red-400 hover:bg-white/10" asChild>
                  <a href={`/${currentLocale}/guide`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t('nav.guide')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;