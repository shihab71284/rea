import config from "../../site.config.mjs";
import { createTranslator } from "../i18n/index.mjs";
import { dictionaries } from "../i18n/dictionaries.mjs";
import { makeFormatters } from "../core/format.mjs";
import { ICONS } from "./icons.mjs";
import { raw } from "./html.mjs";
import { PATHS } from "./registry.mjs";

/** Icons the client scripts may draw with <use href="#i-..."> on any page. */
export const CORE_ICONS = [
  "check",
  "circleCheck",
  "alert",
  "info",
  "x",
  "copy",
  "link",
  "printer",
  "save",
  "trash",
  "reset",
  "plus",
  "minus",
  "chevronDown",
  "arrowRight",
  "download",
  "externalLink",
  "calendarClock",
  "sun",
  "moon",
  "menu",
  "globe",
];

export function createContext({ lang, assets }) {
  const t = createTranslator(dictionaries[lang], lang, { strict: true });
  const usedIcons = new Set(CORE_ICONS);

  const icon = (name, className = "") => {
    if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
    usedIcons.add(name);
    const cls = className ? `icon ${className}` : "icon";
    return raw(
      `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`,
    );
  };

  /** Root-relative URL for a path in a language (bn lives under /bn/). */
  const url = (path, targetLang = lang) => {
    const rest = path.replace(/^\//, "");
    return `${config.base}${targetLang === "bn" ? "bn/" : ""}${rest}`;
  };

  const pageUrl = (id, targetLang = lang) => {
    const path = PATHS[id];
    if (!path) throw new Error(`Unknown page id: ${id}`);
    return url(path, targetLang);
  };

  const fmt = makeFormatters(lang);

  return {
    lang,
    t,
    icon,
    url,
    pageUrl,
    fmt,
    config,
    assets,
    usedIcons,
    asset: (path) => `${config.base}${path}`,
    absolute: (path) => `${config.url}${path}`,
  };
}
