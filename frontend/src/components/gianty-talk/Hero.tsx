"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Globe, Users, Zap } from "lucide-react";
import { APP_CONSTANTS } from "@/lib/constants/app";
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { useParams } from 'next/navigation';

interface HeroProps {
  messages: any;
}

const Hero = ({ messages }: HeroProps) => {
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const { currentLocale } = useParams();

  return (
    <section className="relative pt-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/static/images/hero-banner.jpg"
          alt="International conference with AI translation"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 py-16 lg:py-20 flex flex-col items-center justify-center min-h-screen text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div className="mb-6 mt-8" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-4 mb-12" variants={itemVariants}>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href={`/${currentLocale}/auth/sign-up`}>
              {t('hero.startLiveTranslation')}
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white/30 text-white hover:text-red-400 bg-black/20 hover:bg-black/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            asChild
          >
            <a href={`/${currentLocale}/guide`}>
              {t('hero.joinConference')}
            </a>
          </Button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl" variants={itemVariants}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('hero.features.realTimeAI')}</h3>
            <p className="text-gray-300">Instant voice translation with advanced AI technology</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('hero.features.languagesSupported')}</h3>
            <p className="text-gray-300">Cover major languages for global communication</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('hero.features.conferenceOptimized')}</h3>
            <p className="text-gray-300">Perfect for international meetings and events</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;