export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
export const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

export function debounce(fn, wait) {
  let timer = 0;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  wrapped.flush = (...args) => {
    clearTimeout(timer);
    fn(...args);
  };
  return wrapped;
}

/** Inline SVG icon that points at the page's sprite (see CORE_ICONS in site/context.mjs). */
export const icon = (name, className = "") =>
  `<svg class="icon ${className}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

/** Today as yyyy-mm-dd in the visitor's local time zone. */
export function localToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
