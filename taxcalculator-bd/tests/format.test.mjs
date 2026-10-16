import { test } from "node:test";
import assert from "node:assert/strict";
import {
  daysBetween,
  formatCompact,
  formatDate,
  formatNumber,
  formatPercent,
  formatTaka,
  groupLakh,
  parseAmount,
  roundTo,
  toBnDigits,
  toEnDigits,
} from "../src/core/format.mjs";

test("groupLakh uses the Bangladeshi 3-2-2 grouping", () => {
  assert.equal(groupLakh("0"), "0");
  assert.equal(groupLakh("999"), "999");
  assert.equal(groupLakh("1000"), "1,000");
  assert.equal(groupLakh("100000"), "1,00,000");
  assert.equal(groupLakh("1234567"), "12,34,567");
  assert.equal(groupLakh("123456789"), "12,34,56,789");
  assert.equal(groupLakh("1000000000"), "1,00,00,00,000");
});

test("digits convert both ways", () => {
  assert.equal(toBnDigits("2026-27"), "২০২৬-২৭");
  assert.equal(toEnDigits("১২,৩৪,৫৬৭"), "12,34,567");
});

test("formatNumber / formatTaka handle language, decimals and negatives", () => {
  assert.equal(formatNumber(1234567), "12,34,567");
  assert.equal(formatNumber(1234567, { lang: "bn" }), "১২,৩৪,৫৬৭");
  assert.equal(formatNumber(1234.5, { decimals: 2 }), "1,234.50");
  assert.equal(formatTaka(45000), "৳45,000");
  assert.equal(formatTaka(-1500), "\u2212৳1,500");
  assert.equal(formatTaka(1150.5, { decimals: 2, lang: "bn" }), "৳১,১৫০.৫০");
  assert.equal(formatNumber(Number.NaN), "\u2014");
  assert.equal(formatNumber(-0.2), "0", "tiny negatives do not render as -0");
});

test("formatPercent keeps one decimal only when needed", () => {
  assert.equal(formatPercent(10), "10%");
  assert.equal(formatPercent(7.5), "7.5%");
  assert.equal(formatPercent(22.5, { lang: "bn" }), "২২.৫%");
});

test("formatCompact speaks lakh and crore", () => {
  assert.equal(formatCompact(1_200_000), "12 lakh");
  assert.equal(formatCompact(12_500_000), "1.25 crore");
  assert.equal(formatCompact(1_500_000), "15 lakh");
  assert.equal(formatCompact(25_000), "25 thousand");
  assert.equal(formatCompact(999), "999");
  assert.equal(formatCompact(40_000_000), "4 crore");
  assert.equal(formatCompact(1_200_000, "bn"), "১২ লাখ");
  assert.equal(formatCompact(10_000_000, "bn"), "১ কোটি");
  assert.equal(formatCompact(1_250_000), "12.5 lakh");
});

test("parseAmount accepts what people actually type", () => {
  assert.equal(parseAmount("1,00,000"), 100000);
  assert.equal(parseAmount("১২,৩৪,৫৬৭"), 1234567);
  assert.equal(parseAmount("৳ 5,000"), 5000);
  assert.equal(parseAmount("Tk 5,000"), 5000);
  assert.equal(parseAmount("BDT 250000"), 250000);
  assert.equal(parseAmount("  "), 0);
  assert.equal(parseAmount(""), 0);
  assert.equal(parseAmount("12.5"), 12.5);
  assert.equal(parseAmount(".5"), 0.5);
  assert.equal(parseAmount("7."), 7);
  assert.equal(parseAmount("\u2212300"), -300);
  assert.equal(parseAmount(42), 42);
  assert.ok(Number.isNaN(parseAmount("abc")));
  assert.ok(Number.isNaN(parseAmount("1.2.3")));
  assert.ok(Number.isNaN(parseAmount("12 lakh")));
  assert.ok(Number.isNaN(parseAmount("-")));
});

test("roundTo rounds half away from zero without float drift", () => {
  assert.equal(roundTo(1.005, 2), 1.01);
  assert.equal(roundTo(2.5), 3);
  assert.equal(roundTo(-2.5), -3);
  assert.equal(roundTo(0.1 + 0.2, 2), 0.3);
  assert.equal(roundTo(12345.5), 12346);
});

test("dates format in both languages and diff in whole days", () => {
  assert.equal(formatDate("2026-12-31", "en"), "31 December 2026");
  assert.equal(formatDate("2026-12-31", "bn"), "৩১ ডিসেম্বর, ২০২৬");
  assert.equal(daysBetween("2026-10-16", "2026-12-31"), 76);
  assert.equal(daysBetween("2026-12-31", "2026-10-16"), -76);
  assert.equal(daysBetween("2027-02-28", "2027-03-01"), 1);
});
