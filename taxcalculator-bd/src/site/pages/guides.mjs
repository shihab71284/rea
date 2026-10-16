import { html } from "../html.mjs";
import {
  badge,
  breadcrumbJsonLd,
  heading,
  pageHead,
  relatedTools,
  sourcesList,
} from "../components.mjs";
import { renderBlocks, slug } from "../blocks.mjs";
import { GUIDES } from "../registry.mjs";
import { SOURCES } from "../../core/rules.mjs";

const toolFor = (id) => GUIDES.find((guide) => guide.id === id);

function guideCard(ctx, guide, level) {
  const { t } = ctx;
  const item = `guides.items.${guide.id}`;
  return html`<a
    class="tool-card guide-card"
    href="${ctx.pageUrl(`guide:${guide.id}`)}"
    data-reveal
  >
    <span class="tile tile--blue">${ctx.icon(guide.icon)}</span>
    ${heading(level, t(`${item}.title`))}
    <p>${t(`${item}.description`)}</p>
    <span class="go"
      >${t("guides.index.read")}${ctx.icon("arrowRight")}
      <small
        >${t("guides.index.minutes", { n: ctx.fmt.digits(t.get(`${item}.minutes`)) })}</small
      ></span
    >
  </a>`;
}

export const guideCards = (
  ctx,
  ids = GUIDES.map((guide) => guide.id),
  level = 3,
) =>
  html`<div class="grid grid--3">
    ${ids.map((id) => guideCard(ctx, toolFor(id), level))}
  </div>`;

export function guidesIndex(ctx) {
  const { t } = ctx;
  const trail = [{ label: t("site.nav.guides") }];
  const body = html`${pageHead(ctx, { trail, title: t("site.nav.guides"), lead: t("guides.index.lead"), badges: [badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck"))] })}
    <section class="section section--tight">
      <div class="container">${guideCards(ctx, undefined, 2)}</div>
    </section>`;
  return {
    id: "guides",
    title: t("site.meta.guides.title"),
    description: t("site.meta.guides.description"),
    body,
    entries: ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, "guides")],
  };
}

function guideAside(ctx, guide, headings, toolId) {
  const { t } = ctx;
  return html`<aside class="guide-aside" aria-label="${t("guides.index.toc")}">
    ${
      headings.length
        ? html`<nav class="card toc" aria-labelledby="toc-title">
            <h2 id="toc-title">${t("guides.index.toc")}</h2>
            <ol>
              ${headings.map((text) => html`<li><a href="#${slug(text)}">${text}</a></li>`)}
            </ol>
          </nav>`
        : ""
    }
    <div class="card guide-try">
      <span class="tile">${ctx.icon(toolFor(guide.id).icon)}</span>
      <h2>${t(`site.tools.${toolId}.name`)}</h2>
      <p>${t(`site.tools.${toolId}.desc`)}</p>
      <a class="btn btn-primary" href="${ctx.pageUrl(toolId)}"
        >${t("site.common.openTool")}${ctx.icon("arrowRight")}</a
      >
    </div>
  </aside>`;
}

export const guidePage = (guide) => (ctx) => {
  const { t, config } = ctx;
  const key = `guides.items.${guide.id}`;
  const pageId = `guide:${guide.id}`;
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const trail = [
    { label: t("site.nav.guides"), href: ctx.pageUrl("guides") },
    { label: title },
  ];
  const others = GUIDES.filter((candidate) => candidate.id !== guide.id).slice(
    0,
    3,
  );
  const blocks = t.get(`${key}.blocks`);
  const toolId = t.get(`${key}.tool`);
  const headings = blocks
    .filter((block) => block[0] === "h2")
    .map((block) => block[1]);
  const body = html`${pageHead(ctx, {
      trail,
      title,
      lead: description,
      badges: [
        badge(
          t("guides.index.minutes", {
            n: ctx.fmt.digits(t.get(`${key}.minutes`)),
          }),
          "outline",
          ctx.icon("clock"),
        ),
        badge(
          t("site.common.verified", {
            date: ctx.fmt.date(config.rulesVerifiedOn),
          }),
          "outline",
        ),
      ],
    })}
    <section class="section section--tight">
      <div class="container guide-layout">
        <article class="prose">
          ${renderBlocks(ctx, blocks)}
          <p class="guide-cta">
            <a class="btn btn-primary" href="${ctx.pageUrl(toolId)}"
              >${t("guides.index.tryTool")}:
              ${t(`site.tools.${toolId}.name`)}${ctx.icon("arrowRight")}</a
            >
          </p>
          ${sourcesList(ctx, [SOURCES.pwcFinanceAct, SOURCES.nbrFinanceActs])}
        </article>
        ${guideAside(ctx, guide, headings, toolId)}
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section-head"><h2>${t("guides.index.next")}</h2></div>
        ${guideCards(
          ctx,
          others.map((other) => other.id),
        )}
      </div>
    </section>
    ${relatedTools(ctx, ["income", "salary", "rebate"])}`;
  return {
    id: pageId,
    navId: "guides",
    title,
    description,
    body,
    entries: ["common"],
    jsonld: [
      breadcrumbJsonLd(ctx, trail, pageId),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        inLanguage: ctx.lang,
        dateModified: config.rulesVerifiedOn,
        mainEntityOfPage: ctx.absolute(ctx.pageUrl(pageId)),
        author: { "@type": "Organization", name: config.name },
        publisher: {
          "@type": "Organization",
          name: config.name,
          url: config.url,
        },
      },
    ],
  };
};
