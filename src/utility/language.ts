import * as de from './languages/de-de.json';
import * as en_GB from './languages/en-us.json';

export const defaultLocale: LocaleName = 'en_GB';
const locales = {
  de,
  en_GB,
} as const;

type LocalePath = PathInObject<LocaleMap['de']> & PathInObject<LocaleMap['en_GB']>;
type LocaleMap = typeof locales;
type LocaleName = keyof LocaleMap;
type PathInObject<T extends Record<string, any>> = keyof {
  [K in keyof T as T[K] extends string
    ? K
    : T[K] extends Record<string, any>
    ? `${K & string}.${PathInObject<T[K]>}`
    : never]: string;
};

function get(object: Record<string, unknown>, path: string[], index = 0): string {
  const key = path[index];

  if (key === undefined) {
    return '';
  }

  const result = object[key];

  if (result === undefined) {
    return '';
  }

  if (typeof result === 'string') {
    return result;
  }

  return get(Object(result), path, index + 1);
}

export function localize(locale: string, key: LocalePath, ...args: string[]): string {
  const mappedLocale = mapLocale(locale);

  let text = get(locales[mappedLocale], key.split('.'));

  args.forEach((replacement, index) => {
    const placeholder = `{${index}}`;
    text = text.replace(placeholder, replacement);
  });

  return text;
}

function mapLocale(locale: string): LocaleName {
  locale = locale.replace('-', '_');

  if (locale in locales) {
    return locale as LocaleName;
  }

  return defaultLocale;
}
