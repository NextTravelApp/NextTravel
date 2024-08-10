import { I18n } from "i18n-js";
import { getLocale } from "./LocalesHandler";
import { localesToObject } from "./locales";

export const i18n = new I18n(localesToObject());
i18n.locale = getLocale();
i18n.enableFallback = true;
