'use client'

import React from 'react'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { Brain, MessageCircle, Target, BookOpen, Zap, Shield } from 'lucide-react'
import { motion, easeOut } from 'framer-motion'

const features = [
    {
        icon: Brain,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        titleKey: 'whySlackSync.smartAI.title',
        descKey: 'whySlackSync.smartAI.description'
    },
    {
        icon: MessageCircle,
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        titleKey: 'whySlackSync.realTimeTranslation.title',
        descKey: 'whySlackSync.realTimeTranslation.description'
    },
    {
        icon: Target,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        titleKey: 'whySlackSync.highAccuracy.title',
        descKey: 'whySlackSync.highAccuracy.description'
    },
    {
        icon: BookOpen,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        titleKey: 'whySlackSync.customGlossary.title',
        descKey: 'whySlackSync.customGlossary.description'
    },
    {
        icon: Zap,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        titleKey: 'whySlackSync.customPrompts.title',
        descKey: 'whySlackSync.customPrompts.description'
    },
    {
        icon: Shield,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        titleKey: 'whySlackSync.maxSecurity.title',
        descKey: 'whySlackSync.maxSecurity.description'
    }
]

export function WhySlackSyncSection() {
    const { t } = useTranslation()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: easeOut
            }
        }
    }

    const titleVariants = {
        hidden: { 
            opacity: 0, 
            y: 15 
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: easeOut
            }
        }
    }

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 25,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.35,
                ease: easeOut
            }
        }
    }

    return (
        <div id="why-slacksync" className="bg-white py-16 md:py-24">
            <motion.div 
                className="container mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.div 
                    className="mx-auto max-w-7xl space-y-16"
                    variants={containerVariants}
                >
                    <motion.div 
                        className="text-center"
                        variants={itemVariants}
                    >
                        <motion.div 
                            className="mb-4 flex items-center justify-center gap-2"
                            variants={titleVariants}
                        >
                            <div className="h-px w-8 bg-red-500"></div>
                            <span className="text-sm font-medium text-red-500">{t('whySlackSync.title')}</span>
                            <div className="h-px w-8 bg-red-500"></div>
                        </motion.div>
                        <motion.h2 
                            className="mb-6 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl md:whitespace-nowrap text-balance"
                            variants={titleVariants}
                        >
                            {t('whySlackSync.headline')}
                        </motion.h2>
                        <motion.p 
                            className="mx-auto max-w-4xl text-lg text-foreground/70"
                            variants={titleVariants}
                        >
                            {t('whySlackSync.subtitle')}
                        </motion.p>
                    </motion.div>
                    
                    <motion.div 
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                    >
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon
                            return (
                                <motion.div 
                                    key={index} 
                                    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                                        border: '1px solid transparent',
                                        backgroundClip: 'padding-box'
                                    }}
                                    variants={cardVariants}
                                    custom={index}
                                >
                                    {/* Gradient border effect */}
                                    <div 
                                        className="absolute inset-0 rounded-xl"
                                        style={{
                                            background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
                                            padding: '1px'
                                        }}
                                    >
                                        <div className="h-full w-full rounded-xl bg-white"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                                            <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-red-600 transition-colors duration-300">
                                            {t(feature.titleKey)}
                                        </h3>
                                        <p className="text-base leading-relaxed text-foreground/70">
                                            {t(feature.descKey)}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
} 