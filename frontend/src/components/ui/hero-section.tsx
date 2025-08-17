'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { useAuth } from '@/hooks/use-auth'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/hooks/useTranslation'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    const { isAuthenticated } = useAuth()
    const { t } = useTranslation()
    
    return (
        <div className="relative pt-20 md:pt-28 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
            {/* Background image with lighter overlay */}
            <div className="absolute inset-0">
                <img
                    src="/static/images/hero-banner.jpg"
                    alt="International conference with AI translation"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-16 md:py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        AI-Powered Live Voice Translation
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Break down language barriers in real-time with our advanced AI translation technology. 
                        Perfect for international meetings, conferences, and global collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg" 
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            Get Started
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="border-2 border-white/30 text-white hover:text-red-400 bg-black/20 hover:bg-black/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

 