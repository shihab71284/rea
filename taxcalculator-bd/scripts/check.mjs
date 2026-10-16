/**
 * Validates a built site (default ./dist): links, SEO tags, accessibility
 * references, CSP-safe markup and asset sizes.   node scripts/check.mjs [dir]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const attrValues = (html, name) =>
  [...html.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map((m) => m[1]);
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const withoutTemplates = (html) =>
  html.replace(/<template[\s\S]*?<\/template>/g, "");

function resolveTarget(dist, from, href) {
  const [pathPart] = href.split("#")[0].split("?");
  let path = pathPart.startsWith("/")
    ? join(dist, pathPart)
    : join(dirname(from), pathPart);
  if (!path.startsWith(dist)) return null;
  if (existsSync(path) && statSync(path).isDirectory())
    path = join(path, "index.html");
  return existsSync(path) ? path : null;
}

/** <head> and document-level requirements. */
function checkHead(html, lang, report) {
  if (!html.includes(`<html lang="${lang}">`))
    report.fail(`missing <html lang="${lang}">`);
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  if (!title) report.fail("missing <title>");
  else if (title.length > 75) report.warn(`title is ${title.length} chars`);
  const description = /<meta name="description" content="([^"]*)"/.exec(
    html,
  )?.[1];
  if (!description) report.fail("missing meta description");
  else if (description.length > 200)
    report.warn(`description is ${description.length} chars`);
  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html))
    report.fail("missing canonical");
  for (const code of ["en", "bn", "x-default"]) {
    if (!html.includes(`hreflang="${code}"`))
      report.fail(`missing hreflang ${code}`);
  }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) report.fail(`expected exactly one <h1>, found ${h1}`);
  if (!/<meta name="viewport"/.test(html)) report.fail("missing viewport meta");
  if (!/og:image/.test(html)) report.fail("missing og:image");
}

/** Markup that would break the strict Content-Security-Policy, plus JSON-LD validity. */
function checkMarkup(html, report) {
  if (/\sstyle="/.test(html))
    report.fail("inline style attribute (breaks strict CSP)");
  if (/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/.test(html)) {
    report.fail("inline script (breaks strict CSP)");
  }
  if (/\son[a-z]+="/.test(html)) report.fail("inline event handler");
  const blocks = html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  );
  for (const block of blocks) {
    try {
      JSON.parse(block[1]);
    } catch {
      report.fail("invalid JSON-LD");
    }
  }
}

/** Unique ids and every id reference (for, aria-*, #anchors) points at something. */
function checkIds(html, report) {
  const body = withoutTemplates(html);
  const ids = new Set();
  for (const id of attrValues(body, "id")) {
    if (ids.has(id)) report.fail(`duplicate id "${id}"`);
    ids.add(id);
  }
  const references = [
    "for",
    "aria-controls",
    "aria-labelledby",
    "aria-describedby",
  ];
  for (const attribute of references) {
    const tokens = attrValues(body, attribute).flatMap((value) =>
      value.split(/\s+/).filter(Boolean),
    );
    for (const id of tokens) {
      if (!ids.has(id))
        report.fail(`${attribute} points to missing id "${id}"`);
    }
  }
  for (const href of attrValues(body, "href")) {
    if (href.startsWith("#") && href.length > 1 && !ids.has(href.slice(1)))
      report.fail(`anchor ${href} has no target`);
  }
}

/** Internal links/assets exist (and fragments exist on the target page). */
function checkLinks(html, file, ctx, report) {
  const references = [...attrValues(html, "href"), ...attrValues(html, "src")];
  for (const raw of references) {
    const ref = decode(raw);
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref) || ref === "")
      continue;
    if (ctx.base !== "/" && !ref.startsWith(ctx.base)) {
      report.fail(`link outside base path: ${ref}`);
      continue;
    }
    const local = ctx.base !== "/" ? `/${ref.slice(ctx.base.length)}` : ref;
    const target = resolveTarget(ctx.dist, file, local);
    if (!target) {
      report.fail(`broken link ${ref}`);
      continue;
    }
    const fragment = ref.split("#")[1];
    if (
      fragment &&
      target.endsWith(".html") &&
      !ctx.idsOf(target).includes(fragment)
    ) {
      report.fail(`missing fragment ${ref}`);
    }
  }
  for (const match of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0]))
      report.fail("target=_blank link without rel=noopener");
  }
}

function checkAssets(dist, files, errors, warnings) {
  for (const file of files.filter((f) => /\.(css|js)$/.test(f))) {
    const kb = statSync(file).size / 1024;
    if (kb > 140)
      warnings.push(`${file.slice(dist.length + 1)}: ${kb.toFixed(0)} KB`);
  }
  const required = [
    "sitemap.xml",
    "robots.txt",
    "manifest.webmanifest",
    "favicon.svg",
    "favicon.ico",
    "assets/og-image.png",
    "404.html",
    "bn/404.html",
  ];
  for (const name of required) {
    if (!existsSync(join(dist, name))) errors.push(`missing ${name}`);
  }
  const manifest = join(dist, "manifest.webmanifest");
  if (existsSync(manifest)) JSON.parse(readFileSync(manifest, "utf8"));
}

function checkSitemap(dist, base, errors) {
  const file = join(dist, "sitemap.xml");
  const xml = existsSync(file) ? readFileSync(file, "utf8") : "";
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length < 20) errors.push(`sitemap has only ${locs.length} URLs`);
  const prefix = base === "/" ? "" : base.slice(0, -1);
  for (const loc of locs) {
    const path = new URL(loc).pathname.replace(prefix, "") || "/";
    if (!resolveTarget(dist, join(dist, "x"), path))
      errors.push(`sitemap URL not built: ${loc}`);
  }
  return locs.length;
}

export function checkSite(dist = join(root, "dist"), { base = "/" } = {}) {
  const errors = [];
  const warnings = [];
  const files = walk(dist);
  const pages = files.filter((file) => file.endsWith(".html"));
  const rel = (file) =>
    file
      .slice(dist.length + 1)
      .split(sep)
      .join("/");
  const idCache = new Map();
  const idsOf = (file) => {
    if (!idCache.has(file))
      idCache.set(
        file,
        attrValues(withoutTemplates(readFileSync(file, "utf8")), "id"),
      );
    return idCache.get(file);
  };

  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    const report = {
      fail: (message) => errors.push(`${rel(file)}: ${message}`),
      warn: (message) => warnings.push(`${rel(file)}: ${message}`),
    };
    checkHead(html, rel(file).startsWith("bn/") ? "bn" : "en", report);
    checkMarkup(html, report);
    checkIds(html, report);
    checkLinks(html, file, { dist, base, idsOf }, report);
    if (html.length > 160_000)
      report.warn(`${(html.length / 1024).toFixed(0)} KB of HTML`);
  }
  checkAssets(dist, files, errors, warnings);
  const sitemapUrls = checkSitemap(dist, base, errors);
  return { errors, warnings, pages: pages.length, sitemapUrls };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = resolve(process.argv[2] ?? join(root, "dist"));
  const { errors, warnings, pages, sitemapUrls } = checkSite(dist, {
    base: process.env.SITE_BASE ?? "/",
  });
  for (const warning of warnings) console.warn(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  console.log(
    `Checked ${pages} pages, ${sitemapUrls} sitemap URLs: ${errors.length} errors, ${warnings.length} warnings.`,
  );
  process.exit(errors.length ? 1 : 0);
}
