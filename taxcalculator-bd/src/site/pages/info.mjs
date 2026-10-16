import { html } from "../html.mjs";
import { badge, breadcrumbJsonLd, pageHead, toolGrid } from "../components.mjs";
import { renderBlocks } from "../blocks.mjs";

const LABEL_KEY = {
  about: "site.nav.about",
  privacy: "site.footer.privacy",
  disclaimer: "site.footer.disclaimerLink",
};

function infoPage(ctx, id) {
  const { t, config, fmt } = ctx;
  const trail = [{ label: t(LABEL_KEY[id]) }];
  const badges =
    id === "privacy"
      ? [
          badge(
            t("page.company.privacy.updated", {
              date: fmt.date(config.rulesVerifiedOn),
            }),
            "outline",
          ),
        ]
      : [];
  const body = html`${pageHead(ctx, { trail, title: t(LABEL_KEY[id]), lead: t(`page.company.${id}.lead`), badges })}
    <section class="section section--tight">
      <div class="container prose">
        ${renderBlocks(ctx, t.get(`page.company.${id}.blocks`))}
      </div>
    </section>`;
  return {
    id,
    title: t(`site.meta.${id}.title`),
    description: t(`site.meta.${id}.description`),
    body,
    entries: ["common"],
    jsonld: [breadcrumbJsonLd(ctx, trail, id)],
  };
}

export const about = (ctx) => infoPage(ctx, "about");
export const privacy = (ctx) => infoPage(ctx, "privacy");
export const disclaimer = (ctx) => infoPage(ctx, "disclaimer");

export function notFound(ctx) {
  const { t } = ctx;
  const body = html`<section class="section not-found">
    <div class="container">
      <p class="not-found-code" aria-hidden="true">404</p>
      <h1>${t("page.company.notFound.heading")}</h1>
      <p class="lead">${t("page.company.notFound.text")}</p>
      <p>
        <a class="btn btn-primary btn-lg" href="${ctx.pageUrl("home")}"
          >${t("page.company.notFound.home")}${ctx.icon("arrowRight")}</a
        >
      </p>
      ${toolGrid(ctx, ["income", "salary", "vat"], 2)}
    </div>
  </section>`;
  return {
    id: "notFound",
    title: t("site.meta.notFound.title"),
    description: t("site.meta.notFound.description"),
    body,
    entries: ["common"],
    noindex: true,
  };
}
