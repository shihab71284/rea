import { html } from "../html.mjs";
import { badge, breadcrumbJsonLd, pageHead, toolGrid } from "../components.mjs";
import { TOOLS } from "../registry.mjs";

export default function dashboard(ctx) {
  const { t } = ctx;
  const trail = [{ label: t("site.tools.dashboard.name") }];
  const paths = Object.fromEntries([
    ...TOOLS.map((tool) => [tool.id, ctx.pageUrl(tool.id)]),
    ["invoice", `${ctx.pageUrl("vat")}#invoice`],
  ]);
  const body = html`${pageHead(ctx, {
      trail,
      title: t("ui.dash.title"),
      lead: t("page.tools.dashboard.lead"),
      badges: [badge(t("site.common.free"), "blue", ctx.icon("lock"))],
    })}
    <section class="section section--tight">
      <div
        class="container dash"
        data-dash
        data-paths="${JSON.stringify(paths)}"
        data-calendar="${ctx.pageUrl("calendar")}"
      >
        <div class="grid grid--4" data-kpis></div>
        <div class="dash-grid">
          <section class="panel" aria-labelledby="saved-title">
            <div class="panel-head">
              <h2 id="saved-title">${t("ui.dash.saved.title")}</h2>
              <button
                class="btn btn-ghost btn-sm"
                type="button"
                data-clear-saved
                hidden
              >
                ${ctx.icon("trash")}${t("ui.dash.saved.clear")}
              </button>
            </div>
            <div class="panel-body" data-saved></div>
          </section>
          <section class="panel" aria-labelledby="check-title">
            <div class="panel-head">
              <h2 id="check-title">${t("ui.dash.checklist.title")}</h2>
              <span class="badge" data-check-progress></span>
            </div>
            <div class="panel-body" data-checklist></div>
            <div class="result-actions">
              <button
                class="btn btn-ghost btn-sm"
                type="button"
                data-reset-checklist
              >
                ${ctx.icon("reset")}${t("ui.dash.checklist.reset")}
              </button>
            </div>
          </section>
        </div>
        <section class="panel" aria-labelledby="soon-title">
          <div class="panel-head">
            <h2 id="soon-title">${t("ui.dash.deadlines.title")}</h2>
          </div>
          <div class="panel-body" data-soon></div>
        </section>
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section-head"><h2>${t("site.nav.calculators")}</h2></div>
        ${toolGrid(
          ctx,
          TOOLS.slice(0, 6).map((tool) => tool.id),
        )}
      </div>
    </section>`;
  return {
    id: "dashboard",
    title: t("site.meta.dashboard.title"),
    description: t("site.meta.dashboard.description"),
    body,
    entries: ["dashboard"],
    noindex: true,
    jsonld: [breadcrumbJsonLd(ctx, trail, "dashboard")],
  };
}
