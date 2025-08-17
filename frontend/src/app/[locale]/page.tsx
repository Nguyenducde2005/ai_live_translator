import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Languages from "@/components/Languages";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function LocalePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Languages />
      <Testimonials />
      <CTA />
      <Footer />
      <ScrollToTop />
    </main>
  );
} 