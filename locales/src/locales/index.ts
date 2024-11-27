import { en } from "./en";
import { it } from "./it";

export const locales = [
  {
    name: "English",
    value: "en",
    data: en,
  },
  {
    name: "Italiano",
    value: "it",
    data: it,
  },
];

export function localesToObject() {
  const obj: Record<string, typeof en> = {};

  for (const locale of locales) {
    obj[locale.value] = locale.data;
  }

  return obj;
}
