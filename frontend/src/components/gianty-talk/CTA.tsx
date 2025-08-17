import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar, ArrowRight, CheckCircle } from "lucide-react";

interface CTAProps {
  messages: any;
}

const CTA = ({ messages }: CTAProps) => {
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const features = [
    t('cta.features.0'),
    t('cta.features.1'),
    t('cta.features.2'),
    t('cta.features.3')
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-primary bg-primary/10">
            {t('cta.title')}
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            {t('cta.headline')}
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>

          <Card className="bg-gradient-card border-border/50 shadow-card max-w-2xl mx-auto mb-12">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" size="lg" className="text-lg px-8 py-4 bg-red-600 hover:bg-red-700">
                  <Mic className="w-5 h-5 mr-2" />
                  {t('cta.getStartedNow')}
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  {t('cta.scheduleDemo')}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                {t('cta.subtext')}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>{t('cta.stats.uptime')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowRight className="w-4 h-4 text-primary" />
              <span>{t('cta.stats.deploy')}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>{t('cta.stats.security')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;