/**
 * Tiny HTML templating: `html` escapes every interpolation unless it is
 * already `raw`. Used by every page renderer so copy can never inject markup.
 */

export class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new Raw(String(value ?? ""));

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

function renderValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === false ||
    value === true
  )
    return "";
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(renderValue).join("");
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1)
    out += renderValue(values[i]) + strings[i + 1];
  return raw(out);
}

export const join = (items, separator = "") =>
  raw(items.map(renderValue).join(separator));

/** Attribute string (with leading space). `true` renders a bare attribute; null/false skip. */
export function attrs(map = {}) {
  const parts = [];
  for (const [name, value] of Object.entries(map)) {
    if (value === null || value === undefined || value === false) continue;
    parts.push(value === true ? name : `${name}="${esc(value)}"`);
  }
  return raw(parts.length ? ` ${parts.join(" ")}` : "");
}

/**
 * Inline markup for translated copy: **bold**, *italic*, `code`, [text](url).
 * Everything else is escaped. External URLs open in a new tab.
 */
export function inline(text) {
  const escaped = esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<![*\w])\*([^*]+)\*(?![*\w])/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
      const external = /^https?:/.test(href);
      const extra = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${href}"${extra}>${label}</a>`;
    });
  return raw(escaped);
}
