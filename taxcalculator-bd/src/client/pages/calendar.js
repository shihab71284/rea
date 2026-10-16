import { timeline } from "../../core/calendar.mjs";
import { buildIcs } from "../../core/ics.mjs";
import { downloadText } from "../lib/chrome.js";
import { $, $$, localToday } from "../lib/dom.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

function statusText(daysLeft) {
  if (daysLeft < 0) return t("ui.cal.status.passed");
  if (daysLeft === 0) return t("ui.cal.status.today");
  if (daysLeft === 1) return t("ui.cal.status.tomorrow");
  return t("ui.cal.status.days", { n: fmt.digits(daysLeft) });
}

export function init() {
  const root = $("[data-cal]");
  if (!root) return;
  const today = localToday();
  const byId = new Map(timeline(today).map((event) => [event.id, event]));
  const items = $$("[data-event]", root);

  for (const item of items) {
    const info = byId.get(item.dataset.id);
    const status = $("[data-status]", item);
    status.textContent = statusText(info.daysLeft);
    status.className = `status status--${info.status}`;
    item.classList.toggle("is-past", info.status === "past");
  }

  const icsFor = (nodes) =>
    buildIcs(
      nodes.map((node) => ({
        uid: `${node.dataset.id}@taxcalculator.bd`,
        date: node.dataset.date,
        summary: node.dataset.title,
        description: node.dataset.desc,
        url: location.origin + location.pathname,
      })),
      { name: root.dataset.icsName },
    );

  root.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-filter]");
    if (filter) {
      for (const chip of $$("[data-filter]", root))
        chip.setAttribute("aria-pressed", String(chip === filter));
      let visible = 0;
      for (const item of items) {
        const show =
          filter.dataset.filter === "all" ||
          item.dataset.audience === filter.dataset.filter;
        item.hidden = !show;
        if (show) visible += 1;
      }
      for (const month of $$("[data-month]", root))
        month.hidden = !$$("[data-event]", month).some((item) => !item.hidden);
      $("[data-empty]", root).hidden = visible > 0;
      return;
    }
    const one = event.target.closest("[data-ics]");
    if (one)
      downloadText(
        "tax-reminder.ics",
        icsFor([one.closest("[data-event]")]),
        "text/calendar;charset=utf-8",
      );
    if (event.target.closest("[data-ics-all]")) {
      downloadText(
        "bangladesh-tax-calendar.ics",
        icsFor(items.filter((item) => !item.hidden)),
        "text/calendar;charset=utf-8",
      );
    }
  });
}
