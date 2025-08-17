'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export function BuildSlackAppsSection() {
    const t = useTranslations()

    // Fallback function để tránh lỗi khi không có translation
    const getTranslation = (key: string, fallback: string) => {
        try {
            return t(key)
        } catch {
            return fallback
        }
    }

    return (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            <a href="https://api.slack.com/docs/apps" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                                {getTranslation('buildSlackApps.title', 'Build Slack Apps')}
                            </a>
                        </h2>
                        <div className="text-lg text-gray-600 mb-8">
                            <p>{getTranslation('buildSlackApps.description', 'Customize your Slack experience with apps using a wide range of APIs.')}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="https://api.slack.com/docs/apps" target="_blank" rel="noopener noreferrer">
                                <Button
                                    variant="outline"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border text-md group h-[60px] border-purple-500/50 bg-purple-500/5 px-8 py-4 text-foreground hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-500/80"
                                >
                                    <span>{getTranslation('buildSlackApps.learnMore', 'Learn more about apps')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:text-red-500"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                </Button>
                            </a>
                        </div>
                    </div>
                    
                    {/* Image */}
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="relative">
                            <a href="https://api.slack.com/docs/apps" target="_blank" rel="noopener noreferrer">
                                <img 
                                    className="w-64 h-48 object-contain" 
                                    src="/static/images/call_action.svg" 
                                    alt="Slack App Development"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 