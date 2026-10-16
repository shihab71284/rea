import { html } from "../html.mjs";
import { LAST_INCOME_YEAR } from "../../archive/years.mjs";
import { badge, ctaBand, faqList, toolGrid } from "../components.mjs";
import { computeIncomeTax } from "../../core/income-tax.mjs";
import { nextEvents } from "../../core/calendar.mjs";
import { eventTitle } from "../../views/calendar-text.mjs";
import { faqItems } from "./faq.mjs";
import { guideCards } from "./guides.mjs";

const QUICK_DEFAULT = 1_200_000;
const TOOL_ORDER = [
  "income",
  "salary",
  "rebate",
  "vat",
  "corporate",
  "filing",
  "payroll",
  "rates",
  "calendar",
];

function quickCard(ctx) {
  const { t, fmt } = ctx;
  const sample = computeIncomeTax({
    ay: "2026-27",
    employmentIncome: QUICK_DEFAULT,
  });
  const categories = [
    "general",
    "womanSenior",
    "disabled",
    "thirdGender",
    "freedomFighter",
  ];
  return html`<form class="quick" data-quick novalidate autocomplete="off">
    <div class="quick-head">
      <div>
        <h2>${t("home.quick.title")}</h2>
        <small>${t("home.quick.sub")}</small>
      </div>
      ${badge(t("site.common.free"), "", ctx.icon("zap"))}
    </div>
    <div class="field">
      <label for="q-income">${t("home.quick.income")}</label>
      <div class="input-group">
        <span class="input-prefix" aria-hidden="true">৳</span>
        <input
          id="q-income"
          name="income"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          data-type="amount"
          value="${fmt.n(QUICK_DEFAULT)}"
        />
      </div>
      <p class="words" data-words-for="income" aria-hidden="true">
        = ${fmt.compact(QUICK_DEFAULT)}
      </p>
    </div>
    <fieldset class="field">
      <legend class="visually-hidden">${t("home.quick.income")}</legend>
      <div class="segmented">
        <label
          ><input type="radio" name="kind" value="salary" checked /><span
            >${t("home.quick.kindSalary")}</span
          ></label
        >
        <label
          ><input type="radio" name="kind" value="other" /><span
            >${t("home.quick.kindOther")}</span
          ></label
        >
      </div>
      <p class="hint">${t("home.quick.kindHint")}</p>
    </fieldset>
    <div class="field">
      <label for="q-category">${t("home.quick.taxpayer")}</label>
      <select class="control" id="q-category" name="category">
        ${categories.map((key) => html`<option value="${key}">${t(`ui.common.categories.${key}`)}</option>`)}
      </select>
    </div>
    <div class="quick-result" aria-live="polite">
      <div>
        <div class="result-label">${t("home.quick.resultLabel")}</div>
        <div class="result-value" data-quick="tax">
          ${fmt.taka(sample.totalTax)}
        </div>
      </div>
      <div class="mini">
        <span>${t("home.quick.effective")}</span
        ><b data-quick="rate"
          >${fmt.percent(sample.effectiveRate * 100, { decimals: 1 })}</b
        >
      </div>
      <div class="mini">
        <span>${t("home.quick.monthly")}</span
        ><b data-quick="month">${fmt.taka(sample.monthlyTax)}</b>
      </div>
    </div>
    <a
      class="btn btn-secondary quick-link"
      href="${ctx.pageUrl("income")}"
      data-quick-link
    >
      ${t("home.quick.full")}${ctx.icon("arrowRight")}
    </a>
  </form>`;
}

function hero(ctx) {
  const { t } = ctx;
  const chips = t.get("home.changes.items");
  return html`<section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="container hero-grid">
      <div class="hero-copy">
        <a class="pill" href="${ctx.pageUrl("guide:financeAct2026")}">
          <span class="dot" aria-hidden="true"></span
          >${t("home.hero.badge")}${ctx.icon("arrowRight")}
        </a>
        <h1>
          ${t("home.hero.title1")}
          <span class="grad">${t("home.hero.title2")}</span>
        </h1>
        <p class="lead">${t("home.hero.lead")}</p>
        <div class="cluster">
          <a class="btn btn-glow btn-lg" href="${ctx.pageUrl("income")}"
            >${t("home.hero.ctaPrimary")}${ctx.icon("arrowRight")}</a
          >
          <a class="btn btn-outline-light btn-lg" href="${ctx.pageUrl("hub")}"
            >${t("home.hero.ctaSecondary")}</a
          >
        </div>
        <ul class="trust-row">
          ${t.get("home.hero.trust").map((item) => html`<li>${ctx.icon("circleCheck")}${item}</li>`)}
        </ul>
      </div>
      <div class="hero-card-wrap">
        <div class="float-chip float-chip--a" aria-hidden="true">
          ${ctx.icon("piggy")}<span
            ><strong>${chips[1].value}</strong>${chips[1].label}</span
          >
        </div>
        ${quickCard(ctx)}
        <div class="float-chip float-chip--b" aria-hidden="true">
          ${ctx.icon("badgeCheck")}<span
            ><strong>${chips[2].value}</strong>${chips[2].label}</span
          >
        </div>
      </div>
    </div>
  </section>`;
}

function sourcesStrip(ctx) {
  const items = ctx.t.get("home.sources.items");
  return html`<div class="sources">
    <div class="container sources-inner">
      <span class="sources-label">${ctx.t("home.sources.label")}</span>
      <ul class="sources-list">
        ${items.map((item) => html`<li>${ctx.icon("shieldCheck")}${item}</li>`)}
      </ul>
    </div>
  </div>`;
}

const sectionHead = (ctx, key) =>
  html`<div class="section-head">
    <span class="eyebrow">${ctx.t(`home.${key}.eyebrow`)}</span>
    <h2>${ctx.t(`home.${key}.title`)}</h2>
    ${ctx.t.has(`home.${key}.sub`) ? html`<p>${ctx.t(`home.${key}.sub`)}</p>` : ""}
  </div>`;

function toolsSection(ctx) {
  return html`<section class="section">
    <div class="container">
      ${sectionHead(ctx, "tools")} ${toolGrid(ctx, TOOL_ORDER)}
      <p class="section-more">
        <a class="btn btn-secondary" href="${ctx.pageUrl("hub")}"
          >${ctx.t("home.tools.all")}${ctx.icon("arrowRight")}</a
        >
      </p>
    </div>
  </section>`;
}

function changesSection(ctx) {
  const items = ctx.t.get("home.changes.items");
  return html`<section class="section section--navy">
    <div class="container">
      ${sectionHead(ctx, "changes")}
      <div class="grid grid--4">
        ${items.map(
          (item) =>
            html`<div class="stat-card" data-reveal>
              <div class="value">${item.value}</div>
              <div class="label">${item.label}</div>
              <p class="text">${item.text}</p>
            </div>`,
        )}
      </div>
      <p class="section-more">
        <a class="btn btn-outline-light" href="${ctx.pageUrl("rates")}"
          >${ctx.t("site.tools.rates.name")}${ctx.icon("arrowRight")}</a
        >
      </p>
    </div>
  </section>`;
}

function stepsSection(ctx) {
  const items = ctx.t.get("home.steps.items");
  return html`<section class="section">
    <div class="container">
      ${sectionHead(ctx, "steps")}
      <div class="grid grid--3">
        ${items.map(
          (item, index) =>
            html`<div class="step-card" data-reveal>
              <span class="no">${ctx.fmt.digits(index + 1)}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </div>`,
        )}
      </div>
    </div>
  </section>`;
}

function audienceSection(ctx) {
  const items = ctx.t.get("home.audience.items");
  return html`<section class="section section--alt">
    <div class="container">
      ${sectionHead(ctx, "audience")}
      <div class="grid grid--4">
        ${items.map(
          (item) =>
            html`<div class="audience-card" data-reveal>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
              <a href="${ctx.pageUrl(item.tool)}"
                >${ctx.t("site.common.openTool")}${ctx.icon("arrowRight")}</a
              >
            </div>`,
        )}
      </div>
    </div>
  </section>`;
}

function whySection(ctx) {
  const items = ctx.t.get("home.why.items");
  return html`<section class="section">
    <div class="container">
      ${sectionHead(ctx, "why")}
      <div class="grid grid--3">
        ${items.map(
          (item) =>
            html`<div class="feature" data-reveal>
              <span class="tile">${ctx.icon(item.icon)}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </div>`,
        )}
      </div>
    </div>
  </section>`;
}

function datesSection(ctx) {
  const { t, fmt, config } = ctx;
  const events = nextEvents(config.rulesVerifiedOn, 4);
  return html`<section class="section section--alt">
    <div class="container dates-grid">
      <div>
        ${sectionHead(ctx, "dates")}
        <ul class="soon-list" data-home-dates>
          ${events.map(
            (event) =>
              html`<li>
                <span class="soon-date"
                  >${fmt.date(event.date, { day: "numeric", month: "short" })}</span
                >
                <span>${eventTitle(event, ctx)}</span>
              </li>`,
          )}
        </ul>
        <p class="section-more section-more--start">
          <a class="btn btn-secondary" href="${ctx.pageUrl("calendar")}"
            >${t("home.dates.all")}${ctx.icon("arrowRight")}</a
          >
        </p>
      </div>
      <div class="card checklist-card" data-reveal>
        <span class="tile">${ctx.icon("listChecks")}</span>
        <h3>${t("home.dates.checklistTitle")}</h3>
        <p>${t("home.dates.checklistText")}</p>
        <a class="btn btn-primary" href="${ctx.pageUrl("dashboard")}"
          >${t("home.dates.dashboard")}${ctx.icon("arrowRight")}</a
        >
      </div>
    </div>
  </section>`;
}

function guidesSection(ctx) {
  return html`<section class="section">
    <div class="container">
      ${sectionHead(ctx, "guides")}
      ${guideCards(ctx, ["financeAct2026", "fileReturn", "salaryTax"])}
      <p class="section-more">
        <a class="btn btn-secondary" href="${ctx.pageUrl("guides")}"
          >${ctx.t("home.guides.all")}${ctx.icon("arrowRight")}</a
        >
      </p>
    </div>
  </section>`;
}

function archiveSection(ctx) {
  const { t, fmt } = ctx;
  return html`<section class="section section--tight section--flush-top">
    <div class="container">
      <div class="archive-teaser" data-reveal>
        <span class="tile tile--blue">${ctx.icon("archive")}</span>
        <div>
          <h2>${t("page.archive.teaser.title")}</h2>
          <p>
            ${t("page.archive.teaser.text", { last: fmt.digits(LAST_INCOME_YEAR) })}
          </p>
        </div>
        <a class="btn btn-primary" href="${ctx.pageUrl("archive")}"
          >${t("page.archive.teaser.cta")}${ctx.icon("arrowRight")}</a
        >
      </div>
    </div>
  </section>`;
}

function faqSection(ctx) {
  const items = faqItems(ctx, [
    "tax-free",
    "who-files",
    "rebate",
    "early",
    "privacy",
  ]);
  return html`<section class="section section--alt">
    <div class="container">
      ${sectionHead(ctx, "faq")} ${faqList(ctx, items)}
      <p class="section-more section-more--start">
        <a class="btn btn-secondary" href="${ctx.pageUrl("faq")}"
          >${ctx.t("home.faq.all")}${ctx.icon("arrowRight")}</a
        >
      </p>
    </div>
  </section>`;
}

export default function home(ctx) {
  const { t, config } = ctx;
  const body = html`${hero(ctx)}${sourcesStrip(ctx)}${toolsSection(ctx)}${changesSection(ctx)}${stepsSection(ctx)}${audienceSection(ctx)}${whySection(ctx)}${datesSection(ctx)}${guidesSection(ctx)}${archiveSection(ctx)}${faqSection(ctx)}${ctaBand(
    ctx,
    {
      title: t("home.cta.title"),
      text: t("home.cta.text"),
      primary: { label: t("home.cta.primary"), href: ctx.pageUrl("income") },
      secondary: {
        label: t("home.cta.secondary"),
        href: ctx.pageUrl("contact"),
      },
    },
  )}`;
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: config.name,
      url: config.url,
      logo: ctx.absolute(ctx.asset("apple-touch-icon.png")),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: config.name,
      url: ctx.absolute(ctx.pageUrl("home")),
      inLanguage: ctx.lang,
    },
  ];
  return {
    id: "home",
    title: t("site.meta.home.title"),
    description: t("site.meta.home.description"),
    body,
    entries: ["home"],
    jsonld,
    overlayHeader: true,
  };
}
