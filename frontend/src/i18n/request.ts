import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    // Fallback to default locale if locale is undefined or invalid
    locale = 'ja';
  }

  return {
    locale: locale as string,
    messages: (await import(`./locales/${locale}.json`)).default
  };
}); 