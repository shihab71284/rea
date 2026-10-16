import { attrs, esc, html, inline, join, raw } from "./html.mjs";
import { TOOLS, RESOURCES, toolById } from "./registry.mjs";

/** Replace {@pageId} tokens in translated copy with the language-aware page URL. */
export const resolveLinks = (ctx, text) =>
  String(text).replace(/\{@([\w:-]+)\}/g, (match, id) => ctx.pageUrl(id));

export function breadcrumb(ctx, trail) {
  const items = [
    { label: ctx.t("site.common.home"), href: ctx.pageUrl("home") },
    ...trail,
  ];
  return html`<nav aria-label="${ctx.t("site.nav.breadcrumb")}">
    <ol class="breadcrumb">
      ${items.map((item, index) =>
        index === items.length - 1
          ? html`<li aria-current="page">${item.label}</li>`
          : html`<li><a href="${item.href}">${item.label}</a></li>`,
      )}
    </ol>
  </nav>`;
}

export function pageHead(ctx, { trail, title, lead, badges = [] }) {
  return html`<section class="page-head">
    <div class="container">
      ${breadcrumb(ctx, trail)}
      <h1>${title}</h1>
      ${lead ? html`<p class="lead">${inline(lead)}</p>` : ""}
      ${badges.length ? html`<div class="cluster">${badges}</div>` : ""}
    </div>
  </section>`;
}

export const badge = (text, tone = "", icon = "") =>
  html`<span class="badge${tone ? ` badge--${tone}` : ""}"
    >${icon}${text}</span
  >`;

/** <h2>/<h3> chosen so heading levels never skip. */
export const heading = (level, text) =>
  raw(`<h${level}>${esc(text)}</h${level}>`);

export function toolCard(ctx, id, level = 3) {
  const tool = toolById(id);
  const tile = tool.tile ? ` tile--${tool.tile}` : "";
  const isTool = TOOLS.some((candidate) => candidate.id === id);
  return html`<a class="tool-card" href="${ctx.pageUrl(id)}" data-reveal>
    <span class="tile${tile}">${ctx.icon(tool.icon)}</span>
    ${heading(level, ctx.t(`site.tools.${id}.name`))}
    <p>${ctx.t(`site.tools.${id}.desc`)}</p>
    <span class="go"
      >${ctx.t(isTool ? "site.common.openTool" : "site.common.open")}${ctx.icon("arrowRight")}</span
    >
  </a>`;
}

export const toolGrid = (ctx, ids = TOOLS.map((tool) => tool.id), level = 3) =>
  html`<div class="grid grid--3">
    ${ids.map((id) => toolCard(ctx, id, level))}
  </div>`;

export const resourceIds = RESOURCES.map((item) => item.id);

export function callout(ctx, tone, text, icon = "info") {
  const name =
    { warn: "alert", good: "circleCheck", bad: "alert", info: "info" }[tone] ??
    icon;
  return html`<div
    class="callout${tone === "info" ? "" : ` callout--${tone}`}"
    role="note"
  >
    ${ctx.icon(name)}
    <div>${inline(resolveLinks(ctx, text))}</div>
  </div>`;
}

export function faqList(ctx, items) {
  return html`<div class="faq">
    ${items.map(
      (item) =>
        html`<details class="faq-item">
          <summary>${item.q}${ctx.icon("chevronDown")}</summary>
          <div class="faq-body">
            ${(Array.isArray(item.a) ? item.a : [item.a]).map((para) => html`<p>${inline(resolveLinks(ctx, para))}</p>`)}
          </div>
        </details>`,
    )}
  </div>`;
}

export function sourcesList(ctx, sources) {
  return html`<section class="prose-sources" aria-labelledby="sources-title">
    <h2 id="sources-title">${ctx.t("site.common.sources")}</h2>
    <ul>
      ${sources.map(
        (source) =>
          html`<li>
            <a href="${source.url}" target="_blank" rel="noopener noreferrer"
              >${source.title}</a
            >
          </li>`,
      )}
    </ul>
    <p class="hint">
      ${ctx.t("site.common.verified", { date: ctx.fmt.date(ctx.config.rulesVerifiedOn) })}
    </p>
  </section>`;
}

export function relatedTools(ctx, ids) {
  return html`<section
    class="section section--alt"
    aria-labelledby="related-title"
  >
    <div class="container">
      <div class="section-head">
        <h2 id="related-title">${ctx.t("site.common.related")}</h2>
      </div>
      ${toolGrid(ctx, ids)}
    </div>
  </section>`;
}

export function ctaBand(ctx, { title, text, primary, secondary }) {
  return html`<section class="section">
    <div class="container">
      <div class="cta-band" data-reveal>
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="cluster">
          <a class="btn btn-glow btn-lg" href="${primary.href}"
            >${primary.label}${ctx.icon("arrowRight")}</a
          >
          ${
            secondary
              ? html`<a
                  class="btn btn-outline-light btn-lg"
                  href="${secondary.href}"
                  >${secondary.label}</a
                >`
              : ""
          }
        </div>
      </div>
    </div>
  </section>`;
}

export function breadcrumbJsonLd(ctx, trail, pageId) {
  const items = [
    { name: ctx.t("site.common.home"), path: ctx.pageUrl("home") },
    ...trail.map((item, index) => ({
      name: item.label,
      path: item.href ?? ctx.pageUrl(pageId),
      last: index === trail.length - 1,
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: ctx.absolute(item.path ?? ctx.pageUrl(pageId)),
    })),
  };
}

export function webAppJsonLd(ctx, pageId, name, description) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: ctx.absolute(ctx.pageUrl(pageId)),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    inLanguage: ctx.lang,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
    publisher: {
      "@type": "Organization",
      name: ctx.config.name,
      url: ctx.config.url,
    },
  };
}

export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: (Array.isArray(item.a) ? item.a : [item.a])
          .join(" ")
          .replace(/[*`]|\]\([^)]*\)|\[/g, ""),
      },
    })),
  };
}

export { attrs, join, raw };
