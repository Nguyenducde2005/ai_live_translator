'use client'

import { useTranslations, useLocale } from 'next-intl'

export function useTranslation() {
  const t = useTranslations()
  const locale = useLocale()
  
  return {
    t,
    locale,
    isRTL: false, // Future RTL support
  }
}

export function useLocaleInfo() {
  const locale = useLocale()
  
  const localeInfo = {
    vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
    en: { name: 'English', flag: '🇺🇸' },
    ja: { name: '日本語', flag: '🇯🇵' },
  }
  
  return {
    currentLocale: locale,
    currentLocaleInfo: localeInfo[locale as keyof typeof localeInfo],
    allLocales: localeInfo,
  }
} 