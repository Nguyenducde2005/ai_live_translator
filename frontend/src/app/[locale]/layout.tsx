import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Roboto } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { locales } from '@/i18n/config';
import "../globals.css";

export const metadata: Metadata = {
  title: "GiantyLive - AI-Powered Live Voice Translation",
  description: "Real-time voice translation for global communication",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure locale is valid
  const validLocale = locales.includes(locale as any) ? locale : 'en';

  // Load messages directly
  const messages = await import(`../../i18n/locales/${validLocale}.json`).then(m => m.default).catch(() => ({}));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={validLocale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
} 