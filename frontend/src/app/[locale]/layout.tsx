import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Roboto } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { localeConfig } from '@/i18n/config';
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
  return localeConfig.locales.map((locale) => ({ locale }));
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
  const validLocale = localeConfig.locales.includes(locale as any) ? locale : localeConfig.defaultLocale;

  // Load messages with better error handling
  let messages = {};
  try {
    const messagesModule = await import(`../../i18n/locales/${validLocale}.json`);
    messages = messagesModule.default || messagesModule;
  } catch (error) {
    console.error(`Failed to load messages for locale ${validLocale}:`, error);
    // Fallback to default messages
    try {
      const fallbackModule = await import(`../../i18n/locales/${localeConfig.defaultLocale}.json`);
      messages = fallbackModule.default || fallbackModule;
    } catch (fallbackError) {
      console.error('Failed to load fallback messages:', fallbackError);
      messages = {};
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <NextIntlClientProvider locale={validLocale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
} 