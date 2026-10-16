/**
 * Zero-dependency static server for local preview.
 *   node scripts/serve.mjs [--port 4173] [--host 0.0.0.0] [--watch] [--no-build]
 * Serves ./dist with clean URLs (folders -> index.html) like Cloudflare Pages / Netlify.
 */
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const port = Number(option("port", process.env.PORT ?? 4173));
const host = option("host", "0.0.0.0");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function rebuild() {
  return new Promise((done) => {
    execFile(
      process.execPath,
      [join(root, "scripts", "build.mjs")],
      { cwd: root },
      (error, stdout, stderr) => {
        if (error) console.error(stderr || error.message);
        else console.log(stdout.trim());
        done();
      },
    );
  });
}

function locate(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const target = join(dist, clean);
  if (target !== dist && !target.startsWith(dist + sep)) return { status: 403 };
  if (existsSync(target) && statSync(target).isDirectory()) {
    if (!urlPath.endsWith("/")) return { status: 301, location: `${urlPath}/` };
    const index = join(target, "index.html");
    return existsSync(index) ? { status: 200, file: index } : { status: 404 };
  }
  return existsSync(target) ? { status: 200, file: target } : { status: 404 };
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  let result;
  try {
    result = locate(url.pathname);
  } catch {
    result = { status: 400 };
  }
  if (result.status === 301) {
    response.writeHead(301, { Location: result.location + url.search });
    return response.end();
  }
  let file = result.file;
  let status = result.status;
  if (status !== 200) {
    const notFound = join(
      dist,
      url.pathname.startsWith("/bn/") ? "bn" : "",
      "404.html",
    );
    file = existsSync(notFound) ? notFound : undefined;
    if (!file) {
      response.writeHead(status, { "Content-Type": "text/plain" });
      return response.end(`${status}`);
    }
  }
  response.writeHead(status, {
    "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  if (request.method === "HEAD") return response.end();
  createReadStream(file).pipe(response);
});

if (!args.includes("--no-build") || !existsSync(dist)) await rebuild();

server.listen(port, host, () => {
  console.log(
    `TaxCalculator.bd preview: http://localhost:${port}/ (listening on ${host})`,
  );
});

if (args.includes("--watch")) {
  let timer = 0;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 250);
  };
  watch(join(root, "src"), { recursive: true }, trigger);
  watch(join(root, "site.config.mjs"), trigger);
  console.log("Watching src/ for changes...");
}
