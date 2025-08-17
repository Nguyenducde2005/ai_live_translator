import Header from "@/components/gianty-talk/Header";
import Hero from "@/components/gianty-talk/Hero";
import Features from "@/components/gianty-talk/Features";
import HowItWorks from "@/components/gianty-talk/HowItWorks";
import Languages from "@/components/gianty-talk/Languages";
import Testimonials from "@/components/gianty-talk/Testimonials";
import CTA from "@/components/gianty-talk/CTA";
import Footer from "@/components/gianty-talk/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // Load messages for the current locale
  const messages = await import(`../../i18n/locales/${locale}.json`).then(m => m.default).catch(() => ({}));

  return (
    <div className="min-h-screen">
      <Header />
      <Hero messages={messages} />
      <Features messages={messages} />
      <HowItWorks messages={messages} />
      <Languages messages={messages} />
      {/* <Testimonials messages={messages} /> */}
      <CTA messages={messages} />
      <Footer messages={messages} />
      <ScrollToTop />
    </div>
  );
} 