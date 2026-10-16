# Deploying taxcalculator.bd

The site is static. The build output in `dist/` can be served by any static host.

```sh
cd taxcalculator-bd
npm ci
npm test            # optional but recommended
npm run build       # writes dist/
```

Requirements: Node.js 22+. `dist/` is ignored by Git on purpose; hosts build it for you.

## Cloudflare Pages (recommended, free)

1. Create a Pages project and connect this GitHub repository.
2. **Root directory:** `taxcalculator-bd`
3. **Build command:** `npm ci && npm run build`
4. **Build output directory:** `dist`
5. **Environment variable:** `NODE_VERSION` = `22`
6. Deploy. Pages reads `dist/_headers` for the security headers and cache rules, and serves
   `dist/404.html` for unknown URLs.

### Custom domain `taxcalculator.bd`

Add `taxcalculator.bd` (and `www.taxcalculator.bd`) under _Custom domains_ in the Pages project.
An apex domain needs either Cloudflare as the DNS provider (change the domain's nameservers at your
`.bd` registrar) or an `ALIAS`/`ANAME` record, and a redirect from `www`. Follow the DNS records the
dashboard shows. HTTPS certificates are issued automatically.

## Netlify

Connect the repository, set the **base directory** to `taxcalculator-bd`. `netlify.toml` already sets
the build command (`npm run build`), publish directory (`dist`) and Node 22. Netlify also honours `dist/_headers`.

## Vercel

Import the repository and set the **Root Directory** to `taxcalculator-bd`. `vercel.json` provides the
install and build commands, output directory, trailing-slash behaviour and security headers.

## GitHub Pages

GitHub Pages serves one site per repository, so do not use it if this repository's own Pages site is
in use. For a project site under a sub-path, build with the base path:

```sh
SITE_BASE=/your-repo/ SITE_URL=https://your-user.github.io npm run build
```

and publish `dist/` with a Pages workflow. For the custom domain at the root, no `SITE_BASE` is needed
(`dist/CNAME` already contains `taxcalculator.bd`).

## Any other host or your own server

Upload the contents of `dist/`. Requirements:

- Serve `index.html` for folder URLs (`/income-tax-calculator/`), which is the default almost everywhere.
- Serve `404.html` for missing pages.
- Optional but recommended: copy the headers from `dist/_headers` into your server config
  (a strict Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`) and cache
  `/assets/*` as immutable (file names are content-hashed).

## After deploying

- Run `npm run check` locally (or `SITE_BASE=... npm run check`) to re-validate links, hreflang and JSON-LD.
- Submit `https://taxcalculator.bd/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Test a share link on WhatsApp/Facebook: the card comes from `/assets/og-image.png`.
- Replace the placeholder contact email in `site.config.mjs` before announcing the site.

## Updating after a budget or NBR notice

Edit `src/core/rules.mjs`, adjust the tests and the English/Bangla copy that quotes the numbers, run
`npm test`, then push. The host rebuilds and deploys. See the README section _Keeping the tax rules correct_.
