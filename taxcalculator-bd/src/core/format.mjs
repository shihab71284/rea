/**
 * Number, money and date formatting for English and Bangla.
 * Hand-rolled (instead of Intl) so output is identical in every browser/ICU:
 * Bangladeshi lakh/crore grouping (12,34,567) and Bangla digits (১২,৩৪,৫৬৭).
 */

import { CRORE, LAKH } from "./rules.mjs";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const MINUS = "\u2212";

export const UNIT_WORDS = {
  en: { crore: "crore", lakh: "lakh", thousand: "thousand" },
  bn: { crore: "কোটি", lakh: "লাখ", thousand: "হাজার" },
};

export function toBnDigits(value) {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function toEnDigits(value) {
  return String(value).replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

export function localizeDigits(value, lang) {
  return lang === "bn" ? toBnDigits(value) : String(value);
}

/** "1234567" -> "12,34,567" (digits only, no sign or decimals). */
export function groupLakh(digits) {
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const parts = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) parts.unshift(rest);
  return `${parts.join(",")},${lastThree}`;
}

/** Round half away from zero to `decimals` places without binary-float drift. */
export function roundTo(value, decimals = 0) {
  const factor = 10 ** decimals;
  const scaled = Math.abs(value) * factor;
  const rounded = Math.round(scaled + Number.EPSILON * Math.max(1, scaled));
  return (Math.sign(value) * rounded) / factor;
}

export const roundTaka = (value) => roundTo(value, 0);
export const round2 = (value) => roundTo(value, 2);

/** Format a number with lakh grouping. `decimals` fixes the fraction length. */
export function formatNumber(value, { lang = "en", decimals = 0 } = {}) {
  if (!Number.isFinite(value)) return "\u2014";
  const rounded = roundTo(value, decimals);
  const fixed = Math.abs(rounded).toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const body = frac ? `${groupLakh(int)}.${frac}` : groupLakh(int);
  const signed = rounded < 0 ? `${MINUS}${body}` : body;
  return localizeDigits(signed, lang);
}

/** Taka amount: ৳12,34,567 (negative: −৳1,000). */
export function formatTaka(value, { lang = "en", decimals = 0 } = {}) {
  if (!Number.isFinite(value)) return "\u2014";
  const rounded = roundTo(value, decimals);
  const body = formatNumber(Math.abs(rounded), { lang, decimals });
  return `${rounded < 0 ? MINUS : ""}\u09F3${body}`;
}

/** Percentage such as 10% or 7.5% (digits localised). */
export function formatPercent(rate, { lang = "en", decimals } = {}) {
  const places = decimals ?? (Number.isInteger(rate) ? 0 : 1);
  return `${formatNumber(rate, { lang, decimals: places })}%`;
}

/** 1500000 -> "15 lakh"; 25000000 -> "2.5 crore". Below 1,000 returns the grouped number. */
export function formatCompact(value, lang = "en") {
  const abs = Math.abs(value);
  const words = UNIT_WORDS[lang] ?? UNIT_WORDS.en;
  const steps = [
    [CRORE, words.crore],
    [LAKH, words.lakh],
    [1_000, words.thousand],
  ];
  const step = steps.find(([size]) => abs >= size);
  if (!step) return formatNumber(value, { lang });
  const [size, unit] = step;
  const scaled = roundTo(abs / size, 2);
  const decimals = Number.isInteger(scaled)
    ? 0
    : roundTo(scaled, 1) === scaled
      ? 1
      : 2;
  const sign = value < 0 ? MINUS : "";
  return `${sign}${formatNumber(scaled, { lang, decimals })} ${unit}`;
}

/**
 * Parse what a person typed into an amount field. Accepts commas, spaces,
 * ৳ / Tk / BDT, Bangla digits and a unicode minus. Empty input is 0.
 * Returns NaN when the text is not a number.
 */
export function parseAmount(input) {
  if (typeof input === "number") return Number.isFinite(input) ? input : NaN;
  const cleaned = toEnDigits(String(input ?? ""))
    .replace(/tk\.?|bdt/gi, "")
    .replace(/[\s,\u09F3]/g, "")
    .replace(/[\u2212\u2013\u2014]/g, "-");
  if (cleaned === "") return 0;
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

const DATE_OPTIONS = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
};

/** Format a Date (or ISO yyyy-mm-dd) in the page language, e.g. "30 September 2026". */
export function formatDate(value, lang = "en", options = DATE_OPTIONS) {
  const date = value instanceof Date ? value : parseIsoDate(value);
  const locale = lang === "bn" ? "bn-BD-u-nu-beng" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    ...options,
  }).format(date);
}

/** Parse yyyy-mm-dd as a UTC date at midnight (no timezone surprises). */
export function parseIsoDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (both yyyy-mm-dd or Date); negative if `to` is earlier. */
export function daysBetween(from, to) {
  const a = from instanceof Date ? from : parseIsoDate(from);
  const b = to instanceof Date ? to : parseIsoDate(to);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Language-bound formatters used by page renderers, report builders and the browser scripts. */
export function makeFormatters(lang) {
  return {
    n: (value, options) => formatNumber(value, { lang, ...options }),
    taka: (value, options) => formatTaka(value, { lang, ...options }),
    percent: (value, options) => formatPercent(value, { lang, ...options }),
    compact: (value) => formatCompact(value, lang),
    digits: (value) => localizeDigits(value, lang),
    date: (value, options) => formatDate(value, lang, options),
  };
}
