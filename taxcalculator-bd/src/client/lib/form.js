import {
  groupLakh,
  parseAmount,
  toBnDigits,
  toEnDigits,
} from "../../core/format.mjs";
import { fmt } from "./fmt.js";
import { lang, t } from "./i18n.js";

const SIGNIFICANT = /[0-9\u09E6-\u09EF.]/;

/** Re-group digits as the user types: "1200000" -> "12,00,000" (Bangla digits on bn pages). */
export function formatTyping(text) {
  const ascii = toEnDigits(text).replace(/[^0-9.]/g, "");
  const firstDot = ascii.indexOf(".");
  const intPart = (firstDot === -1 ? ascii : ascii.slice(0, firstDot)).replace(
    /^0+(?=\d)/,
    "",
  );
  const fraction =
    firstDot === -1
      ? ""
      : ascii
          .slice(firstDot + 1)
          .replace(/\./g, "")
          .slice(0, 2);
  const out = groupLakh(intPart) + (firstDot === -1 ? "" : `.${fraction}`);
  return lang === "bn" ? toBnDigits(out) : out;
}

function reformatInput(input) {
  const before = input.value;
  const caret = input.selectionStart ?? before.length;
  const typedBeforeCaret = before
    .slice(0, caret)
    .replace(/[^0-9\u09E6-\u09EF.]/g, "").length;
  const next = formatTyping(before);
  if (next === before) return;
  input.value = next;
  let seen = 0;
  let position = 0;
  while (position < next.length && seen < typedBeforeCaret) {
    if (SIGNIFICANT.test(next[position])) seen += 1;
    position += 1;
  }
  input.setSelectionRange(position, position);
}

const num = (value) => (Number.isFinite(value) ? value : 0);

/** Current values keyed by input name: amounts as numbers, checkboxes as booleans. */
export function readForm(form) {
  const values = {};
  for (const element of form.elements) {
    const { name, type } = element;
    if (!name || element.disabled) continue;
    if (type === "radio") {
      if (element.checked) values[name] = element.value;
    } else if (type === "checkbox") {
      values[name] = element.checked;
    } else if (element.dataset.type === "amount") {
      values[name] = num(parseAmount(element.value));
    } else if (element.dataset.type === "int") {
      values[name] = Math.max(0, parseInt(toEnDigits(element.value), 10) || 0);
    } else {
      values[name] = element.value;
    }
  }
  return values;
}

/** Push values into the form (used for URL state). Unknown names are ignored. */
export function writeForm(form, values) {
  for (const element of form.elements) {
    const { name, type } = element;
    if (!name || !(name in values)) continue;
    const value = values[name];
    if (type === "radio") element.checked = element.value === String(value);
    else if (type === "checkbox")
      element.checked = value === true || value === "1" || value === "true";
    else if (element.dataset.type === "amount")
      element.value = value ? formatTyping(String(value)) : "";
    else element.value = String(value);
  }
}

/** Query string with only the values that differ from `defaults`. */
export function toQuery(values, defaults) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (
      value === defaults[key] ||
      value === "" ||
      value === null ||
      value === undefined
    )
      continue;
    if (typeof value === "boolean") params.set(key, "1");
    else if (typeof value === "number") {
      if (value) params.set(key, String(value));
    } else params.set(key, String(value));
  }
  return params.toString();
}

export function fromQuery(search) {
  return Object.fromEntries(new URLSearchParams(search));
}

/** Show "= 12 lakh" helpers under amount fields. */
export function updateWords(form) {
  for (const target of form.querySelectorAll("[data-words-for]")) {
    const input = form.elements[target.dataset.wordsFor];
    const value = input ? parseAmount(input.value) : 0;
    target.textContent =
      Number.isFinite(value) && value >= 1000
        ? t("ui.common.amountHint", { value: fmt.compact(value) })
        : "";
  }
}

/** Show/hide fields with data-show-when="name=a,b" (several clauses: "mode=add;preset=custom"). */
export function applyConditions(form, values) {
  for (const element of form.querySelectorAll("[data-show-when]")) {
    const visible = element.dataset.showWhen.split(";").every((clause) => {
      const [name, accepted] = clause.split("=");
      return accepted.split(",").includes(String(values[name]));
    });
    element.hidden = !visible;
  }
}

/** Live grouping, +/- steppers. Calls `onChange` after any edit. */
export function bindInputs(form, onChange) {
  form.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.dataset.type === "amount")
      reformatInput(target);
    onChange(event);
  });
  form.addEventListener("change", onChange);
  form.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-step]");
    if (!button) return;
    const input = form.elements[button.dataset.target];
    const min = Number(input.min || 0);
    const max = Number(input.max || 99);
    const next = Math.min(
      max,
      Math.max(
        min,
        (parseInt(toEnDigits(input.value), 10) || 0) +
          Number(button.dataset.step),
      ),
    );
    input.value = String(next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.tagName === "INPUT")
      event.preventDefault();
  });
}
