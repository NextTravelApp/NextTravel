import { getLocales } from "expo-localization";
import { i18n } from "locales";

export const getLocale = () => {
  const locales = getLocales();

  for (const locale of locales) {
    if (locale.languageCode) return locale.languageCode;
  }

  return "en";
};

i18n.locale = getLocale();
export { i18n };
