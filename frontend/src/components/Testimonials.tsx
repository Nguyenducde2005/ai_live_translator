"use client";

import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { useTranslations } from 'next-intl';

const Testimonials = () => {
  const t = useTranslations();

  const testimonials = [
    {
      name: t('testimonials.testimonials.0.name'),
      role: t('testimonials.testimonials.0.role'),
      company: t('testimonials.testimonials.0.company'),
      content: t('testimonials.testimonials.0.content')
    },
    {
      name: t('testimonials.testimonials.1.name'),
      role: t('testimonials.testimonials.1.role'),
      company: t('testimonials.testimonials.1.company'),
      content: t('testimonials.testimonials.1.content')
    },
    {
      name: t('testimonials.testimonials.2.name'),
      role: t('testimonials.testimonials.2.role'),
      company: t('testimonials.testimonials.2.company'),
      content: t('testimonials.testimonials.2.content')
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10">
            {t('testimonials.title')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('testimonials.subtitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            See how GiantyLive transforms international conferences worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-2xl p-8 shadow-card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-border/20 pt-4">
                <h4 className="font-semibold text-foreground mb-1">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-primary font-medium">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm">Conferences Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm">Participants Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">95%</div>
              <div className="text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">0.5s</div>
              <div className="text-sm">Average Latency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;