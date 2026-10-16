import { computeIncomeTax } from "../core/income-tax.mjs";
import { planRebate } from "../core/rebate.mjs";
import { ayInfo, REBATE_LIMITS } from "../core/rules.mjs";
import { incomeInputRows } from "./income-report.mjs";

/** Engine run for the planner: tax with the entered investments plus the plan for the maximum. */
export function rebateScenario(values) {
  const r = computeIncomeTax(values);
  const plan = planRebate({ ay: r.ay, totalIncome: r.income.totalTaxable });
  const target = Math.min(plan.maxRebate, r.grossTax);
  const needed = Math.ceil((target * 100) / plan.rate);
  return {
    r,
    plan,
    target,
    needed,
    extra: Math.max(0, needed - r.rebate.eligible.total),
  };
}

function limitsTable({ r }, { t, fmt }) {
  const L = "ui.reb.result.limits.";
  const lowest = t(`${L}lowest`);
  const mark = (key) => (r.rebate.binding === key ? lowest : "");
  return {
    type: "table",
    title: t(`${L}title`),
    head: [t(`${L}limit`), t(`${L}amount`), t(`${L}status`)],
    numeric: [1],
    rows: [
      [t(`${L}income`), fmt.taka(r.rebate.byIncome), mark("income")],
      [
        t(`${L}investment`, { rate: fmt.percent(r.rebate.rate) }),
        fmt.taka(r.rebate.byInvestment),
        mark("investment"),
      ],
      [t(`${L}cap`), fmt.taka(r.rebate.cap), mark("cap")],
    ],
  };
}

function chartSection(s, { t, fmt }) {
  const { r, target, needed } = s;
  if (target <= 0) return null;
  const eligible = r.rebate.eligible.total;
  const xMax = Math.max(needed * 1.35, eligible * 1.1, 1000);
  const yMax = target * 1.2;
  return {
    type: "chart",
    title: t("ui.reb.result.chart.title"),
    label: t("ui.reb.result.chart.label"),
    points: [
      [0, 0],
      [needed, target],
      [xMax, target],
    ],
    marker: { x: Math.min(eligible, xMax), y: r.rebate.amount },
    xMax,
    yMax,
    xTicks: [0, needed, xMax].map((value) => ({
      value,
      label: fmt.compact(value),
    })),
    yTicks: [0, target].map((value) => ({ value, label: fmt.compact(value) })),
  };
}

function instrumentsTable({ t, fmt }) {
  const I = "ui.reb.result.instruments.";
  return {
    type: "table",
    title: t(`${I}title`),
    head: [t(`${I}item`), t(`${I}limit`)],
    rows: [
      [t(`${I}dps`), t(`${I}upTo`, { amount: fmt.taka(REBATE_LIMITS.dps) })],
      [
        t(`${I}savings`),
        t(`${I}upTo`, { amount: fmt.taka(REBATE_LIMITS.savingsCertificates) }),
      ],
      [t(`${I}life`), t(`${I}lifeLimit`)],
      [t(`${I}pf`), t(`${I}pfLimit`)],
      [t(`${I}funds`), t(`${I}fundsLimit`)],
      [t(`${I}donations`), t(`${I}donationsLimit`)],
    ],
  };
}

function notes(s, { t, fmt }, today) {
  const N = "ui.reb.result.notes.";
  const { r } = s;
  const { startYear } = ayInfo(r.ay);
  const deadline = `${startYear}-06-30`;
  const out = [];
  if (today > deadline)
    out.push({ tone: "warn", text: t(`${N}closed`, { ay: fmt.digits(r.ay) }) });
  else
    out.push({
      tone: "info",
      text: t(`${N}open`, {
        year: fmt.digits(startYear),
        ay: fmt.digits(r.ay),
      }),
    });
  if (r.grossTax <= 0) out.push({ tone: "good", text: t(`${N}noTax`) });
  else if (s.extra > 0)
    out.push({
      tone: "good",
      text: t(`${N}more`, {
        extra: fmt.taka(s.extra),
        max: fmt.taka(s.target),
      }),
    });
  else out.push({ tone: "good", text: t(`${N}maxed`) });
  if (r.minimumApplied)
    out.push({
      tone: "info",
      text: t(`${N}minimum`, { amount: fmt.taka(r.minimumTax) }),
    });
  out.push({ tone: "warn", text: t(`${N}advice`) });
  return out;
}

export function buildRebateReport(s, values, ctx, today) {
  const { t, fmt } = ctx;
  const { r } = s;
  if (r.income.gross <= 0) return null;
  const R = "ui.reb.result.";
  const hero = {
    label: t(`${R}headline`),
    value: fmt.taka(r.rebate.amount),
    sub: t(`${R}sub`, {
      before: fmt.taka(r.grossTax),
      after: fmt.taka(r.afterRebate),
    }),
    kpis: [
      { label: t(`${R}eligible`), value: fmt.taka(r.rebate.eligible.total) },
      { label: t(`${R}max`), value: fmt.taka(s.target) },
      { label: t(`${R}needed`), value: fmt.taka(s.needed) },
      { label: t(`${R}extra`), value: fmt.taka(s.extra) },
    ],
  };
  return {
    hero,
    sections: [
      limitsTable(s, ctx),
      chartSection(s, ctx),
      { type: "notes", items: notes(s, ctx, today) },
      instrumentsTable(ctx),
      {
        type: "inputs",
        rows: incomeInputRows({ ...values, taxPaid: 0, netWealth: 0 }, ctx),
      },
    ].filter(Boolean),
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "rebate",
      ay: r.ay,
      amount: r.rebate.amount,
      secondary: s.needed,
    },
  };
}
