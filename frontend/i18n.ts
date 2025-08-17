import { getRequestConfig } from 'next-intl/server';
import { localeConfig } from './src/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !localeConfig.locales.includes(locale as any)) {
    // Fallback to default locale if locale is undefined or invalid
    locale = localeConfig.defaultLocale;
  }

  return {
    locale: locale as string,
    messages: (await import(`./src/i18n/locales/${locale}.json`)).default
  };
});
