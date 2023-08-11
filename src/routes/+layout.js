// src/i18n.js
import { register, init, getLocaleFromNavigator } from "svelte-i18n";

register("en", () => import("../translations/en.json"));
register("ar", () => import("../translations/ar.json"));
// en, en-US and pt are not available yet

init({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator(),
});
