"use client";

import { Badge } from "@/components/ui/badge";
import { Mic, Brain, Globe, Shield } from "lucide-react";
import { useTranslations } from 'next-intl';

const Features = () => {
  const t = useTranslations();

  const features = [
    {
      icon: Mic,
      title: t('features.realTimeTranslation.title'),
      description: t('features.realTimeTranslation.description')
    },
    {
      icon: Brain,
      title: t('features.aiPowered.title'),
      description: t('features.aiPowered.description')
    },
    {
      icon: Globe,
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description')
    },
    {
      icon: Shield,
      title: t('features.conferenceOptimized.title'),
      description: t('features.conferenceOptimized.description')
    }
  ];

  return (
    <section className="py-32 lg:py-40 bg-background">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 text-primary bg-primary/10">
            {t('features.title')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            {t('features.subtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-6">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;