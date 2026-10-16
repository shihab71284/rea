/**
 * Translator over nested dictionaries.
 *   t("ui.it.title")                -> string with {placeholders} filled
 *   t.get("home.steps")             -> raw nested value (arrays/objects)
 *   t.has("ui.it.title")            -> boolean
 */

function lookup(dict, path) {
  let node = dict;
  for (const part of path.split(".")) {
    if (node === null || typeof node !== "object" || !(part in node))
      return undefined;
    node = node[part];
  }
  return node;
}

export function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match,
  );
}

export function createTranslator(dict, lang, { strict = false } = {}) {
  const t = (key, params) => {
    const value = lookup(dict, key);
    if (typeof value !== "string") {
      if (strict) throw new Error(`Missing translation [${lang}] ${key}`);
      return key;
    }
    return interpolate(value, params);
  };
  t.get = (key) => {
    const value = lookup(dict, key);
    if (value === undefined && strict)
      throw new Error(`Missing translation [${lang}] ${key}`);
    return value;
  };
  t.has = (key) => lookup(dict, key) !== undefined;
  t.lang = lang;
  return t;
}

/** Flatten to { "a.b.c": "text" }; arrays use numeric indexes. */
export function flatten(value, prefix = "", out = {}) {
  if (typeof value === "string") {
    out[prefix] = value;
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

export const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
