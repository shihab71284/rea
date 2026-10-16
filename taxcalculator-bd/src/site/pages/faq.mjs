import { html } from "../html.mjs";
import {
  badge,
  breadcrumbJsonLd,
  faqJsonLd,
  faqList,
  pageHead,
} from "../components.mjs";

export function faqItems(ctx, ids) {
  const all = ctx.t.get("faq.groups").flatMap((group) => group.items);
  return ids.map((id) => all.find((item) => item.id === id)).filter(Boolean);
}

export default function faq(ctx) {
  const { t } = ctx;
  const trail = [{ label: t("site.nav.faq") }];
  const groups = t.get("faq.groups");
  const body = html`${pageHead(ctx, { trail, title: t("site.nav.faq"), lead: t("faq.lead"), badges: [badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck"))] })}
    <section class="section section--tight">
      <div class="container">
        ${groups.map(
          (group) =>
            html`<div class="faq-group">
              <h2>${group.title}</h2>
              ${faqList(ctx, group.items)}
            </div>`,
        )}
      </div>
    </section>`;
  return {
    id: "faq",
    title: t("site.meta.faq.title"),
    description: t("site.meta.faq.description"),
    body,
    entries: ["common"],
    jsonld: [
      breadcrumbJsonLd(ctx, trail, "faq"),
      faqJsonLd(groups.flatMap((group) => group.items)),
    ],
  };
}
