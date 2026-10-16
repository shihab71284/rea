import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, join, relative, resolve } from "node:path";
import { build, transform } from "esbuild";
import { Resvg } from "@resvg/resvg-js";
import { logoSvg, maskableSvg, ogSvg } from "../../src/site/brand.mjs";

const hash = (content) =>
  createHash("sha256").update(content).digest("hex").slice(0, 10);

export function write(dist, path, content) {
  const target = join(dist, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

/** @font-face rules taken from the fontsource packages, restricted to the subsets we need. */
function fontFaces(root, dist, packageName, subsets) {
  const base = join(root, "node_modules", "@fontsource-variable", packageName);
  const css = readFileSync(join(base, "wght.css"), "utf8");
  const blocks = css.match(/\/\*[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g) ?? [];
  const files = [];
  const rules = [];
  for (const subset of subsets) {
    const name = `${packageName}-${subset}-wght-normal`;
    const block = blocks.find((candidate) =>
      candidate.startsWith(`/* ${name} */`),
    );
    if (!block) throw new Error(`Font subset not found: ${name}`);
    const file = `${name}.woff2`;
    files.push(file);
    cpSync(join(base, "files", file), join(dist, "assets", "fonts", file), {
      recursive: true,
    });
    rules.push(
      block.replace(/\/\*[^*]*\*\/\s*/, "").replaceAll("./files/", "../fonts/"),
    );
  }
  return { rules: rules.join("\n"), files };
}

export async function buildCss(root, dist) {
  mkdirSync(join(dist, "assets", "fonts"), { recursive: true });
  const latin = fontFaces(root, dist, "plus-jakarta-sans", [
    "latin",
    "latin-ext",
  ]);
  const bengali = fontFaces(root, dist, "noto-sans-bengali", ["bengali"]);
  const dir = join(root, "src", "styles");
  const sheets = readdirSync(dir)
    .filter((file) => file.endsWith(".css"))
    .sort()
    .map((file) => readFileSync(join(dir, file), "utf8"));
  const source = [latin.rules, bengali.rules, ...sheets].join("\n");
  const { code } = await transform(source, {
    loader: "css",
    minify: true,
    target: "es2020",
  });
  const name = `assets/css/site.${hash(code)}.css`;
  write(dist, name, code);
  return {
    css: name,
    fonts: {
      latin: `assets/fonts/${latin.files[0]}`,
      bengali: `assets/fonts/${bengali.files[0]}`,
    },
  };
}

export async function buildScripts(root, dist) {
  const entriesDir = join(root, "src", "client", "entries");
  const names = readdirSync(entriesDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => basename(file, ".js"));
  const result = await build({
    absWorkingDir: root,
    entryPoints: Object.fromEntries(
      names.map((name) => [name, `src/client/entries/${name}.js`]),
    ),
    bundle: true,
    splitting: true,
    format: "esm",
    target: ["es2020"],
    minify: true,
    legalComments: "none",
    outdir: join(dist, "assets", "js"),
    entryNames: "[name]-[hash]",
    chunkNames: "chunks/[name]-[hash]",
    metafile: true,
    logLevel: "warning",
  });
  const js = {};
  for (const [output, meta] of Object.entries(result.metafile.outputs)) {
    if (!meta.entryPoint) continue;
    js[basename(meta.entryPoint, ".js")] = relative(dist, resolve(root, output))
      .split("\\")
      .join("/");
  }
  const themeInit = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("tcbd:theme");t=t?JSON.parse(t):null;if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t}catch(e){}})();`;
  const themeName = `assets/theme-init.${hash(themeInit)}.js`;
  write(dist, themeName, themeInit);
  return { js, themeInit: themeName };
}

const png = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();

/** Single-image .ico wrapper around a 32x32 PNG. */
function icoFromPng(data) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, data]);
}

export function buildImages(dist, config) {
  const logo = logoSvg();
  write(dist, "favicon.svg", logo);
  write(dist, "favicon.ico", icoFromPng(png(logo, 32)));
  write(dist, "apple-touch-icon.png", png(logo, 180));
  write(dist, "assets/icon-192.png", png(logo, 192));
  write(dist, "assets/icon-512.png", png(logo, 512));
  write(dist, "assets/icon-maskable-512.png", png(maskableSvg(), 512));
  write(dist, "assets/og-image.png", png(ogSvg(), 1200));
  const manifest = {
    name: config.name,
    short_name: "TaxCalc.bd",
    description:
      "Bangladesh income tax, salary tax, VAT and corporate tax calculators.",
    start_url: config.base,
    scope: config.base,
    display: "standalone",
    background_color: "#0a1b45",
    theme_color: config.themeColor,
    icons: [
      {
        src: `${config.base}assets/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${config.base}assets/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${config.base}assets/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  write(dist, "manifest.webmanifest", JSON.stringify(manifest, null, 2));
}
