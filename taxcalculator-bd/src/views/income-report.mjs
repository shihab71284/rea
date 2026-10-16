import { planRebate } from "../core/rebate.mjs";
import { ayInfo } from "../core/rules.mjs";

const RATE_CLASS = {
  0: "c0",
  5: "c1",
  10: "c2",
  15: "c3",
  20: "c4",
  25: "c5",
  30: "c6",
  35: "c6",
};
const MINUS = "\u2212";

/** Human label for a slab row ("First ৳4,00,000", "Next ৳3,00,000", "Balance"). */
export function slabLabel(row, index, { t, fmt }) {
  if (index === 0)
    return t("ui.it.result.slabs.first", { amount: fmt.taka(row.width) });
  if (!Number.isFinite(row.width)) return t("ui.it.result.slabs.rest");
  return t("ui.it.result.slabs.next", { amount: fmt.taka(row.width) });
}

/** The ten e-Return-ordered steps from taxable income to payable/refundable. */
export function taxSteps(r, values, { t, fmt }) {
  const S = "ui.it.result.steps.";
  const N = "ui.it.result.stepNotes.";
  const category = t(`ui.common.categories.${values.category ?? "general"}`);
  const thresholdNote = r.threshold.dependants
    ? `${category} + ${fmt.taka(r.threshold.extra)}`
    : t(`${N}threshold`, { category });
  const final = r.payable >= 0 ? t(`${S}payable`) : t(`${S}refund`);
  const minimumNote = r.exceedsThreshold
    ? t(r.minimumApplied ? `${N}minimumApplied` : `${N}minimumNotApplied`)
    : "";
  return [
    {
      label: t(`${S}taxable`),
      value: fmt.taka(r.income.totalTaxable),
      note:
        r.income.employment > 0
          ? t(`${N}exempt`, { amount: fmt.taka(r.income.exempt) })
          : t(`${N}taxable`),
      kind: "sum",
    },
    {
      label: t(`${S}threshold`),
      value: fmt.taka(r.threshold.total),
      note: thresholdNote,
      kind: "muted",
    },
    { label: t(`${S}slabTax`), value: fmt.taka(r.grossTax), kind: "plus" },
    {
      label: t(`${S}rebate`),
      value: r.rebate.amount
        ? `${MINUS}${fmt.taka(r.rebate.amount)}`
        : fmt.taka(0),
      kind: "minus",
    },
    {
      label: t(`${S}afterRebate`),
      value: fmt.taka(r.afterRebate),
      kind: "sum",
    },
    {
      label: t(`${S}minimum`),
      value: fmt.taka(r.minimumTax),
      note: minimumNote,
      kind: "muted",
    },
    {
      label: t(`${S}surcharge`),
      value: `+${fmt.taka(r.surcharge.amount)}`,
      note: r.surcharge.rate
        ? t(`${N}surchargeRate`, { rate: fmt.percent(r.surcharge.rate) })
        : "",
      kind: "plus",
    },
    { label: t(`${S}total`), value: fmt.taka(r.totalTax), kind: "sum" },
    {
      label: t(`${S}paid`),
      value: r.taxPaid ? `${MINUS}${fmt.taka(r.taxPaid)}` : fmt.taka(0),
      kind: "minus",
    },
    { label: final, value: fmt.taka(Math.abs(r.payable)), kind: "final" },
  ].map((step, index) => ({ ...step, no: fmt.digits(index + 1) }));
}

/** Stacked slab bar plus the slab table. */
export function slabSections(r, ctx) {
  const { t, fmt } = ctx;
  const rows = r.slab.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => index === 0 || row.amount > 0);
  const total = r.income.totalTaxable || 1;
  const segments = rows
    .filter(({ row }) => row.amount > 0)
    .map(({ row, index }) => ({
      label: `${slabLabel(row, index, ctx)}${index === 0 ? ` (${t("ui.it.result.slabs.free")})` : ` · ${fmt.percent(row.rate)}`}`,
      value: row.amount,
      display: fmt.taka(row.amount),
      percent: (row.amount / total) * 100,
      className: RATE_CLASS[row.rate] ?? "c6",
    }));
  const table = {
    type: "table",
    head: [
      t("ui.it.result.slabs.slab"),
      t("ui.it.result.slabs.rate"),
      t("ui.it.result.slabs.amount"),
      t("ui.it.result.slabs.tax"),
    ],
    numeric: [1, 2, 3],
    rows: rows.map(({ row, index }) => [
      slabLabel(row, index, ctx) +
        (index === 0 ? ` (${t("ui.it.result.slabs.free")})` : ""),
      fmt.percent(row.rate),
      fmt.taka(row.amount),
      fmt.taka(row.tax),
    ]),
    foot: [
      t("ui.common.words.total"),
      "",
      fmt.taka(r.income.totalTaxable),
      fmt.taka(r.grossTax),
    ],
  };
  return [
    {
      type: "group",
      title: t("ui.it.result.slabs.title"),
      children: [{ type: "bar", segments }, table],
    },
  ];
}

function rebateReason(r, { t, fmt }) {
  const R = "ui.it.result.notes.rebateReasons.";
  if (r.rebate.limitedByTax) return t(`${R}tax`);
  if (r.rebate.binding === "income") return t(`${R}income`);
  if (r.rebate.binding === "cap")
    return t(`${R}cap`, { amount: fmt.taka(r.rebate.cap) });
  return t(`${R}investment`, { rate: fmt.percent(r.rebate.rate) });
}

/** Contextual notes shown under the steps. `today` is yyyy-mm-dd. */
export function taxNotes(r, ctx, today) {
  const { t, fmt } = ctx;
  const N = "ui.it.result.notes.";
  const notes = [];
  if (!r.exceedsThreshold)
    notes.push({ tone: "good", text: t(`${N}belowThreshold`) });
  if (r.minimumApplied)
    notes.push({
      tone: "info",
      text: t(`${N}minimumApplied`, { amount: fmt.taka(r.minimumTax) }),
    });
  const showRebate =
    r.rebate.eligible.total > 0 &&
    (r.rebate.binding !== "investment" || r.rebate.limitedByTax);
  if (showRebate)
    notes.push({
      tone: "info",
      text: t(`${N}rebateLimit`, { reason: rebateReason(r, ctx) }),
    });
  if (r.surcharge.rate && r.surcharge.amount > 0) {
    const reasons = r.surcharge.reasons
      .map((reason) => t(`${N}surchargeReasons.${reason.kind}`))
      .join(", ");
    notes.push({
      tone: "warn",
      text: t(`${N}surcharge`, {
        rate: fmt.percent(r.surcharge.rate),
        reasons,
      }),
    });
  }
  if (r.payable < 0)
    notes.push({
      tone: "good",
      text: t(`${N}refund`, { amount: fmt.taka(-r.payable) }),
    });
  if (r.ay === "2025-26") notes.push({ tone: "warn", text: t(`${N}legacy`) });
  const tip = planTip(r, ctx, today);
  if (tip) notes.push({ tone: "good", text: tip });
  return notes;
}

function planTip(r, { t, fmt }, today) {
  const { startYear } = ayInfo(r.ay);
  if (!today || today > `${startYear}-06-30` || r.grossTax <= 0) return "";
  const plan = planRebate({ ay: r.ay, totalIncome: r.income.totalTaxable });
  const gap = Math.min(plan.maxRebate, r.grossTax) - r.rebate.amount;
  if (gap <= 0) return "";
  return t("ui.it.result.notes.planTip", {
    invest: fmt.taka(Math.ceil((gap * 100) / plan.rate)),
    year: fmt.digits(startYear),
    saving: fmt.taka(gap),
  });
}

const MONEY_INPUTS = [
  "employmentIncome",
  "otherIncome",
  "dps",
  "savingsCertificates",
  "lifePremium",
  "lifeSumAssured",
  "otherInvestment",
  "netWealth",
  "taxPaid",
];

/** Label/value rows echoing what was entered (shown when printing). */
export function incomeInputRows(values, { t, fmt }) {
  const labelOf = (key) =>
    t.has(`ui.it.${key}.label`) ? t(`ui.it.${key}.label`) : t(`ui.it.${key}`);
  const rows = [
    [t("ui.common.ay"), fmt.digits(values.ay)],
    [t("ui.common.category"), t(`ui.common.categories.${values.category}`)],
  ];
  for (const key of MONEY_INPUTS)
    if (values[key] > 0) rows.push([labelOf(key), fmt.taka(values[key])]);
  if (values.dependants > 0)
    rows.push([labelOf("dependants"), fmt.digits(values.dependants)]);
  for (const key of ["multipleCars", "largeHouse", "firstTimeFiler"]) {
    if (values[key]) rows.push([labelOf(key), t("ui.common.words.yes")]);
  }
  return rows;
}

/** Full report for the income-tax calculator. Returns null when there is nothing to show. */
export function buildIncomeReport(r, values, ctx, today) {
  const { t, fmt } = ctx;
  if (r.income.gross <= 0) return null;
  const R = "ui.it.result.";
  const kpis = [
    { label: t(`${R}taxable`), value: fmt.taka(r.income.totalTaxable) },
    { label: t(`${R}marginal`), value: fmt.percent(r.marginalRate) },
    { label: t(`${R}rebate`), value: fmt.taka(r.rebate.amount) },
    r.taxPaid > 0
      ? {
          label: r.payable >= 0 ? t(`${R}payableLabel`) : t(`${R}refundLabel`),
          value: fmt.taka(Math.abs(r.payable)),
        }
      : { label: t(`${R}monthly`), value: fmt.taka(r.monthlyTax) },
  ];
  const rate = fmt.percent(r.effectiveRate * 100, { decimals: 1 });
  return {
    hero: {
      label: t(`${R}headline`, { ay: fmt.digits(r.ay) }),
      value: fmt.taka(r.totalTax),
      sub: `${t(`${R}effective`)}: ${rate} ${t(`${R}ofGross`)} · ${fmt.taka(r.monthlyTax)} ${t("ui.common.perMonth")}`,
      kpis,
    },
    sections: [
      {
        type: "steps",
        title: t("ui.common.report.steps"),
        items: taxSteps(r, values, ctx),
      },
      ...slabSections(r, ctx),
      { type: "notes", items: taxNotes(r, ctx, today) },
      { type: "inputs", rows: incomeInputRows(values, ctx) },
    ],
    bar: {
      label: t(`${R}headline`, { ay: fmt.digits(r.ay) }),
      value: fmt.taka(r.totalTax),
    },
    summary: {
      tool: "income",
      ay: r.ay,
      amount: r.totalTax,
      secondary: r.payable,
    },
  };
}
