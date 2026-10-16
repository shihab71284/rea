import { test } from "node:test";
import assert from "node:assert/strict";
import { dictionaries } from "../src/i18n/dictionaries.mjs";
import { flatten, placeholders } from "../src/i18n/index.mjs";
import { eventDesc, eventTitle } from "../src/views/calendar-text.mjs";
import { createTranslator } from "../src/i18n/index.mjs";
import { makeFormatters } from "../src/core/format.mjs";
import { TAX_EVENTS } from "../src/core/calendar.mjs";

const en = flatten(dictionaries.en);
const bn = flatten(dictionaries.bn);

test("English and Bangla dictionaries have exactly the same keys", () => {
  const onlyEn = Object.keys(en).filter((key) => !(key in bn));
  const onlyBn = Object.keys(bn).filter((key) => !(key in en));
  assert.deepEqual(onlyEn, [], "keys missing in Bangla");
  assert.deepEqual(onlyBn, [], "keys missing in English");
});

test("no translation is empty and placeholders match in both languages", () => {
  for (const [key, text] of Object.entries(en)) {
    // Block-type tags ("h2", "p", "info" ...) are structural and identical in both languages.
    assert.ok(
      text.trim().length > 0 || key.endsWith(".none"),
      `empty English text: ${key}`,
    );
    assert.ok(
      bn[key] !== undefined && (bn[key].trim().length > 0 || text === ""),
      `empty Bangla text: ${key}`,
    );
    assert.deepEqual(
      placeholders(bn[key] ?? ""),
      placeholders(text),
      `placeholders differ: ${key}`,
    );
  }
});

const BLOCK_TYPES = new Set([
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "callout",
  "table",
  "steps",
  "slabExample",
  "details",
]);

function collectBlocks(node, path = "", out = {}) {
  if (Array.isArray(node)) {
    const isBlocks =
      node.length > 0 &&
      node.every((item) => Array.isArray(item) && BLOCK_TYPES.has(item[0]));
    if (isBlocks) out[path] = node;
    node.forEach((child, index) =>
      collectBlocks(child, `${path}.${index}`, out),
    );
  } else if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node))
      collectBlocks(child, path ? `${path}.${key}` : key, out);
  }
  return out;
}

test("long-form content has the same block structure in both languages", () => {
  const enBlocks = collectBlocks(dictionaries.en);
  const bnBlocks = collectBlocks(dictionaries.bn);
  assert.ok(
    Object.keys(enBlocks).length >= 12,
    "expected explainers and guides to be found",
  );
  assert.deepEqual(Object.keys(bnBlocks), Object.keys(enBlocks));
  for (const [path, blocks] of Object.entries(enBlocks)) {
    assert.deepEqual(
      bnBlocks[path].map((block) => block[0]),
      blocks.map((block) => block[0]),
      `block order differs at ${path}`,
    );
    blocks.forEach((block, index) => {
      if (block[0] === "table") {
        assert.equal(
          bnBlocks[path][index][1].length,
          block[1].length,
          `table columns differ at ${path}[${index}]`,
        );
        assert.equal(
          bnBlocks[path][index][2].length,
          block[2].length,
          `table rows differ at ${path}[${index}]`,
        );
      }
      if (block[0] === "ul" || block[0] === "ol") {
        assert.equal(
          bnBlocks[path][index][1].length,
          block[1].length,
          `list length differs at ${path}[${index}]`,
        );
      }
    });
  }
});

test("Bangla copy is actually Bangla (no untranslated English paragraphs)", () => {
  const allowed = /^(TaxCalculator\.bd|CSV|https?:|[\d\s.,%+\-:\u09F3a-z]*$)/i;
  const suspicious = Object.entries(bn).filter(
    ([key, text]) =>
      text.length > 25 &&
      !/[\u0980-\u09FF]/.test(text) &&
      !allowed.test(text) &&
      !key.endsWith("placeholder"),
  );
  assert.deepEqual(suspicious, []);
});

test("Bangla copy uses Bangla digits for numbers (no stray ASCII digits in prose)", () => {
  // Amounts typed into examples (e.g. 85000 in payroll samples) and codes are allowed.
  const allowedKeys = /(example|placeholder|slabExample)/;
  const offenders = Object.entries(bn).filter(([key, text]) => {
    if (allowedKeys.test(key)) return false;
    const stripped = text
      .replace(/\{[a-z0-9]+\}/gi, "")
      .replace(/`[^`]*`|\*[A-Za-z][^*]*\*/g, "")
      .replace(/\(https?:[^)]*\)|\]\([^)]*\)/g, "")
      .replace(/mailto:\S+/g, "");
    return (
      /[\u0980-\u09FF]/.test(stripped) &&
      /\d/.test(
        stripped
          .replace(/\bCSV\b|\bTIN\b/g, "")
          .replace(/[A-Za-z]+[\d.]+|[\d.]+[A-Za-z]+/g, ""),
      )
    );
  });
  assert.deepEqual(
    offenders.map(([key]) => key),
    [],
  );
});

test("calendar event wording resolves for every event in both languages", () => {
  for (const lang of ["en", "bn"]) {
    const ctx = {
      t: createTranslator(dictionaries[lang], lang, { strict: true }),
      fmt: makeFormatters(lang),
    };
    for (const event of TAX_EVENTS) {
      const title = eventTitle(event, ctx);
      assert.ok(
        title.length > 5 && !title.includes("{"),
        `${lang} ${event.id}`,
      );
      assert.ok(
        !eventDesc(event, ctx).includes("{"),
        `${lang} ${event.id} desc`,
      );
    }
  }
});
