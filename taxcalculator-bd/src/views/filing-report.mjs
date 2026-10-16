import { filingAdjustment, filingWindows } from "../core/filing.mjs";
import { roundTaka } from "../core/format.mjs";
import { FILING, ayInfo } from "../core/rules.mjs";

const MINUS = "\u2212";

export function filingScenario(values) {
  if (!values.date) return null;
  return filingAdjustment({
    ay: values.ay,
    tax: values.tax,
    date: values.date,
    firstTime: Boolean(values.firstTime),
    underNotice: Boolean(values.underNotice),
  });
}

function timelineItems(r, { t, fmt }) {
  const T = "ui.fil.result.timeline.";
  const windows = filingWindows(r.ay);
  const short = { day: "numeric", month: "short" };
  const full = { day: "numeric", month: "short", year: "numeric" };
  const range = (w) =>
    `${fmt.date(w.from, short)} \u2013 ${fmt.date(w.to, full)}`;
  const cost = (rate, min) =>
    fmt.taka(Math.max(roundTaka((r.liability * rate) / 100), min));
  const effects = {
    rebate: `${MINUS}${fmt.taka(Math.min(roundTaka((r.liability * FILING.rebateRate) / 100), FILING.rebateCap))}`,
    neutral: t(`${T}none`),
    additional2: `+${cost(FILING.additional[0].rate, FILING.additional[0].min)}`,
    additional5: `+${cost(FILING.additional[1].rate, FILING.additional[1].min)}`,
  };
  const tones = { rebate: "good", additional2: "bad", additional5: "bad" };
  const state = (w) =>
    r.date > w.to ? "past" : r.date >= w.from ? "current" : "future";
  const items = windows.map((w) => ({
    label: t(`${T}${w.id}`),
    range: range(w),
    effect: effects[w.id],
    state: r.kind === "firstTime" || r.kind === "notOpen" ? "future" : state(w),
    tone: tones[w.id],
  }));
  const yearEnd = windows[3].to;
  const delayedRule = r.underNotice ? FILING.reassessment : FILING.delayed;
  items.push({
    label: t(`${T}delayed`),
    range: t(`${T}after`, { date: fmt.date(yearEnd, full) }),
    effect: `+${cost(delayedRule.rate, delayedRule.min)}`,
    state: r.kind === "delayed" ? "current" : "future",
    tone: "bad",
  });
  return items;
}

function notes(r, { t, fmt }) {
  const N = "ui.fil.result.notes.";
  const out = [{ tone: "info", text: t(`${N}base`) }];
  if (r.kind === "firstTime")
    out.push({
      tone: "info",
      text: t(`${N}first`, { date: fmt.date(r.dueDate) }),
    });
  if (r.window && r.nextCost !== null) {
    out.push({
      tone: "warn",
      text: t(`${N}wait`, {
        date: fmt.date(r.window.to),
        cost: fmt.taka(r.nextCost),
      }),
    });
  }
  if (["additional", "delayed"].includes(r.kind) && r.liability === 0)
    out.push({ tone: "warn", text: t(`${N}zero`) });
  out.push({ tone: "info", text: t(`${N}efile`) });
  return out;
}

export function buildFilingReport(r, values, { t, fmt }) {
  if (!r) return null;
  const R = "ui.fil.result.";
  const kind = r.kind;
  const sign =
    kind === "rebate"
      ? MINUS
      : kind === "additional" || kind === "delayed"
        ? "+"
        : "";
  const params = {
    payable: fmt.taka(r.payable),
    tax: fmt.taka(r.liability),
    year: fmt.digits(ayInfo(r.ay).startYear),
    date: r.dueDate ? fmt.date(r.dueDate) : "",
  };
  const hero = {
    label: t(`${R}headline.${kind}`),
    value: `${sign}${fmt.taka(r.amount)}`,
    tone: kind === "rebate" ? "good" : "",
    sub: t(`${R}sub.${kind}`, params),
    kpis: [
      {
        label: t(`${R}kpi.date`),
        value: fmt.date(values.date, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      {
        label: t(`${R}kpi.daysLeft`),
        value:
          r.daysLeftInWindow === null
            ? t(`${R}kpi.none`)
            : fmt.digits(r.daysLeftInWindow),
      },
      {
        label: t(`${R}kpi.cost`),
        value: r.nextCost === null ? t(`${R}kpi.none`) : fmt.taka(r.nextCost),
      },
      { label: t(`${R}kpi.payable`), value: fmt.taka(r.payable) },
    ],
  };
  const withDate = { ...r, date: values.date };
  return {
    hero,
    sections: [
      {
        type: "timeline",
        title: t(`${R}timeline.title`),
        items: timelineItems(withDate, { t, fmt }),
      },
      { type: "notes", items: notes(withDate, { t, fmt }) },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "filing",
      ay: r.ay,
      amount: r.amount,
      secondary: r.payable,
    },
  };
}
