"use client";

import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle } from "lucide-react";
import { useTranslations } from 'next-intl';

const Languages = () => {
  const t = useTranslations();

  const languageList = [
    "English", "Vietnamese", "Japanese", "Chinese", "Korean",
    "Spanish", "French", "German", "Italian", "Portuguese",
    "Russian", "Arabic", "Hindi", "Thai", "Indonesian",
    "Malay", "Filipino", "Dutch", "Swedish", "Norwegian"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10">
            {t('languages.title')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('languages.subtitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('languages.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {languageList.map((language, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{language}</span>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Languages;