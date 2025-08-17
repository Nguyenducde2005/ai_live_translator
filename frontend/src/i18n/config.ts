// Can be imported from a shared config
export const locales = ['vi', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number]; 