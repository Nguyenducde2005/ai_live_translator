'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 transform',
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-75 pointer-events-none'
      )}
      aria-label="Về đầu trang"
    >
      <ChevronUp className="w-6 h-6" />
    </Button>
  )
}
