import en, { TranslationKeys } from './en';
import th from './th';

type Language = 'en' | 'th';

const translations: Record<Language, Record<string, string>> = { en, th };

export const translate = (
  lang: Language,
  key: string,
  params?: Record<string, string | number>
): string => {
  const dict = translations[lang] || translations.en;
  let value = dict[key] ?? translations.en[key] ?? key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      value = value.replaceAll(`{${paramKey}}`, String(paramValue));
    });
  }

  return value;
};

export type { Language, TranslationKeys };
export { en, th };
