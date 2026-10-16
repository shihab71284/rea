# TaxCalculator.bd

Bilingual (English / বাংলা) Bangladesh tax calculators and guides, built from the
**Finance Act 2026**. A fast, privacy-first static website for **taxcalculator.bd**:
every calculation runs in the visitor's browser, with no backend, no accounts and no
tracking.

> This folder is self-contained. It is separate from the REA project and its `website/`
> in the rest of this repository, and it is not part of REA's build or CI.

## What is on the site

| Area        | Pages                                                                                                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Calculators | Income tax, salary tax and monthly TDS (including take-home to gross), investment rebate planner, VAT and supplementary duty (plus a multi-line invoice builder), corporate tax, early-filing rebate and late-filing tax, bulk payroll TDS (CSV export) |
| Reference   | Tax rates and slabs for every assessment year, tax calendar with `.ics` reminders                                                                                                                                                                       |
| Tools       | Private dashboard (saved calculations and a filing checklist, stored in the browser)                                                                                                                                                                    |
| Learn       | Six plain-language guides, FAQ                                                                                                                                                                                                                          |
| Archive     | A separate menu for older years: NBR circulars (পরিপত্র), directives (নির্দেশিকা), SRO notifications (প্রজ্ঞাপন) and laws (আইন) for income years up to 2021-22, linked from official sources. Browse by type or income year, or search every document         |
| Company     | About, contact (mailto form), privacy, disclaimer, 404                                                                                                                                                                                                  |

Everything exists in **English and Bangla** (`/` and `/bn/`) with Bangla digits and
lakh/crore formatting, light and dark themes, shareable URLs that restore a calculation,
print-friendly results and a mobile result bar.

The design combines three references: a **tool-workspace / dashboard** feel (vatx.bd),
a **corporate solutions landing page** (ibos.io) and an **information hub with calculators**
(bdtaxation). It is original work and is not affiliated with any of them.

## Quick start

Requires Node.js 22 or newer.

```sh
cd taxcalculator-bd
npm install
npm run dev      # build, serve on http://localhost:4173 and rebuild on change
```

| Command         | What it does                                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Dev server (`0.0.0.0:4173`) that rebuilds `dist/` when `src/` changes                                                                                      |
| `npm run build` | Production build into `dist/` (content-hashed assets, sitemap, icons, `_headers`)                                                                          |
| `npm start`     | Serve the existing `dist/`                                                                                                                                 |
| `npm test`      | Engine golden tests, formatting, translation parity, every report in both languages, guide examples vs the engine, full-site build and link/SEO/CSP checks |
| `npm run check` | Validate an already-built `dist/` (links, anchors, ids, hreflang, JSON-LD, no inline styles or scripts)                                                    |

Build options (environment variables): `SITE_URL` (canonical origin, default
`https://taxcalculator.bd`) and `SITE_BASE` (path prefix when hosted in a sub-folder).

## Deploying

See [DEPLOY.md](DEPLOY.md). In short: any static host works. Build with `npm run build` and
publish `dist/`. Cloudflare Pages, Netlify and Vercel need no extra configuration; this folder
ships `netlify.toml`, `vercel.json` and a `dist/_headers` file with a strict Content-Security-Policy.

## Before you launch: placeholders

- **`site.config.mjs` → `contactEmail`** is `hello@taxcalculator.bd`, a placeholder. Use a mailbox you control.
- `whatsapp` is empty (the WhatsApp button is hidden until you set a number).
- Read the wording on the About, Privacy and Disclaimer pages and adjust it to your organisation.

## Keeping the tax rules correct

All rates, thresholds and limits live in **one file**: [`src/core/rules.mjs`](src/core/rules.mjs),
with the sources listed at the top. When a new Finance Act or NBR notice changes something:

1. Update `rules.mjs` (and `src/core/calendar.mjs` for new dates).
2. Update the expected values in `tests/*.test.mjs`. The tests are written from hand calculations
   and published examples, so a failing test shows exactly which behaviour changed.
3. `tests/docs-examples.test.mjs` fails if a number quoted in a guide or explainer no longer
   matches the engine. Fix the copy in `src/i18n/en` **and** `src/i18n/bn`.
4. Set `rulesVerifiedOn` in `site.config.mjs`; the date is shown across the site.
5. Run `npm test`.

The figures were checked on 16 October 2026 against PwC Bangladesh's _Finance Act, 2026: Key
Amendments_, PwC Worldwide Tax Summaries and public analyses of the Act. The calculators are
estimates, not tax advice, and the site says so on every result.

### Scope and known limits

- Individual tax covers resident individuals and non-resident Bangladeshis (AY 2025-26, 2026-27, 2027-28; later years are shown on the rates page).
- Dividend, capital-gains and rental-income detail calculators are not included.
- The corporate calculator uses the rate card and turnover-tax check; special regimes need a professional.
- VAT is simplified: it does not model truncated-base rates, fixed amounts or withholding (VDS).
- The calendar covers FY 2026-27 (dates in `src/core/calendar.mjs`).
- There is no service worker, so the site does not work offline.

## The archive (income years up to 2021-22)

The **Archive** menu holds the circulars, directives, notifications and laws for income years
**2011-12 to 2021-22**, the last years the Income-tax Ordinance, 1984 governed (NBR's online lists
start there). Income year 2021-22 (1 July 2021 to 30 June 2022) is tax year 2022-23, the last one
assessed under the Ordinance; the Income Tax Act, 2023 (Act No. 12 of 2023) replaced it from income
year 2022-23. The site links to the
official PDF or page on `nbr.gov.bd`, `taxsurvey.gov.bd` or `bdlaws.minlaw.gov.bd`. It never hosts or
alters a document.

| Page                              | What it shows                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/archive/`                       | Overview, a card per document type and per income year, and a search over every document        |
| `/archive/circulars/`             | NBR's yearly income tax circulars (_paripatra_), with later clarifications as extra links       |
| `/archive/directives/`            | NBR's yearly return-filing and compliance guides for individuals (_nirdeshika_)                 |
| `/archive/notifications/`         | SROs (_prozapon_) from NBR's own list, searchable by number, year and subject                   |
| `/archive/laws/`                  | The Ordinance, its Rules and the Finance Acts 2009 to 2022                                      |
| `/archive/income-year-2021-22/` … | One page per income year: its circular, directive, notifications, Finance Act and standing laws |

Each page exists in English and Bangla (`/bn/archive/…`).

**How a document is filed.** NBR names its yearly circular and directive after the _tax_ year, so
"Circular 2022-23" is filed under income year 2021-22 (and always shown with NBR's own title).
Notifications are filed by the income year (1 July to 30 June) of the date NBR's list shows, and a
Finance Act under the income year whose tax year it set rates for. `src/archive/years.mjs` holds
this logic and the two constants that define the scope, `LAST_INCOME_YEAR` and `FIRST_INCOME_YEAR`;
a document outside them makes the build throw. The FAQ and intro copy in `src/i18n/*/page-archive.mjs`
use 2021-22 in a few worked examples, so update those too if you ever move the cutoff.

**Adding or updating a document.** The catalog is plain data, one constructor call per document:

- `src/archive/circulars.mjs`: circulars and directives (`circular()`, `directive()`)
- `src/archive/sros-*.mjs`: notifications (`sro()`), split by period to keep files short
- `src/archive/laws.mjs`: the Ordinance, the Rules and the Finance Acts (`standingLaw()`, `financeAct()`)

Give every document a title in **both** languages and an official link (`nbrPdf()`, `surveyPdf()`,
`bdlawsPage()`); give extra links a label. `tests/archive.test.mjs` fails on a missing translation,
a duplicate document or URL, a link outside the government hosts, a notification dated outside the
archive, or a circular filed under the wrong year. When you refresh the data from NBR's lists,
update `archiveCheckedOn` in `site.config.mjs`: the date is shown on the archive page.

**What the archive does not claim.** It lists what NBR publishes on its website, which is not every
SRO ever issued: NBR's income tax SRO list has nothing dated in income years 2012-13 and 2019-20, and
its dates are sometimes upload dates (SRO 160 of 2022 is dated 1 June 2022 in the PDF and 9 June in
the list). The titles are short bilingual summaries of NBR's descriptions, so the PDF remains the
authoritative text. VAT and customs documents are not included; the archive is about income tax.

The search box and filters are progressive enhancement: the full grouped list is plain HTML, so it
works without JavaScript and for crawlers, and `src/client/pages/archive.js` hides rows as you type.

## How it is built

No framework. A small Node script renders pages from templates and dictionaries; esbuild bundles
the browser code.

```
src/
  core/        pure tax engine and helpers (isomorphic, fully unit-tested)
  archive/     the document catalog behind the Archive menu (data and year logic, no rendering)
  views/       turns engine results into display "reports" (shared by site and browser)
  i18n/        en/ and bn/ dictionaries (one file per area, identical keys)
  site/        build-time page renderers, layout, components, icons, brand artwork
  client/      browser code: calculators, dashboard, calendar (native ES modules, bundled)
  styles/      design system (tokens, layout, components, calculators, pages, print)
scripts/       build.mjs, serve.mjs, check.mjs
tests/         node:test suites
```

Design decisions worth knowing:

- **One engine, three consumers.** The same `src/core` code renders worked examples at build time,
  drives the calculators in the browser and is exercised by the tests.
- **Strict translations.** The build throws on a missing key, and a test fails if English and
  Bangla differ in keys, placeholders, block structure or table shape.
- **Privacy.** Inputs never leave the browser. Only the theme, language choice, saved
  calculations and checklist are kept in `localStorage`.
- **No inline styles or scripts**, so the site runs under a strict CSP.
- **No committed binaries.** Fonts come from npm at build time. The favicon, app icons and the
  1200×630 social card are rendered from SVG by `resvg` during `npm run build`.
- **Accessibility.** Verified with axe-core (zero violations in light and dark themes on the main
  pages and the archive), keyboard-operable menus, labelled form controls, live result regions and reduced-motion support.

## Third-party assets

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md): Plus Jakarta Sans and Noto Sans Bengali
(OFL), Lucide icons (ISC), esbuild and resvg-js (MIT).
