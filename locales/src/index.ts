import { I18n } from "i18n-js";
import { localesToObject } from "./locales";

export * from "./locales";
export const i18n = new I18n(localesToObject());
i18n.enableFallback = true;
