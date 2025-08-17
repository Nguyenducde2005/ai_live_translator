import Header from "@/components/gianty-talk/Header";
import Hero from "@/components/gianty-talk/Hero";
import Features from "@/components/gianty-talk/Features";
import HowItWorks from "@/components/gianty-talk/HowItWorks";
import Languages from "@/components/gianty-talk/Languages";
import Testimonials from "@/components/gianty-talk/Testimonials";
import CTA from "@/components/gianty-talk/CTA";
import Footer from "@/components/gianty-talk/Footer";

export default async function Page() {
  // Load default English messages
  const messages = await import('../i18n/locales/en.json').then(m => m.default).catch(() => ({}));

  return (
    <div className="min-h-screen">
      <Header />
      <Hero messages={messages} />
      <Features messages={messages} />
      <HowItWorks messages={messages} />
      <Languages messages={messages} />
      <Testimonials messages={messages} />
      <CTA messages={messages} />
      <Footer messages={messages} />
    </div>
  );
} 