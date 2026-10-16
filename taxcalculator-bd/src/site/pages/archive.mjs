/**
 * The archive: a hub, one page per document type and one page per income year.
 * Everything is built from the catalog in src/archive, so both languages list
 * exactly the same documents.
 */

import { OFFICIAL_LINKS } from "../../core/rules.mjs";
import {
  DOCUMENTS,
  TYPES,
  countsOfYear,
  documentsOfType,
  documentsOfYear,
  financeActRange,
  firstYearOf,
  groupByBucket,
  standingDocuments,
} from "../../archive/catalog.mjs";
import { LISTS_BY_TYPE, OFFICIAL_LISTS } from "../../archive/sources.mjs";
import {
  ARCHIVE_YEARS,
  FIRST_INCOME_YEAR,
  LAST_INCOME_YEAR,
  incomeYearDates,
  startYear,
  taxYearOf,
  yearLabel,
} from "../../archive/years.mjs";
import { bucketChip, docGroups, docList } from "../archive-ui.mjs";
import { library } from "../archive-library.mjs";
import {
  badge,
  breadcrumbJsonLd,
  callout,
  faqJsonLd,
  faqList,
  pageHead,
  resolveLinks,
} from "../components.mjs";
import { html, inline } from "../html.mjs";
import {
  ARCHIVE_SECTIONS,
  archiveSection,
  archiveYearId,
} from "../registry.mjs";

const META = {
  circular: "archiveCircular",
  directive: "archiveDirective",
  sro: "archiveSro",
  law: "archiveLaw",
};

/** Placeholders the archive copy shares, localized for the page language. */
function scope(ctx) {
  const { digits } = ctx.fmt;
  const start = startYear(LAST_INCOME_YEAR);
  const acts = financeActRange();
  return {
    first: digits(FIRST_INCOME_YEAR),
    last: digits(LAST_INCOME_YEAR),
    taxYear: digits(taxYearOf(LAST_INCOME_YEAR)),
    next: digits(yearLabel(start + 1)),
    startYear: digits(start),
    endYear: digits(start + 1),
    from: digits(firstYearOf("directive")),
    actFrom: digits(acts.from),
    actTo: digits(acts.to),
    url: OFFICIAL_LINKS.incomeTaxActs,
  };
}

const hubTrail = (ctx) => [{ label: ctx.t("site.nav.archive") }];

const childTrail = (ctx, label) => [
  { label: ctx.t("site.nav.archive"), href: ctx.pageUrl("archive") },
  { label },
];

function officialLists(ctx, ids) {
  return html`<ul class="official-list">
    ${ids.map(
      (id) =>
        html`<li>
          <a
            href="${OFFICIAL_LISTS[id]}"
            target="_blank"
            rel="noopener noreferrer"
            >${ctx.t(`page.archive.lists.${id}`)}${ctx.icon("externalLink")}</a
          >
        </li>`,
    )}
  </ul>`;
}

function typeCard(ctx, section) {
  const { t, fmt } = ctx;
  const { type } = section;
  const other = ctx.lang === "en" ? "bn" : "en";
  const tile = section.tile ? ` tile--${section.tile}` : "";
  const key = (name) => `page.archive.types.${type}.${name}`;
  return html`<a
    class="tool-card"
    href="${ctx.pageUrl(section.id)}"
    data-reveal
  >
    <span class="tile${tile}">${ctx.icon(section.icon)}</span>
    <h3>
      ${t(key("name"))}
      <span class="native" lang="${other}">${t(key("native"))}</span>
    </h3>
    <p>${t(key("desc"))}</p>
    <p class="tool-count">
      ${t("page.archive.badges.count", { count: fmt.digits(documentsOfType(type).length) })}
    </p>
    <span class="go"
      >${t("page.archive.hub.open")}${ctx.icon("arrowRight")}</span
    >
  </a>`;
}

function yearCard(ctx, year) {
  const { t, fmt } = ctx;
  const counts = countsOfYear(year);
  return html`<a
    class="year-card"
    href="${ctx.pageUrl(archiveYearId(year))}"
    data-reveal
  >
    <h3>${t("page.archive.year.title", { year: fmt.digits(year) })}</h3>
    <p class="year-tax">
      ${t("page.archive.doc.taxYear", { taxYear: fmt.digits(taxYearOf(year)) })}
    </p>
    <dl class="year-counts">
      ${TYPES.map(
        (type) =>
          html`<div class="${counts[type] ? "" : "is-zero"}">
            <dt>${t(`page.archive.hub.counts.${type}`)}</dt>
            <dd>${fmt.digits(counts[type])}</dd>
          </div>`,
      )}
    </dl>
  </a>`;
}

const sectionHead = (title, lead) =>
  html`<div class="section-head">
    <h2>${title}</h2>
    ${lead ? html`<p>${lead}</p>` : ""}
  </div>`;

function hubSections(ctx, faq) {
  const { t } = ctx;
  const hub = (name) => t(`page.archive.hub.${name}`);
  return html`<section class="section section--flush-top">
      <div class="container">
        ${sectionHead(hub("typesTitle"))}
        <div class="grid grid--4">
          ${ARCHIVE_SECTIONS.map((section) => typeCard(ctx, section))}
        </div>
      </div>
    </section>
    <section class="section section--alt" id="years">
      <div class="container">
        ${sectionHead(hub("yearsTitle"), hub("yearsLead"))}
        <div class="year-grid">
          ${ARCHIVE_YEARS.map((year) => yearCard(ctx, year))}
        </div>
      </div>
    </section>
    <section class="section" id="library">
      <div class="container">
        ${sectionHead(hub("libraryTitle"), hub("libraryLead"))}
        ${library(ctx, DOCUMENTS, { withTypes: true, level: 3 })}
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        ${sectionHead(hub("faqTitle"))} ${faqList(ctx, faq)}
        <div class="official">
          <h2>${hub("listsTitle")}</h2>
          <p>${hub("listsLead")}</p>
          ${officialLists(ctx, Object.keys(OFFICIAL_LISTS))}
        </div>
      </div>
    </section>`;
}

export function archiveHub(ctx) {
  const { t, fmt, config } = ctx;
  const params = scope(ctx);
  const faq = t.get("page.archive.faq");
  const badges = [
    badge(t("page.archive.badges.years", params), "", ctx.icon("history")),
    badge(t("page.archive.badges.era"), "blue"),
    badge(
      t("page.archive.badges.count", { count: fmt.digits(DOCUMENTS.length) }),
      "outline",
    ),
    badge(
      t("page.archive.badges.checked", {
        date: fmt.date(config.archiveCheckedOn),
      }),
      "outline",
    ),
  ];
  const body = html`${pageHead(ctx, {
      trail: hubTrail(ctx),
      title: t("page.archive.title"),
      lead: t("page.archive.lead", params),
      badges,
    })}
    <section class="section section--tight">
      <div class="container">
        ${callout(ctx, "info", t("page.archive.scope", params))}
      </div>
    </section>
    ${hubSections(ctx, faq)}`;
  return {
    id: "archive",
    navId: "archive",
    title: t("site.meta.archive.title", params),
    description: t("site.meta.archive.description", params),
    body,
    entries: ["archive"],
    jsonld: [breadcrumbJsonLd(ctx, hubTrail(ctx), "archive"), faqJsonLd(faq)],
  };
}

function yearChips(ctx, groups) {
  return html`<nav
    class="chips anchor-chips"
    aria-label="${ctx.t("page.archive.hub.yearsTitle")}"
  >
    ${groups.map(
      ({ bucket }) =>
        html`<a class="chip" href="#income-year-${bucket}"
          >${bucketChip(ctx, bucket)}</a
        >`,
    )}
  </nav>`;
}

function typeIntro(ctx, type, params) {
  const key = (name) => `page.archive.types.${type}.${name}`;
  const tone = type === "sro" ? "warn" : "info";
  return html`<div class="prose archive-intro">
    ${ctx.t
      .get(key("about"))
      .map((text) => html`<p>${inline(resolveLinks(ctx, text))}</p>`)}
    ${callout(ctx, tone, ctx.t(key("note"), params))}
  </div>`;
}

export const archiveType = (type) => (ctx) => {
  const { t, fmt } = ctx;
  const section = archiveSection(type);
  const docs = documentsOfType(type);
  const params = scope(ctx);
  const name = t(`page.archive.types.${type}.name`);
  const trail = childTrail(ctx, name);
  const groups = groupByBucket(docs);
  const listing =
    type === "sro"
      ? library(ctx, docs, { level: 2 })
      : html`${yearChips(ctx, groups)}${docGroups(ctx, docs, { level: 2 })}`;
  const others = ARCHIVE_SECTIONS.filter((item) => item.type !== type);
  const body = html`${pageHead(ctx, {
      trail,
      title: t(`page.archive.types.${type}.title`),
      lead: t(`page.archive.types.${type}.lead`),
      badges: [
        badge(
          t("page.archive.badges.count", { count: fmt.digits(docs.length) }),
          "",
          ctx.icon(section.icon),
        ),
        badge(t("page.archive.badges.years", params), "outline"),
      ],
    })}
    <section class="section section--tight">
      <div class="container">${typeIntro(ctx, type, params)} ${listing}</div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="official">
          <h2>${t("page.archive.hub.listsTitle")}</h2>
          ${officialLists(ctx, LISTS_BY_TYPE[type])}
        </div>
        <h2 class="more-title">${t("page.archive.hub.moreTitle")}</h2>
        <div class="grid grid--3">
          ${others.map((item) => typeCard(ctx, item))}
        </div>
      </div>
    </section>`;
  return {
    id: section.id,
    navId: section.id,
    title: t(`site.meta.${META[type]}.title`, params),
    description: t(`site.meta.${META[type]}.description`, params),
    body,
    entries: type === "sro" ? ["archive"] : ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, section.id)],
  };
};

function yearFacts(ctx, year, act) {
  const { t, fmt } = ctx;
  const { from, to } = incomeYearDates(year);
  const taxYear = fmt.digits(taxYearOf(year));
  const fact = (name, value) =>
    html`<div>
      <dt>${t(`page.archive.year.facts.${name}`)}</dt>
      <dd>${value}</dd>
    </div>`;
  return html`<dl class="year-facts">
    ${fact(
      "incomeYear",
      t("page.archive.year.facts.period", {
        from: fmt.date(from),
        to: fmt.date(to),
      }),
    )}
    ${fact("taxYear", taxYear)}
    ${act ? fact("financeAct", act.title[ctx.lang]) : ""}
    ${fact("nbrName", `“${taxYear}”`)}
  </dl>`;
}

function yearSection(ctx, type, docs) {
  const { t, fmt } = ctx;
  const own = docs.filter((doc) => doc.type === type);
  return html`<section class="year-section" id="${type}">
    <h2>
      ${t(`page.archive.types.${type}.name`)}
      <span class="count">${fmt.digits(own.length)}</span>
    </h2>
    ${
      own.length
        ? docList(ctx, own)
        : html`<p class="year-empty">
            ${t(`page.archive.year.empty.${type}`)}
          </p>`
    }
    ${
      type === "law"
        ? html`<h3>${t("page.archive.year.standingTitle")}</h3>
            ${docList(ctx, standingDocuments())}`
        : ""
    }
  </section>`;
}

function otherYears(ctx, current) {
  return html`<nav
    class="chips anchor-chips"
    aria-label="${ctx.t("page.archive.year.navLabel")}"
  >
    ${ARCHIVE_YEARS.map(
      (year) =>
        html`<a
          class="chip"
          href="${ctx.pageUrl(archiveYearId(year))}"
          ${year === current ? html`aria-current="page"` : ""}
          >${ctx.fmt.digits(year)}</a
        >`,
    )}
  </nav>`;
}

export const archiveYear = (year) => (ctx) => {
  const { t, fmt } = ctx;
  const id = archiveYearId(year);
  const docs = documentsOfYear(year);
  const act = docs.find((doc) => doc.actYear);
  const { from, to } = incomeYearDates(year);
  const params = {
    year: fmt.digits(year),
    taxYear: fmt.digits(taxYearOf(year)),
    from: fmt.date(from),
    to: fmt.date(to),
    actYear: act ? fmt.digits(act.actYear) : "",
  };
  const trail = childTrail(ctx, t("page.archive.year.title", params));
  const body = html`${pageHead(ctx, {
      trail,
      title: t("page.archive.year.title", params),
      lead: t("page.archive.year.lead", params),
      badges: [
        badge(
          t("page.archive.year.badges.taxYear", params),
          "",
          ctx.icon("history"),
        ),
        ...(act
          ? [badge(t("page.archive.year.badges.act", params), "blue")]
          : []),
      ],
    })}
    <section class="section section--tight">
      <div class="container">
        ${otherYears(ctx, year)} ${yearFacts(ctx, year, act)}
        ${TYPES.map((type) => yearSection(ctx, type, docs))}
      </div>
    </section>`;
  return {
    id,
    navId: id,
    title: t("site.meta.archiveYear.title", params),
    description: t("site.meta.archiveYear.description", params),
    body,
    entries: ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, id)],
  };
};
