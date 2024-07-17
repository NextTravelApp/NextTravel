import { getLocales } from "expo-localization";

export const getLocale = () => {
  const locales = getLocales();

  for (const locale of locales) {
    if (locale.languageCode) return locale.languageCode;
  }

  return "en";
};
