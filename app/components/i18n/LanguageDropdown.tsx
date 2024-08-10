import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { i18n } from ".";
import { Button, Text } from "../injector";
import { locales } from "./locales";

const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export function LanguageDropdown() {
  const [value, setValue] = useState<string | null>(
    i18n.availableLocales.includes(i18n.locale)
      ? i18n.locale
      : i18n.defaultLocale,
  );

  const renderItem = (item: {
    label: string;
    value: string;
  }) => {
    return (
      <Button className="w-full">
        <Text>{item.label}</Text>
      </Button>
    );
  };

  useEffect(() => {
    i18n.locale = value ?? "en";
  }, [value]);

  return (
    <Dropdown
      style={{
        width: "100%",
        height: 40,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        padding: 8,
      }}
      data={locales.map((locale) => ({
        label: `${getFlagEmoji(locale.value.replace("en", "us"))} ${locale.name}`,
        value: locale.value,
      }))}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
      renderItem={renderItem}
    />
  );
}
