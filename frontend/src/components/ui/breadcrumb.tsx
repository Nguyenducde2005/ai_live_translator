'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale()
  const t = useTranslations()
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href={`/${locale}/dashboard`} className="flex items-center hover:text-gray-700 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        {t('navigation.dashboard')}
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
} 