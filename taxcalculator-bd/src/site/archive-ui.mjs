/**
 * Rendering helpers shared by every archive page: one document row, grouped
 * lists, labels and the text each row is searched by.
 */

import { dictionaries } from "../i18n/dictionaries.mjs";
import { createTranslator } from "../i18n/index.mjs";
import { localizeDigits } from "../core/format.mjs";
import {
  ALL,
  BEFORE,
  FIRST_INCOME_YEAR,
  isArchiveYear,
  taxYearOf,
} from "../archive/years.mjs";
import { TYPES, groupByBucket } from "../archive/catalog.mjs";
import { badge } from "./components.mjs";
import { html, raw } from "./html.mjs";
import { archiveYearId } from "./registry.mjs";

const TONES = { circular: "", directive: "blue", sro: "amber", law: "rose" };

/** Words people may type for each type, in both languages. */
const TYPE_WORDS = {
  circular: "circular paripatra পরিপত্র",
  directive: "directive nirdeshika guideline নির্দেশিকা",
  sro: "sro notification prozapon প্রজ্ঞাপন এসআরও",
  law: "law act ordinance rules আইন অধ্যাদেশ বিধিমালা",
};

const translators = Object.fromEntries(
  ["en", "bn"].map((lang) => [
    lang,
    createTranslator(dictionaries[lang], lang, { strict: true }),
  ]),
);

/** The official reference of a document in one language, e.g. "S.R.O. No. 167-Law/Income Tax/2021". */
export function docRef(doc, lang) {
  const { ref } = doc;
  if (!ref) return "";
  const t = translators[lang];
  const digits = (value) => localizeDigits(value, lang);
  const year = digits(ref.year);
  const key = (name) => `page.archive.doc.refs.${name}`;
  if (ref.kind === "sro") {
    const no = digits(ref.no);
    if (!ref.series) return t(key("sroPlain"), { no, year });
    const series = t(`page.archive.doc.series.${ref.series}`);
    return t(key("sro"), { no, year, series });
  }
  if (ref.kind === "act") return t(key("act"), { no: digits(ref.no), year });
  if (ref.kind === "ordinance") {
    const no = lang === "en" ? ref.roman : digits(ref.no);
    return t(key("ordinance"), { no, year });
  }
  throw new Error(`Unknown reference kind: ${ref.kind}`);
}

/**
 * Search terms a row carries beyond its own visible text: the years it can be
 * found under (Latin digits) and the words people use for its type, in both
 * languages. The visible title and reference are searched as they are.
 */
export function searchExtras(doc) {
  const year = isArchiveYear(doc.incomeYear) ? doc.incomeYear : "";
  const parts = [
    year,
    year ? taxYearOf(year) : "",
    doc.taxYear,
    TYPE_WORDS[doc.type],
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

/** "Income year 2021-22", "Before 2011-12" or "Every year". */
export function bucketLabel(ctx, bucket) {
  const { t, fmt } = ctx;
  if (bucket === ALL) return t("page.archive.library.standing");
  if (bucket === BEFORE)
    return t("page.archive.library.before", {
      first: fmt.digits(FIRST_INCOME_YEAR),
    });
  return t("page.archive.year.title", { year: fmt.digits(bucket) });
}

/** Short label for jump links: the year itself, or the bucket name. */
export const bucketChip = (ctx, bucket) =>
  isArchiveYear(bucket) ? ctx.fmt.digits(bucket) : bucketLabel(ctx, bucket);

const callToAction = (ctx, link) =>
  link.label?.[ctx.lang] ??
  ctx.t(
    link.kind === "pdf"
      ? "page.archive.doc.openPdf"
      : "page.archive.doc.openWeb",
  );

/** The type as a plain badge (no icon, to keep long lists light). */
const typeLabel = (ctx, type) =>
  badge(ctx.t(`page.archive.types.${type}.single`), TONES[type]);

function metaLine(ctx, doc, { showType, showYear }) {
  const { t, fmt } = ctx;
  const items = [];
  if (showType) items.push(typeLabel(ctx, doc.type));
  if (showYear)
    items.push(html`<span>${bucketLabel(ctx, doc.incomeYear)}</span>`);
  if (doc.taxYear)
    items.push(
      html`<span
        >${t("page.archive.doc.taxYear", { taxYear: fmt.digits(doc.taxYear) })}</span
      >`,
    );
  if (doc.date)
    items.push(html`<time datetime="${doc.date}">${fmt.date(doc.date)}</time>`);
  if (doc.incomeYear === ALL)
    items.push(html`<span>${t("page.archive.doc.standing")}</span>`);
  if (doc.links[0].source !== "nbr")
    items.push(
      html`<span
        >${t("page.archive.doc.source", {
          name: t(`page.archive.doc.sources.${doc.links[0].source}`),
        })}</span
      >`,
    );
  return items.length ? html`<p class="doc-meta">${items}</p>` : "";
}

/**
 * Drop the template's line breaks and indentation. A row repeats over a hundred
 * times on one page, so the whitespace alone would add tens of kilobytes. Safe
 * here because a row's inline parts sit in flex containers.
 */
const compact = (fragment) =>
  raw(fragment.value.replace(/\s*\n\s*/g, " ").replace(/>\s+</g, "><"));

/**
 * One document. The title is the link to the official file and the whole row
 * is clickable; further links (a later clarification, a second copy) sit below.
 */
export function docRow(ctx, doc, options = {}) {
  const { lang } = ctx;
  const ref = docRef(doc, lang);
  const note = doc.note?.[lang];
  const [primary, ...more] = doc.links;
  return compact(
    html`<li
      class="doc"
      data-doc
      data-type="${doc.type}"
      data-year="${doc.incomeYear}"
      data-search="${searchExtras(doc)}"
    >
      ${metaLine(ctx, doc, options)}
      ${ref ? html`<p class="doc-ref">${ref}</p>` : ""}
      <p class="doc-title">
        <a
          class="doc-open"
          href="${primary.url}"
          target="_blank"
          rel="noopener noreferrer"
          >${doc.title[lang]}${" "}<span class="doc-cta"
            >${callToAction(ctx, primary)}${ctx.icon("externalLink")}</span
          ></a
        >
      </p>
      ${note ? html`<p class="doc-note">${note}</p>` : ""}
      ${
        more.length
          ? html`<p class="doc-more">
              ${more.map(
                (link) =>
                  html`<a
                    href="${link.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${callToAction(ctx, link)}${ctx.icon("externalLink")}</a
                  >`,
              )}
            </p>`
          : ""
      }
    </li>`,
  );
}

export const docList = (ctx, docs, options) =>
  html`<ul class="doc-list">
    ${docs.map((doc) => docRow(ctx, doc, options))}
  </ul>`;

const typeOrder = (doc) => TYPES.indexOf(doc.type);

/** Documents grouped by filing bucket (newest year first); `mixed` orders each group by type. */
export function docGroups(ctx, docs, { level = 3, mixed = false } = {}) {
  return groupByBucket(docs).map(({ bucket, docs: members }) => {
    const sorted = mixed
      ? [...members].sort((a, b) => typeOrder(a) - typeOrder(b))
      : members;
    const label = bucketLabel(ctx, bucket);
    const title = isArchiveYear(bucket)
      ? html`<a href="${ctx.pageUrl(archiveYearId(bucket))}">${label}</a>
          <span
            >${ctx.t("page.archive.doc.taxYear", {
              taxYear: ctx.fmt.digits(taxYearOf(bucket)),
            })}</span
          >`
      : label;
    return html`<section
      class="doc-group"
      id="income-year-${bucket}"
      data-group
    >
      ${raw(`<h${level} class="doc-group-title">`)}${title}${raw(`</h${level}>`)}
      ${docList(ctx, sorted, { showType: mixed })}
    </section>`;
  });
}
