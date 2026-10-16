import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";
import { buildCss, buildImages, buildScripts, write } from "./lib/assets.mjs";
import { writeSitemap, writeStaticFiles } from "./lib/seo.mjs";
import { createContext } from "../src/site/context.mjs";
import { renderDocument } from "../src/site/layout.mjs";
import { PAGES } from "../src/site/pages/index.mjs";
import { PATHS } from "../src/site/registry.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** English pages live at the path itself, Bangla under /bn/. */
const outputPath = (path, lang) => {
  const rest = path.replace(/^\//, "");
  const base = lang === "bn" ? `bn/${rest}` : rest;
  return base.endsWith("/") || base === "" ? `${base}index.html` : base;
};

export async function buildSite({
  out = join(root, "dist"),
  quiet = false,
} = {}) {
  const started = Date.now();
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const css = await buildCss(root, out);
  const scripts = await buildScripts(root, out);
  buildImages(out, config);
  const assets = { ...css, ...scripts };

  const sitemap = [];
  for (const lang of config.languages) {
    for (const entry of PAGES) {
      const ctx = createContext({ lang, assets });
      const page = entry.render(ctx);
      write(out, outputPath(PATHS[page.id], lang), renderDocument(ctx, page));
      if (
        lang === config.defaultLanguage &&
        !page.noindex &&
        page.id !== "notFound"
      ) {
        sitemap.push({
          loc: ctx.absolute(ctx.pageUrl(page.id, "en")),
          alternates: [
            ...config.languages.map((code) => ({
              lang: code,
              href: ctx.absolute(ctx.pageUrl(page.id, code)),
            })),
            {
              lang: "x-default",
              href: ctx.absolute(ctx.pageUrl(page.id, "en")),
            },
          ],
        });
      }
    }
  }
  writeSitemap(out, config, sitemap);
  writeStaticFiles(out, config);
  if (!quiet)
    console.log(
      `Built ${PAGES.length * config.languages.length} pages into ${out} in ${Date.now() - started} ms`,
    );
  return { out, assets };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildSite();
}
