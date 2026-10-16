import { createTranslator } from "../../i18n/index.mjs";

export const lang = document.documentElement.lang === "bn" ? "bn" : "en";

let translator = createTranslator({}, lang);

/** Load the dictionary for this page's language (separate cached chunk per language). */
export async function loadDictionary() {
  const module =
    lang === "bn"
      ? await import("../dict-bn.js")
      : await import("../dict-en.js");
  translator = createTranslator(module.default, lang);
}

export function t(key, params) {
  return translator(key, params);
}
t.get = (key) => translator.get(key);
t.has = (key) => translator.has(key);
t.lang = lang;
