import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite } from "../scripts/build.mjs";
import { checkSite } from "../scripts/check.mjs";
import {
  BUCKETS,
  DOCUMENTS,
  TYPES,
  countsOfYear,
  documentsOfType,
  documentsOfYear,
  firstYearOf,
  groupByBucket,
} from "../src/archive/catalog.mjs";
import {
  ALL,
  ARCHIVE_YEARS,
  BEFORE,
  FIRST_INCOME_YEAR,
  LAST_INCOME_YEAR,
  bucketOf,
  incomeYearDates,
  incomeYearOfDate,
  incomeYearOfTaxYear,
  taxYearOf,
} from "../src/archive/years.mjs";
import { ayInfo } from "../src/core/rules.mjs";
import { docRef } from "../src/site/archive-ui.mjs";

/** The only sites the archive links to, and the source label each one carries. */
const SOURCE_OF_HOST = {
  "nbr.gov.bd": "nbr",
  "taxsurvey.gov.bd": "survey",
  "bdlaws.minlaw.gov.bd": "bdlaws",
};
const BANGLA = /[\u0980-\u09FF]/;

test("income years and tax years convert both ways", () => {
  assert.equal(taxYearOf("2021-22"), "2022-23");
  assert.equal(incomeYearOfTaxYear("2022-23"), "2021-22");
  assert.equal(taxYearOf("2009-10"), "2010-11");
  assert.equal(taxYearOf("1999-00"), "2000-01");
  assert.deepEqual(incomeYearDates("2021-22"), {
    from: "2021-07-01",
    to: "2022-06-30",
  });
  // The income year runs 1 July to 30 June.
  assert.equal(incomeYearOfDate("2022-06-30"), "2021-22");
  assert.equal(incomeYearOfDate("2022-07-01"), "2022-23");
  assert.equal(incomeYearOfDate("2022-01-15"), "2021-22");
  assert.equal(incomeYearOfDate("2021-12-31"), "2021-22");
});

test("the year helpers agree with the calculators' assessment-year logic", () => {
  for (const year of ARCHIVE_YEARS)
    assert.equal(ayInfo(taxYearOf(year)).incomeYear, year);
});

test("the archive covers income years 2011-12 to 2021-22, newest first", () => {
  assert.equal(LAST_INCOME_YEAR, "2021-22");
  assert.equal(FIRST_INCOME_YEAR, "2011-12");
  assert.equal(ARCHIVE_YEARS.length, 11);
  assert.equal(ARCHIVE_YEARS[0], "2021-22");
  assert.equal(ARCHIVE_YEARS.at(-1), "2011-12");
  assert.deepEqual(BUCKETS, [ALL, ...ARCHIVE_YEARS, BEFORE]);
  assert.equal(bucketOf("2008-09"), BEFORE);
  assert.equal(bucketOf("2015-16"), "2015-16");
  assert.throws(() => bucketOf("2022-23"), /Outside the archive/);
});

test("the catalog has every kind of document, each listed once", () => {
  assert.deepEqual(TYPES, ["circular", "directive", "sro", "law"]);
  for (const type of TYPES)
    assert.ok(documentsOfType(type).length > 0, `no ${type} documents`);
  const ids = DOCUMENTS.map((doc) => doc.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate ids");
  const urls = DOCUMENTS.flatMap((doc) => doc.links.map((link) => link.url));
  assert.equal(new Set(urls).size, urls.length, "a URL is listed twice");
  assert.equal(
    TYPES.reduce((sum, type) => sum + documentsOfType(type).length, 0),
    DOCUMENTS.length,
  );
});

test("every document is bilingual, in scope and has an official link", () => {
  for (const doc of DOCUMENTS) {
    assert.ok(TYPES.includes(doc.type), doc.id);
    assert.ok(BUCKETS.includes(doc.incomeYear), `${doc.id}: ${doc.incomeYear}`);
    for (const lang of ["en", "bn"]) {
      assert.ok(doc.title[lang]?.trim().length > 3, `${doc.id}: ${lang} title`);
      if (doc.note)
        assert.ok(doc.note[lang]?.trim().length > 3, `${doc.id}: ${lang} note`);
    }
    assert.ok(BANGLA.test(doc.title.bn), `${doc.id}: Bangla title is Bangla`);
    // Numbers in Bangla copy are written with Bangla digits.
    const bareDigits = doc.title.bn.replace(/[A-Za-z]+\d*|\d+[A-Za-z]+/g, "");
    assert.ok(!/\d/.test(bareDigits), `${doc.id}: ASCII digits in Bangla`);
    assert.ok(doc.links.length >= 1, `${doc.id}: no link`);
  }
});

test("links point at official government sites and are well formed", () => {
  for (const doc of DOCUMENTS) {
    doc.links.forEach((link, index) => {
      const url = new URL(link.url);
      assert.equal(
        SOURCE_OF_HOST[url.hostname],
        link.source,
        `${doc.id}: ${url.hostname} is not labelled as ${link.source}`,
      );
      assert.doesNotThrow(
        () => decodeURIComponent(url.pathname),
        `${doc.id}: bad percent-encoding`,
      );
      assert.ok(["pdf", "web"].includes(link.kind), doc.id);
      if (link.kind === "pdf")
        assert.match(url.pathname, /\.pdf$/i, `${doc.id}: not a PDF`);
      if (index === 0)
        assert.equal(link.label, undefined, `${doc.id}: primary link label`);
      else
        assert.ok(
          link.label?.en && link.label?.bn,
          `${doc.id}: extra links need labels in both languages`,
        );
    });
  }
});

test("notifications are filed by the income year of their date, and stay in scope", () => {
  const sros = documentsOfType("sro");
  assert.ok(sros.length >= 90);
  for (const doc of sros) {
    assert.match(doc.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      doc.date <= "2022-06-30",
      `${doc.id} is after income year 2021-22`,
    );
    assert.equal(doc.incomeYear, bucketOf(incomeYearOfDate(doc.date)), doc.id);
    assert.ok(doc.date >= "2011-07-01", `${doc.id} is before the first year`);
    // NBR sometimes lists an SRO long after it was issued; the number's year shows it.
    if (doc.ref.year !== Number(doc.date.slice(0, 4)))
      assert.ok(doc.note, `${doc.id}: number year differs from its date`);
  }
  // The same number appears twice only where NBR itself reuses it, and we say so.
  const seen = new Map();
  for (const doc of sros) {
    const key = `${doc.ref.year}/${doc.ref.no}`;
    if (seen.has(key)) {
      assert.ok(doc.note && seen.get(key).note, `duplicate SRO ${key}`);
    }
    seen.set(key, doc);
  }
});

test("circulars and directives are filed one year before NBR's label", () => {
  for (const doc of [
    ...documentsOfType("circular"),
    ...documentsOfType("directive"),
  ]) {
    assert.match(doc.taxYear, /^\d{4}-\d{2}$/);
    assert.equal(doc.incomeYear, incomeYearOfTaxYear(doc.taxYear), doc.id);
    assert.ok(ARCHIVE_YEARS.includes(doc.incomeYear), doc.id);
  }
  const circular2223 = DOCUMENTS.find((doc) => doc.id === "circular-2022-23");
  assert.equal(circular2223.incomeYear, "2021-22");
  assert.equal(
    circular2223.links.length,
    3,
    "circular plus two clarifications",
  );
  assert.equal(firstYearOf("directive"), "2015-16");
  assert.equal(firstYearOf("circular"), "2011-12");
});

test("each year has its Finance Act, and the standing laws are every-year", () => {
  for (const year of ARCHIVE_YEARS) {
    const acts = documentsOfYear(year).filter((doc) => doc.actYear);
    assert.equal(acts.length, 1, `Finance Act for ${year}`);
    assert.equal(acts[0].actYear, Number(taxYearOf(year).slice(0, 4)));
  }
  const early = documentsOfYear(BEFORE).map((doc) => doc.actYear);
  assert.deepEqual(early, [2011, 2010, 2009]);
  const standing = documentsOfYear(ALL).map((doc) => doc.id);
  assert.deepEqual(standing.sort(), [
    "law-income-tax-ordinance-1984",
    "law-income-tax-rules-1984",
  ]);
  const act2022 = DOCUMENTS.find((doc) => doc.id === "law-finance-act-2022");
  assert.deepEqual(act2022.ref, { kind: "act", no: 13, year: 2022 });
  assert.equal(act2022.date, "2022-06-30");
});

test("documents are sorted newest year first and grouped by year", () => {
  const ranks = DOCUMENTS.map((doc) => BUCKETS.indexOf(doc.incomeYear));
  assert.deepEqual(
    ranks,
    [...ranks].sort((a, b) => a - b),
  );
  const groups = groupByBucket(DOCUMENTS);
  assert.equal(groups.length, BUCKETS.length);
  assert.equal(
    groups.reduce((sum, group) => sum + group.docs.length, 0),
    DOCUMENTS.length,
  );
  const sroDates = documentsOfType("sro").map((doc) => doc.date);
  const inYear = documentsOfYear("2020-21").filter((doc) => doc.type === "sro");
  assert.deepEqual(
    inYear.map((doc) => doc.date),
    inYear
      .map((doc) => doc.date)
      .sort()
      .reverse(),
  );
  assert.ok(sroDates.length > 0);
  assert.deepEqual(countsOfYear("2019-20"), {
    circular: 1,
    directive: 1,
    sro: 0,
    law: 1,
  });
});

test("references read the way NBR writes them, in both languages", () => {
  const find = (id) => DOCUMENTS.find((doc) => doc.id === id);
  const sro = find("sro-2021-06-03-167");
  assert.equal(docRef(sro, "en"), "S.R.O. No. 167-Law/Income Tax/2021");
  assert.equal(docRef(sro, "bn"), "এস.আর.ও. নং ১৬৭-আইন/আয়কর/২০২১");
  const padded = find("sro-2020-07-08-02");
  assert.equal(docRef(padded, "en"), "S.R.O. No. 02-Law/Income Tax/2020");
  assert.equal(docRef(padded, "bn"), "এস.আর.ও. নং ০২-আইন/আয়কর/২০২০");
  assert.equal(
    docRef(find("sro-2015-11-09-324"), "en"),
    "S.R.O. No. 324-Law/Travel/2015",
  );
  assert.equal(
    docRef(find("sro-2014-06-26-159"), "en"),
    "S.R.O. No. 159-Law/2014",
  );
  assert.equal(
    docRef(find("law-income-tax-ordinance-1984"), "en"),
    "Ordinance No. XXXVI of 1984",
  );
  assert.equal(
    docRef(find("law-income-tax-ordinance-1984"), "bn"),
    "১৯৮৪ সনের ৩৬ নং অধ্যাদেশ",
  );
  assert.equal(
    docRef(find("law-finance-act-2022"), "en"),
    "Act No. 13 of 2022",
  );
  assert.equal(
    docRef(find("law-finance-act-2022"), "bn"),
    "২০২২ সনের ১৩ নং আইন",
  );
  assert.equal(docRef(find("circular-2021-22"), "en"), "");
});

// ---- the built pages -------------------------------------------------------

const out = mkdtempSync(join(tmpdir(), "tcbd-archive-"));
const read = (path) => readFileSync(join(out, path), "utf8");
const rows = (html) => [...html.matchAll(/<li\s+class="doc"/g)].length;
const primaryLinks = (html) =>
  [...html.matchAll(/class="doc-open" href="([^"]+)"/g)].map((m) => m[1]);

test("the archive pages are built in both languages and pass the site checks", async () => {
  await buildSite({ out, quiet: true });
  const { errors, warnings } = checkSite(out);
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
  for (const prefix of ["", "bn/"]) {
    for (const path of [
      "archive/",
      "archive/circulars/",
      "archive/directives/",
      "archive/notifications/",
      "archive/laws/",
      ...ARCHIVE_YEARS.map((year) => `archive/income-year-${year}/`),
    ])
      assert.ok(read(`${prefix}${path}index.html`).length > 1000, path);
  }
});

test("the hub lists every document, with search controls that need scripts", () => {
  const hub = read("archive/index.html");
  assert.equal(rows(hub), DOCUMENTS.length);
  assert.match(hub, /data-library data-total="132"/);
  assert.match(hub, /data-library-q/);
  assert.match(hub, /data-library-type="sro"/);
  assert.match(hub, /<script type="module" src="[^"]*archive-/);
  // Rows are plain HTML so the list works without JavaScript and for crawlers.
  assert.ok(!/<li\s+class="doc"[^>]*\shidden/.test(hub));
  const sroPage = read("archive/notifications/index.html");
  assert.equal(rows(sroPage), documentsOfType("sro").length);
  assert.ok(
    !/data-library-type=/.test(sroPage),
    "no type filter on the SRO page",
  );
});

test("each page lists the right documents, and both languages list the same ones", () => {
  const pairs = [
    ["archive/", DOCUMENTS.length],
    ["archive/circulars/", documentsOfType("circular").length],
    ["archive/directives/", documentsOfType("directive").length],
    ["archive/notifications/", documentsOfType("sro").length],
    ["archive/laws/", documentsOfType("law").length],
    ...ARCHIVE_YEARS.map((year) => [
      `archive/income-year-${year}/`,
      documentsOfYear(year).length + 2,
    ]),
  ];
  for (const [path, expected] of pairs) {
    const en = read(`${path}index.html`);
    const bn = read(`bn/${path}index.html`);
    assert.equal(rows(en), expected, path);
    assert.deepEqual(
      primaryLinks(bn),
      primaryLinks(en),
      `${path} differs by language`,
    );
    assert.match(bn, /<html lang="bn">/);
  }
});

test("year pages explain the income year, tax year and Finance Act", () => {
  const page = read("archive/income-year-2021-22/index.html");
  assert.match(
    page,
    /<title>Income Year 2021-22 \(Tax Year 2022-23\) Archive \| /,
  );
  assert.match(page, /1 July 2021 to 30 June 2022/);
  assert.match(page, /The Finance Act, 2022/);
  assert.match(page, /S\.R\.O\. No\. 160-Law\/Income Tax\/2022/);
  assert.match(page, /aria-current="page"[^>]*>2021-22</);
  const bn = read("bn/archive/income-year-2021-22/index.html");
  assert.match(bn, /এস\.আর\.ও\. নং ১৬০-আইন\/আয়কর\/২০২২/);
  assert.match(bn, /২০২১-২২/);
  const empty = read("archive/income-year-2019-20/index.html");
  assert.match(
    empty,
    /NBR&#39;s list has no notification dated in this income year/,
  );
});

test("the Archive menu is in the header, the mobile menu and the footer of every page", () => {
  for (const path of [
    "index.html",
    "income-tax-calculator/index.html",
    "bn/faq/index.html",
  ]) {
    const html = read(path);
    assert.match(html, /aria-controls="menu-archive"/, path);
    assert.match(html, /id="menu-archive"/, path);
    assert.match(html, /href="[^"]*archive\/circulars\/"/, path);
    assert.match(html, /href="[^"]*archive\/notifications\/"/, path);
    assert.match(html, /income-year-2011-12\//, path);
  }
  const bn = read("bn/index.html");
  assert.match(bn, /আর্কাইভ/);
  assert.match(
    read("archive/laws/index.html"),
    /aria-current="page"[^>]*>\s*Archive/,
  );
});

test("archive pages are in the sitemap with both languages, and linked from home and rates", () => {
  const sitemap = read("sitemap.xml");
  for (const path of [
    "archive/",
    "archive/laws/",
    "archive/income-year-2021-22/",
  ]) {
    assert.match(
      sitemap,
      new RegExp(`<loc>https://taxcalculator\\.bd/${path}</loc>`),
    );
    assert.match(
      sitemap,
      new RegExp(`hreflang="bn" href="https://taxcalculator\\.bd/bn/${path}"`),
    );
  }
  assert.match(read("index.html"), /archive-teaser/);
  assert.match(read("tax-rates/index.html"), /href="[^"]*\/archive\/"/);
  assert.match(read("bn/tax-rates/index.html"), /href="[^"]*\/archive\/"/);
});
