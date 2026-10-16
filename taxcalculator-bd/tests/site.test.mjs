import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "../scripts/build.mjs";
import { checkSite } from "../scripts/check.mjs";

const out = mkdtempSync(join(tmpdir(), "tcbd-site-"));
const read = (path) => readFileSync(join(out, path), "utf8");

test("the whole site builds in both languages", async () => {
  await buildSite({ out, quiet: true });
  for (const path of [
    "index.html",
    "bn/index.html",
    "income-tax-calculator/index.html",
    "bn/vat-calculator/index.html",
    "404.html",
    "bn/404.html",
    "guides/finance-act-2026-changes/index.html",
  ]) {
    assert.ok(existsSync(join(out, path)), path);
  }
});

test("built site passes link, SEO, accessibility-reference and CSP checks", () => {
  const { errors, pages } = checkSite(out);
  assert.deepEqual(errors, []);
  assert.equal(pages, 50);
});

test("language and SEO basics", () => {
  const en = read("index.html");
  const bn = read("bn/index.html");
  assert.match(en, /<html lang="en">/);
  assert.match(bn, /<html lang="bn">/);
  assert.match(bn, /hreflang="en" href="https:\/\/taxcalculator\.bd\/"/);
  assert.match(
    en,
    /<link rel="canonical" href="https:\/\/taxcalculator\.bd\/">/,
  );
  assert.match(
    bn,
    /<link rel="canonical" href="https:\/\/taxcalculator\.bd\/bn\/">/,
  );
  assert.match(
    read("sitemap.xml"),
    /xhtml:link rel="alternate" hreflang="bn" href="https:\/\/taxcalculator\.bd\/bn\/vat-calculator\/"/,
  );
  assert.match(
    read("robots.txt"),
    /Sitemap: https:\/\/taxcalculator\.bd\/sitemap\.xml/,
  );
  assert.match(read("_headers"), /Content-Security-Policy/);
  assert.equal(read("CNAME").trim(), "taxcalculator.bd");
});

test("noindex pages stay out of the sitemap", () => {
  const sitemap = read("sitemap.xml");
  assert.ok(!sitemap.includes("/dashboard/"));
  assert.ok(!sitemap.includes("404"));
  assert.match(
    read("dashboard/index.html"),
    /<meta name="robots" content="noindex, follow">/,
  );
});

test("Bangla pages preload the Bengali font, English pages do not", () => {
  assert.match(
    read("bn/index.html"),
    /noto-sans-bengali-bengali-wght-normal\.woff2/,
  );
  assert.ok(!read("index.html").includes("noto-sans-bengali-bengali"));
});

test("assets are content-hashed and self-hosted", () => {
  const html = read("index.html");
  assert.match(html, /assets\/css\/site\.[0-9a-f]{10}\.css/);
  assert.match(html, /assets\/js\/home-[A-Z0-9]+\.js/);
  assert.ok(!/https?:\/\/(fonts|cdn|unpkg|cdnjs)/.test(html));
});

test("cleanup", () => {
  rmSync(out, { recursive: true, force: true });
  assert.ok(!existsSync(out));
});
