import { html } from "../html.mjs";
import {
  badge,
  breadcrumbJsonLd,
  pageHead,
  sourcesList,
} from "../components.mjs";
import { renderBlocks } from "../blocks.mjs";
import { AUDIENCES, TAX_EVENTS } from "../../core/calendar.mjs";
import { SOURCES } from "../../core/rules.mjs";
import { eventDesc, eventTitle } from "../../views/calendar-text.mjs";

function eventItem(ctx, event) {
  const { t, fmt } = ctx;
  const title = eventTitle(event, ctx);
  const desc = eventDesc(event, ctx);
  return html`<li
    class="event"
    data-event
    data-id="${event.id}"
    data-date="${event.date}"
    data-audience="${event.audience}"
    data-title="${title}"
    data-desc="${desc}"
  >
    <div class="event-date" aria-hidden="true">
      <b>${fmt.date(event.date, { day: "numeric" })}</b
      ><span>${fmt.date(event.date, { month: "short" })}</span>
    </div>
    <div class="event-body">
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="cluster">
        ${badge(t(`ui.cal.audience.${event.audience}`))}${badge(t(`ui.cal.kind.${event.kind}`), "outline")}
        <time datetime="${event.date}" class="event-full"
          >${fmt.date(event.date)}</time
        >
      </div>
    </div>
    <div class="event-side">
      <span class="status" data-status></span>
      <button class="btn btn-secondary btn-sm" type="button" data-ics>
        ${ctx.icon("calendarClock")}${t("ui.cal.addOne")}
      </button>
    </div>
  </li>`;
}

export default function calendar(ctx) {
  const { t, fmt } = ctx;
  const sorted = [...TAX_EVENTS].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
  const months = [...new Set(sorted.map((event) => event.date.slice(0, 7)))];
  const filters = ["all", ...AUDIENCES];
  const trail = [{ label: t("site.tools.calendar.name") }];
  const body = html`${pageHead(ctx, {
      trail,
      title: t("site.tools.calendar.name"),
      lead: t("page.tools.calendar.lead"),
      badges: [badge(t("site.common.fyBadge"), "", ctx.icon("badgeCheck"))],
    })}
    <section class="section section--tight">
      <div
        class="container cal"
        data-cal
        data-ics-name="${t("ui.cal.icsName")}"
      >
        <div class="cal-toolbar">
          <div
            class="chips"
            role="group"
            aria-label="${t("ui.cal.filters.label")}"
          >
            ${filters.map(
              (key) =>
                html`<button
                  class="chip"
                  type="button"
                  data-filter="${key}"
                  aria-pressed="${key === "all"}"
                >
                  ${t(`ui.cal.filters.${key}`)}
                </button>`,
            )}
          </div>
          <button class="btn btn-primary btn-sm" type="button" data-ics-all>
            ${ctx.icon("download")}${t("ui.cal.addAll")}
          </button>
        </div>
        ${months.map(
          (month) =>
            html`<section class="cal-month" data-month>
              <h2>
                ${fmt.date(`${month}-01`, { month: "long", year: "numeric" })}
              </h2>
              <ol class="events">
                ${sorted.filter((event) => event.date.startsWith(month)).map((event) => eventItem(ctx, event))}
              </ol>
            </section>`,
        )}
        <p class="hint" data-empty hidden>${t("ui.cal.empty")}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container prose">
        ${renderBlocks(ctx, t.get("page.tools.calendar.explain"))}${sourcesList(ctx, [SOURCES.pwcAdmin, SOURCES.pwcFinanceAct, SOURCES.nbrFinanceActs])}
      </div>
    </section>`;
  return {
    id: "calendar",
    title: t("site.meta.calendar.title"),
    description: t("site.meta.calendar.description"),
    body,
    entries: ["calendar"],
    jsonld: [breadcrumbJsonLd(ctx, trail, "calendar")],
  };
}
