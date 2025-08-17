// Can be imported from a shared config
export const locales = ['vi', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];

// Default locale configuration
export const defaultLocale = 'ja' as const;

// Locale configuration for next-intl
export const localeConfig = {
  locales,
  defaultLocale,
  localePrefix: 'always' as const,
} as const; 