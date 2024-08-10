import { en } from "./en";

export * from "./en";

export const locales = [
  {
    name: "English",
    value: "en",
    data: en,
  },
];

export function localesToObject() {
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here
  const obj: any = {};

  for (const locale of locales) {
    obj[locale.value] = locale.data;
  }

  return obj;
}
