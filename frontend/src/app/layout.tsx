import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Roboto } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import "./globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load default messages for non-locale pages
  const messages = await import('../i18n/locales/en.json').then(m => m.default).catch(() => ({}));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-roboto`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale="en" messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 