import { html } from "./html.mjs";
import {
  badge,
  breadcrumbJsonLd,
  faqJsonLd,
  faqList,
  pageHead,
  relatedTools,
  sourcesList,
  webAppJsonLd,
} from "./components.mjs";
import { renderBlocks } from "./blocks.mjs";

/** Form panel, live result column and the mobile result bar. */
function workspace(ctx, spec, toolName) {
  const { t } = ctx;
  return html`<section class="workspace" aria-label="${toolName}">
      <div class="container workspace-grid">
        <form
          class="panel form-panel"
          data-calc="${spec.id}"
          novalidate
          autocomplete="off"
        >
          <div class="panel-head">
            <h2>${spec.formTitle ?? toolName}</h2>
            <button
              class="btn btn-ghost btn-sm"
              type="button"
              data-action="reset"
            >
              ${ctx.icon("reset")}${t("ui.common.actions.reset")}
            </button>
          </div>
          <div class="panel-body">${spec.form}</div>
        </form>
        <div class="results-col" data-results-col>
          <div id="result" data-result tabindex="-1">
            <div class="panel result-empty">
              <p>${spec.emptyText ?? ""}</p>
              <noscript
                ><p class="callout callout--warn">
                  ${t("ui.common.noscript")}
                </p></noscript
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="result-bar" data-result-bar hidden>
      <div><small data-bar-label></small><strong data-bar-value></strong></div>
      <a class="btn btn-glow btn-sm" href="#result"
        >${t("ui.common.actions.details")}${ctx.icon("chevronDown")}</a
      >
    </div>`;
}

/** Explainer, FAQ, sources and related tools below the workspace. */
function lowerSections(
  ctx,
  { explain = [], faq = [], sources = [], related = [] },
) {
  return html`${
    explain.length
      ? html`<section class="section section--tight">
          <div class="container">
            <article class="prose">${renderBlocks(ctx, explain)}</article>
          </div>
        </section>`
      : ""
  }
  ${
    faq.length
      ? html`<section class="section section--alt" aria-labelledby="faq-title">
          <div class="container">
            <div class="section-head">
              <h2 id="faq-title">${ctx.t("site.nav.faq")}</h2>
            </div>
            ${faqList(ctx, faq)}
          </div>
        </section>`
      : ""
  }
  ${
    sources.length
      ? html`<section class="section section--tight">
          <div class="container prose">${sourcesList(ctx, sources)}</div>
        </section>`
      : ""
  }
  ${related.length ? relatedTools(ctx, related) : ""}`;
}

/**
 * Shared frame for every calculator page: header, form panel, live result
 * column, mobile result bar, explainer, FAQ, sources and related tools.
 */
export function calculatorPage(ctx, spec) {
  const { t } = ctx;
  const { id, entries, faq = [], badges = [] } = spec;
  const title = t(`site.meta.${id}.title`);
  const description = t(`site.meta.${id}.description`);
  const toolName = t(`site.tools.${id}.name`);
  const trail = [
    { label: t("site.nav.calculators"), href: ctx.pageUrl("hub") },
    { label: toolName },
  ];

  const body = html`${pageHead(ctx, {
    trail,
    title: spec.heading ?? toolName,
    lead: spec.lead,
    badges: [
      badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck")),
      ...badges,
      badge(t("site.common.free"), "blue"),
    ],
  })}
  ${workspace(ctx, spec, toolName)} ${spec.extraWorkspaces ?? ""}
  ${lowerSections(ctx, spec)}`;

  const jsonld = [
    breadcrumbJsonLd(ctx, trail, id),
    webAppJsonLd(ctx, id, title, description),
  ];
  if (faq.length) jsonld.push(faqJsonLd(faq));
  return {
    id,
    title,
    description,
    body,
    entries,
    jsonld,
    bodyClass: "has-result-bar",
  };
}
