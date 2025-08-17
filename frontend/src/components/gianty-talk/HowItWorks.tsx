import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, Brain, Headphones, CheckCircle } from "lucide-react";

interface HowItWorksProps {
  messages: any;
}

const HowItWorks = ({ messages }: HowItWorksProps) => {
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const steps = [
    {
      number: t('howItWorks.steps.step1.number'),
      icon: Mic,
      title: t('howItWorks.steps.step1.title'),
      description: t('howItWorks.steps.step1.description')
    },
    {
      number: t('howItWorks.steps.step2.number'),
      icon: Brain,
      title: t('howItWorks.steps.step2.title'),
      description: t('howItWorks.steps.step2.description')
    },
    {
      number: t('howItWorks.steps.step3.number'),
      icon: Headphones,
      title: t('howItWorks.steps.step3.title'),
      description: t('howItWorks.steps.step3.description')
    },
    {
      number: t('howItWorks.steps.step4.number'),
      icon: CheckCircle,
      title: t('howItWorks.steps.step4.title'),
      description: t('howItWorks.steps.step4.description')
    }
  ];

  return (
    <section className="py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 text-red-600 bg-red-100 dark:bg-red-900/20">
            {t('howItWorks.title')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            {t('howItWorks.subtitle')}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Steps */}
            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 group relative">
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    {/* Connecting line - positioned relative to the step number */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 top-full w-0.5 h-12 bg-red-600 opacity-30 transform -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual illustration - Real-Time Translation card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border-2 border-orange-500">
                <div className="text-center">
                  <div className="relative w-20 h-20 bg-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Mic className="w-10 h-10 text-white" />
                    {/* Animated waves for mic */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-red-300 animate-ping animation-delay-1000 opacity-50"></div>
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-red-200 animate-ping animation-delay-2000 opacity-25"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('howItWorks.visual.title')}</h3>
                  <p className="text-gray-300 mb-6">{t('howItWorks.visual.subtitle')}</p>

                  <div className="space-y-4">
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">{t('howItWorks.visual.english')}</span>
                      </div>
                      <p className="text-white">"Hello, welcome to our conference"</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-red-600 mx-auto" />

                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span className="text-sm text-gray-300">日本語</span>
                      </div>
                      <p className="text-white">"こんにちは、私たちの会議へようこそ"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;