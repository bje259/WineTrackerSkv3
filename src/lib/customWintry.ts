import {
  getThemeProperties,
  type CustomThemeConfig,
  type ThemeConfig,
} from "@skeletonlabs/tw-plugin";

const customWintry: CustomThemeConfig = {
  name: "customWintry",
  properties: {
    ...getThemeProperties("wintry"),
  },
};

const customWintryEnhancements = {
  "[data-theme='wintry'] h1,\n[data-theme='wintry'] h2,\n[data-theme='wintry'] h3,\n[data-theme='wintry'] h4,\n[data-theme='wintry'] h5,\n[data-theme='wintry'] h6":
    { fontWeight: "bold" },
  "[data-theme='wintry']": {
    backgroundImage:
      "radial-gradient(at 50% 0%, rgba(var(--color-secondary-500) / 0.50) 0px, transparent 75%), radial-gradient(at 100% 0%, rgba(var(--color-tertiary-500) / 0.40) 0px, transparent 50%)",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  ".dark [data-theme='wintry']": {
    backgroundImage:
      "radial-gradient(at 50% 0%, rgba(var(--color-secondary-500) / 0.18) 0px, transparent 75%), radial-gradient(at 100% 0%, rgba(var(--color-tertiary-500) / 0.18) 0px, transparent 50%)",
  },
};

export const customThemeConfig: ThemeConfig = {
  custom: [
    {
      ...customWintry,
    },
  ],
  preset: [
    { name: "skeleton", enhancements: true },
    { name: "modern", enhancements: true },
    { name: "wintry", enhancements: true },
  ],
};
