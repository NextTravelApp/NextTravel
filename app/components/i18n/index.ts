import { I18n } from "i18n-js";
import { getLocale } from "./LocalesHandler";
import { en } from "./locales";

const translations = {
  en,
};

export const i18n = new I18n(translations);
i18n.locale = getLocale();
i18n.enableFallback = true;
