import { nextEvents } from "../../core/calendar.mjs";
import { eventTitle } from "../../views/calendar-text.mjs";
import {
  clearSaved,
  getChecklist,
  listSaved,
  removeSaved,
  setChecklistItem,
} from "../lib/storage.js";
import { $, esc, icon, localToday } from "../lib/dom.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

const params = (entry) => new URLSearchParams(entry.query ?? "").toString();

function kpiCard(label, value, sub, extra = "") {
  return `<div class="kpi-card">${extra}<div><small>${esc(label)}</small><strong class="num">${esc(value)}</strong><span>${esc(sub)}</span></div></div>`;
}

function ring(percent) {
  const circumference = 2 * Math.PI * 20;
  return `<svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="20"/><circle class="ring-fg" cx="24" cy="24" r="20" stroke-dasharray="${((percent / 100) * circumference).toFixed(1)} ${circumference.toFixed(1)}"/></svg>`;
}

function renderKpis(root, saved, items, done) {
  const latest = (tool) => saved.find((entry) => entry.tool === tool);
  const income = latest("income");
  const salary = latest("salary");
  const next = nextEvents(localToday(), 1)[0];
  const percent = Math.round((done / items.length) * 100);
  const K = "ui.dash.kpi.";
  const cards = [
    income
      ? kpiCard(
          t(`${K}income`),
          fmt.taka(income.amount),
          `${t("ui.common.ay")} ${fmt.digits(income.ay)}`,
        )
      : kpiCard(t(`${K}income`), "\u2014", t(`${K}none`)),
    salary
      ? kpiCard(
          t(`${K}salary`),
          fmt.taka(salary.amount),
          `${t("ui.common.perMonth")} · ${fmt.digits(salary.ay)}`,
        )
      : kpiCard(t(`${K}salary`), "\u2014", t(`${K}none`)),
    kpiCard(
      t(`${K}checklist`),
      `${fmt.digits(percent)}%`,
      t(`${K}done`, {
        done: fmt.digits(done),
        total: fmt.digits(items.length),
      }),
      ring(percent),
    ),
    next
      ? kpiCard(
          t(`${K}next`),
          eventTitle(next, { t, fmt }),
          next.daysLeft === 0
            ? t(`${K}today`)
            : t(`${K}days`, { n: fmt.digits(next.daysLeft) }),
        )
      : kpiCard(t(`${K}next`), "\u2014", ""),
  ];
  root.innerHTML = cards.join("");
}

function renderSaved(root, saved, paths) {
  const S = "ui.dash.saved.";
  $("[data-clear-saved]").hidden = saved.length === 0;
  if (!saved.length) {
    root.innerHTML = `<p class="muted">${esc(t(`${S}empty`))}</p>`;
    return;
  }
  const rows = saved.map((entry) => {
    const base = paths[entry.tool] ?? "";
    const [path, hash = ""] = base.split("#");
    const query = params(entry);
    const href = `${path}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
    const line = t(`${S}line.${entry.tool}`, {
      amount: fmt.taka(entry.amount),
      secondary: fmt.taka(entry.secondary ?? 0),
    });
    const when = fmt.date(new Date(entry.ts).toISOString().slice(0, 10));
    const ay = entry.ay
      ? ` · ${t("ui.common.ay")} ${fmt.digits(entry.ay)}`
      : "";
    return `<li class="saved-item">
      <div><strong>${esc(t(`${S}tools.${entry.tool}`))}${esc(ay)}</strong><span>${esc(line)}</span><small>${esc(t(`${S}savedOn`, { date: when }))}</small></div>
      <div class="cluster"><a class="btn btn-secondary btn-sm" href="${esc(href)}">${esc(t(`${S}open`))}</a>
      <button class="btn btn-ghost btn-sm" type="button" data-remove="${esc(entry.id)}" aria-label="${esc(t(`${S}delete`))}">${icon("trash")}</button></div>
    </li>`;
  });
  root.innerHTML = `<ul class="saved-list">${rows.join("")}</ul>`;
}

function renderChecklist(root, items, state) {
  root.innerHTML = `<ul class="checklist">${items
    .map(
      (item) =>
        `<li><label class="check"><input type="checkbox" data-check="${esc(item.id)}"${state[item.id] ? " checked" : ""}><span class="check-box" aria-hidden="true">${icon("check")}</span><span class="check-text"><strong>${esc(item.title)}</strong><small>${esc(item.text)}</small></span></label></li>`,
    )
    .join("")}</ul>`;
}

function renderSoon(root, calendarUrl) {
  const events = nextEvents(localToday(), 4);
  root.innerHTML = `<ul class="soon-list">${events
    .map((event) => {
      const title = eventTitle(event, { t, fmt });
      const when =
        event.daysLeft === 0
          ? t("ui.dash.kpi.today")
          : t("ui.dash.kpi.days", { n: fmt.digits(event.daysLeft) });
      return `<li><span class="soon-date">${esc(fmt.date(event.date, { day: "numeric", month: "short" }))}</span><span>${esc(title)}</span><b>${esc(when)}</b></li>`;
    })
    .join(
      "",
    )}</ul><p><a href="${esc(calendarUrl)}">${esc(t("ui.cal.title"))}</a></p>`;
}

export function init() {
  const root = $("[data-dash]");
  if (!root) return;
  const paths = JSON.parse(root.dataset.paths);
  const items = t.get("ui.dash.checklist.items");

  function render() {
    const saved = listSaved();
    const state = getChecklist();
    const done = items.filter((item) => state[item.id]).length;
    renderKpis($("[data-kpis]", root), saved, items, done);
    renderSaved($("[data-saved]", root), saved, paths);
    renderChecklist($("[data-checklist]", root), items, state);
    $("[data-check-progress]", root).textContent = t(
      "ui.dash.checklist.progress",
      { done: fmt.digits(done), total: fmt.digits(items.length) },
    );
    renderSoon($("[data-soon]", root), root.dataset.calendar);
  }

  root.addEventListener("change", (event) => {
    const box = event.target.closest("[data-check]");
    if (!box) return;
    setChecklistItem(box.dataset.check, box.checked);
    render();
  });
  root.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      removeSaved(remove.dataset.remove);
      render();
    }
    if (
      event.target.closest("[data-clear-saved]") &&
      confirm(t("ui.dash.saved.confirmClear"))
    ) {
      clearSaved();
      render();
    }
    if (event.target.closest("[data-reset-checklist]")) {
      for (const item of items) setChecklistItem(item.id, false);
      render();
    }
  });
  render();
}
