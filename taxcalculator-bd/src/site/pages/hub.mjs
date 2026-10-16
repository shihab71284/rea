import { html } from "../html.mjs";
import { badge, breadcrumbJsonLd, pageHead, toolGrid } from "../components.mjs";

const GROUPS = [
  ["individuals", ["income", "salary", "rebate", "filing"]],
  ["business", ["vat", "corporate", "payroll"]],
  ["plan", ["rates", "calendar", "dashboard"]],
];

export default function hub(ctx) {
  const { t } = ctx;
  const trail = [{ label: t("site.nav.allTools") }];
  const body = html`${pageHead(ctx, {
    trail,
    title: t("site.meta.hub.title"),
    lead: t("page.company.hub.lead"),
    badges: [
      badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck")),
      badge(t("site.common.free"), "blue"),
    ],
  })}
  ${GROUPS.map(
    ([key, ids], index) =>
      html`<section class="section${index % 2 ? " section--alt" : ""}">
        <div class="container">
          <div class="section-head">
            <h2>${t(`page.company.hub.groups.${key}`)}</h2>
          </div>
          ${toolGrid(ctx, ids)}
        </div>
      </section>`,
  )}`;
  return {
    id: "hub",
    navId: "hub",
    title: t("site.meta.hub.title"),
    description: t("site.meta.hub.description"),
    body,
    entries: ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, "hub")],
  };
}
