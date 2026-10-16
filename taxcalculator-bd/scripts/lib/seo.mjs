import { write } from "./assets.mjs";

const xml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function writeSitemap(dist, config, entries) {
  const urls = entries
    .map((entry) => {
      const links = entry.alternates
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${xml(alt.href)}"/>`,
        )
        .join("\n");
      return `  <url>\n    <loc>${xml(entry.loc)}</loc>\n    <lastmod>${config.rulesVerifiedOn}</lastmod>\n${links}\n  </url>`;
    })
    .join("\n");
  write(
    dist,
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  );
}

export function writeStaticFiles(dist, config) {
  write(
    dist,
    "robots.txt",
    `User-agent: *\nAllow: /\n\nSitemap: ${config.url}${config.base}sitemap.xml\n`,
  );
  write(dist, "CNAME", `${config.domain}\n`);
  // Honoured by Cloudflare Pages and Netlify. Other hosts: copy these headers into their config.
  write(
    dist,
    "_headers",
    [
      "/*",
      "  X-Content-Type-Options: nosniff",
      "  X-Frame-Options: DENY",
      "  Referrer-Policy: strict-origin-when-cross-origin",
      "  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()",
      "  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
      "",
      "/assets/*",
      "  Cache-Control: public, max-age=31536000, immutable",
      "",
    ].join("\n"),
  );
}
