import { lineChartSvg } from "./charts.js";
import { esc, icon } from "./dom.js";
import { t } from "./i18n.js";

const NOTE_ICON = {
  info: "info",
  good: "circleCheck",
  warn: "alert",
  bad: "alert",
};

const card = (title, body, extraClass = "") =>
  `<section class="panel report-card ${extraClass}">${title ? `<h3>${esc(title)}</h3>` : ""}${body}</section>`;

const stepHtml = (step) => `<li class="step step--${esc(step.kind)}">
  <span class="step-no">${esc(step.no)}</span>
  <span class="step-label">${esc(step.label)}</span>
  <span class="step-value num">${esc(step.value)}</span>
  ${step.note ? `<span class="step-note">${esc(step.note)}</span>` : ""}
</li>`;

function barHtml(section) {
  const segments = section.segments;
  const label = segments.map((s) => `${s.label}: ${s.display}`).join(", ");
  return `<div class="report-body">
    <div class="bar" role="img" aria-label="${esc(label)}">${segments
      .map(
        (s) =>
          `<span class="${esc(s.className)}" data-w="${s.percent.toFixed(2)}"></span>`,
      )
      .join("")}</div>
    <ul class="legend">${segments
      .map(
        (s) =>
          `<li><i class="${esc(s.className)}"></i><span>${esc(s.label)}</span><b class="num">${esc(s.display)}</b></li>`,
      )
      .join("")}</ul>
  </div>`;
}

function tableHtml(section) {
  const numeric = new Set(section.numeric ?? []);
  const cell = (tag, value, index) =>
    `<${tag}${numeric.has(index) ? ' class="num"' : ""}>${esc(value)}</${tag}>`;
  const head = `<tr>${section.head.map((value, i) => cell("th", value, i)).join("")}</tr>`;
  const rows = section.rows
    .map(
      (row) =>
        `<tr>${row.map((value, i) => cell("td", value, i)).join("")}</tr>`,
    )
    .join("");
  const foot = section.foot
    ? `<tr class="total">${section.foot.map((value, i) => cell("td", value, i)).join("")}</tr>`
    : "";
  return `<div class="table-wrap" tabindex="0"><table class="table"><thead>${head}</thead><tbody>${rows}${foot}</tbody></table></div>`;
}

function notesHtml(items) {
  if (!items.length) return "";
  const note = (item) =>
    `<div class="callout${item.tone === "info" ? "" : ` callout--${esc(item.tone)}`}" role="note">${icon(NOTE_ICON[item.tone] ?? "info")}<div>${esc(item.text)}</div></div>`;
  return `<section class="panel notes" aria-label="${esc(t("ui.common.report.notes"))}">${items.map(note).join("")}</section>`;
}

function timelineHtml(section) {
  const item = (
    entry,
  ) => `<li class="tl tl--${esc(entry.state)}${entry.tone ? ` tl--${esc(entry.tone)}` : ""}">
    <span class="tl-dot" aria-hidden="true"></span>
    <div><b>${esc(entry.label)}</b><span>${esc(entry.range)}</span></div>
    <strong class="num">${esc(entry.effect)}</strong>
    ${entry.note ? `<small>${esc(entry.note)}</small>` : ""}
  </li>`;
  return `<ol class="timeline">${section.items.map(item).join("")}</ol>`;
}

function sectionHtml(section) {
  switch (section.type) {
    case "timeline":
      return card(section.title, timelineHtml(section));
    case "chart":
      return card(
        section.title,
        `<div class="report-body">${lineChartSvg(section)}</div>`,
      );
    case "steps":
      return card(
        section.title,
        `<ol class="steps">${section.items.map(stepHtml).join("")}</ol>`,
      );
    case "group":
      return card(section.title, section.children.map(innerHtml).join(""));
    case "bar":
    case "table":
      return card(section.title, innerHtml(section));
    case "notes":
      return notesHtml(section.items);
    case "inputs":
      return card(
        "",
        tableHtml({
          head: [t("ui.common.report.inputs"), t("ui.common.report.value")],
          rows: section.rows,
          numeric: [1],
        }),
        "print-only",
      );
    default:
      return "";
  }
}

const innerHtml = (section) =>
  section.type === "bar" ? barHtml(section) : tableHtml(section);

function heroHtml(hero) {
  const kpis = (hero.kpis ?? [])
    .map(
      (kpi) =>
        `<div class="kpi"><dt>${esc(kpi.label)}</dt><dd>${esc(kpi.value)}</dd></div>`,
    )
    .join("");
  return `<section class="result-hero" data-tone="${esc(hero.tone ?? "")}">
    <div class="result-label">${esc(hero.label)}</div>
    <div class="result-value num" aria-live="polite" aria-atomic="true">${esc(hero.value)}</div>
    ${hero.sub ? `<p class="result-sub">${esc(hero.sub)}</p>` : ""}
    ${kpis ? `<dl class="kpi-row">${kpis}</dl>` : ""}
  </section>`;
}

const button = (action, iconName, label) =>
  `<button class="btn btn-secondary btn-sm" type="button" data-action="${action}">${icon(iconName)}<span>${esc(label)}</span></button>`;

function actionsHtml({ extra = "", showSave = true, showCopy = true }) {
  const A = "ui.common.actions.";
  const parts = [
    showSave ? button("save", "save", t(`${A}save`)) : "",
    showCopy ? button("copy", "link", t(`${A}copyLink`)) : "",
    button("print", "printer", t(`${A}print`)),
    extra,
  ];
  return `<div class="panel result-actions">${parts.join("")}</div>`;
}

function printHead() {
  return `<div class="print-head print-only"><strong>TaxCalculator.bd</strong><span>${esc(
    t("ui.common.report.generated", {
      date: new Date().toLocaleDateString(
        document.documentElement.lang === "bn" ? "bn-BD" : "en-GB",
      ),
    }),
  )}</span></div>`;
}

/** Draw a report (see views/*) into the result column. */
export function renderReport(container, report, options = {}) {
  container.innerHTML = [
    printHead(),
    heroHtml(report.hero),
    ...report.sections.map(sectionHtml),
    actionsHtml({
      extra: options.extraActions ?? "",
      showSave: options.showSave !== false,
      showCopy: options.showCopy !== false,
    }),
    `<p class="hint report-disclaimer">${esc(t("ui.common.report.estimate"))}</p>`,
  ].join("");
  for (const segment of container.querySelectorAll("[data-w]")) {
    segment.style.width = `${segment.dataset.w}%`;
  }
}

export function renderEmpty(container, text) {
  container.innerHTML = `<div class="panel result-empty"><p>${esc(text)}</p></div>`;
}
