'use client'

import React from 'react'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { motion, easeOut } from 'framer-motion'

const steps = [
    {
        number: 1,
        titleKey: 'howItWorks.step1.title',
        descKey: 'howItWorks.step1.description'
    },
    {
        number: 2,
        titleKey: 'howItWorks.step2.title',
        descKey: 'howItWorks.step2.description'
    },
    {
        number: 3,
        titleKey: 'howItWorks.step3.title',
        descKey: 'howItWorks.step3.description'
    },
    {
        number: 4,
        titleKey: 'howItWorks.step4.title',
        descKey: 'howItWorks.step4.description'
    }
]

export function HowItWorksSection() {
    const { t } = useTranslation()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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

    const stepVariants = {
        hidden: { 
            opacity: 0, 
            x: -20 
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.35,
                ease: easeOut
            }
        }
    }

    return (
        <div id="how-it-works" className="bg-gradient-to-br from-purple-50 to-blue-50 py-16 md:py-24">
            <motion.div 
                className="container mx-auto px-4 max-w-7xl space-y-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
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
                        <span className="text-sm font-medium text-red-500">{t('howItWorks.title')}</span>
                        <div className="h-px w-8 bg-red-500"></div>
                    </motion.div>
                    <motion.h2 
                        className="mb-6 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl md:whitespace-nowrap text-balance"
                        variants={titleVariants}
                    >
                        {t('howItWorks.headline')}
                    </motion.h2>
                    <motion.p 
                        className="mx-auto max-w-4xl text-lg text-foreground/70"
                        variants={titleVariants}
                    >
                        {t('howItWorks.subtitle')}
                    </motion.p>
                </motion.div>
                
                <motion.div 
                    className="space-y-10 md:space-y-16"
                    variants={containerVariants}
                >
                    {steps.map((step, index) => (
                        <motion.div 
                            key={step.number} 
                            className="relative"
                            variants={stepVariants}
                            custom={index}
                        >
                            <div className="flex flex-col items-start gap-4 md:flex-row md:gap-8">
                                <div className="flex md:w-1/3 md:justify-end">
                                    <span className="w-[160px] text-2xl md:text-3xl font-bold text-red-500/80 whitespace-nowrap mr-4">
                                        {t('howItWorks.step')} {step.number}
                                    </span>
                                </div>
                                <div className="md:w-2/3 md:pt-2">
                                    <h3 className="mb-4 text-2xl font-bold text-foreground">
                                        {t(step.titleKey)}
                                    </h3>
                                    <p className="text-lg leading-relaxed text-foreground/70">
                                        {t(step.descKey)}
                                    </p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="absolute left-0 top-full hidden h-8 w-1/3 justify-end pr-8 md:flex">
                                    <div className="h-full w-px bg-red-500/80"></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
} 