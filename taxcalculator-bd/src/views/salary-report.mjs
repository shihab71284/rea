import {
  incomeInputRows,
  slabSections,
  taxNotes,
  taxSteps,
} from "./income-report.mjs";

const MINUS = "\u2212";

/** Steps 1-6 and the total of the income-tax steps (no surcharge/credit rows for payroll). */
function salarySteps(r, values, ctx) {
  const all = taxSteps(r, values, ctx);
  const picked = [0, 1, 2, 3, 4, 5, 7].map((index) => all[index]);
  return picked.map((step, index) => ({
    ...step,
    no: ctx.fmt.digits(index + 1),
    kind: index === picked.length - 1 ? "final" : step.kind,
  }));
}

function monthlyTable(r, values, ctx) {
  const { t, fmt } = ctx;
  const M = "ui.sal.result.monthly.";
  const bonuses = (values.bonusCount || 0) * (values.bonusAmount || 0);
  const rows = [
    [t(`${M}gross`), fmt.taka(r.monthly.gross), fmt.taka(r.monthly.gross * 12)],
  ];
  if (bonuses > 0) rows.push([t(`${M}bonus`), "\u2014", fmt.taka(bonuses)]);
  rows.push(
    [
      t(`${M}tds`),
      `${MINUS}${fmt.taka(r.monthly.tds)}`,
      `${MINUS}${fmt.taka(r.totalTax)}`,
    ],
    [t(`${M}net`), fmt.taka(r.monthly.net), fmt.taka(r.annualNet)],
  );
  return {
    type: "table",
    title: t(`${M}title`),
    head: [t(`${M}item`), t(`${M}perMonth`), t(`${M}perYear`)],
    numeric: [1, 2],
    rows,
  };
}

function salaryInputRows(values, ctx) {
  const { t, fmt } = ctx;
  const [ay, category, ...rest] = incomeInputRows(
    { ...values, employmentIncome: 0, taxPaid: 0 },
    ctx,
  );
  const own = [];
  if (values.mode === "net")
    own.push([t("ui.sal.targetNet.label"), fmt.taka(values.targetNet)]);
  else
    own.push([t("ui.sal.monthlyGross.label"), fmt.taka(values.monthlyGross)]);
  if (values.bonusCount > 0) {
    own.push([t("ui.sal.bonusCount.label"), fmt.digits(values.bonusCount)]);
    own.push([t("ui.sal.bonusAmount.label"), fmt.taka(values.bonusAmount)]);
  }
  return [ay, category, ...own, ...rest];
}

export function buildSalaryReport(r, values, ctx, today) {
  const { t, fmt } = ctx;
  const R = "ui.sal.result.";
  if (r.employmentIncome <= 0) return null;
  const rate = fmt.percent(r.effectiveRate * 100, { decimals: 1 });
  const taxable = r.income.taxableEmployment + r.income.other;
  const kpi = (label, value) => ({ label, value });
  const net = r.mode === "net";
  const hero = net
    ? {
        label: t(`${R}headlineNet`),
        value: fmt.taka(r.monthly.gross),
        sub: t(`${R}subNet`, {
          net: fmt.taka(r.monthly.net),
          tds: fmt.taka(r.monthly.tds),
        }),
        kpis: [
          kpi(t(`${R}monthlyTds`), fmt.taka(r.monthly.tds)),
          kpi(t(`${R}annualTax`), fmt.taka(r.totalTax)),
          kpi(t(`${R}rate`), rate),
          kpi(t(`${R}taxableYear`), fmt.taka(taxable)),
        ],
      }
    : {
        label: t(`${R}headlineGross`),
        value: fmt.taka(r.monthly.tds),
        sub: t(`${R}subGross`, { tax: fmt.taka(r.totalTax), rate }),
        kpis: [
          kpi(t(`${R}takeHome`), fmt.taka(r.monthly.net)),
          kpi(t(`${R}gross`), fmt.taka(r.monthly.gross)),
          kpi(t(`${R}taxableYear`), fmt.taka(taxable)),
          kpi(t(`${R}annualTax`), fmt.taka(r.totalTax)),
        ],
      };
  const notes = [
    { tone: "info", text: t(`${R}notes.spread`) },
    ...taxNotes(r, ctx, today),
  ];
  return {
    hero,
    sections: [
      monthlyTable(r, values, ctx),
      {
        type: "steps",
        title: t("ui.common.report.steps"),
        items: salarySteps(r, values, ctx),
      },
      ...slabSections(r, ctx),
      { type: "notes", items: notes },
      { type: "inputs", rows: salaryInputRows(values, ctx) },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "salary",
      ay: r.ay,
      amount: r.monthly.tds,
      secondary: r.totalTax,
    },
  };
}
