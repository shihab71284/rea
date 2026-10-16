const MINUS = "\u2212";

function steps(r, values, { t, fmt }) {
  const S = "ui.corp.result.steps.";
  const N = "ui.corp.result.stepNotes.";
  const rows = [
    { label: t(`${S}profit`), value: fmt.taka(r.profit), kind: "sum" },
    {
      label: t(`${S}rate`),
      value: fmt.percent(r.rate),
      note: t(r.reduced ? `${N}reduced` : `${N}standard`),
      kind: "muted",
    },
    { label: t(`${S}regular`), value: fmt.taka(r.regularTax), kind: "plus" },
    {
      label: t(`${S}turnover`),
      value: fmt.taka(r.turnoverTax),
      note:
        r.receipts > 0
          ? t(`${N}turnover`, {
              rate: fmt.percent(r.turnover.rate),
              receipts: fmt.taka(r.receipts),
            })
          : t(`${N}none`),
      kind: "plus",
    },
    {
      label: t(`${S}total`),
      value: fmt.taka(r.totalTax),
      note: r.turnoverApplies ? t(`${N}higher`) : "",
      kind: "sum",
    },
    {
      label: t(`${S}paid`),
      value: r.taxPaid ? `${MINUS}${fmt.taka(r.taxPaid)}` : fmt.taka(0),
      kind: "minus",
    },
    {
      label: r.payable >= 0 ? t(`${S}payable`) : t(`${S}refund`),
      value: fmt.taka(Math.abs(r.payable)),
      kind: "final",
    },
  ];
  return rows.map((row, index) => ({ ...row, no: fmt.digits(index + 1) }));
}

function notes(r, values, { t, fmt }) {
  const N = "ui.corp.result.notes.";
  const out = [];
  if (r.reduced) out.push({ tone: "warn", text: t(`${N}reducedConditions`) });
  else if (r.reducedAvailable) {
    out.push({
      tone: "info",
      text: t(`${N}reducedAvailable`, {
        rate: fmt.percent(r.type.reducedRate),
      }),
    });
  }
  if (r.turnoverApplies)
    out.push({ tone: "warn", text: t(`${N}turnoverApplies`) });
  if (["bankListed", "bankUnlisted"].includes(r.type.id))
    out.push({ tone: "info", text: t(`${N}bank`) });
  if (r.type.id === "otherCompany")
    out.push({ tone: "info", text: t(`${N}opc`) });
  return out;
}

export function buildCorporateReport(r, values, ctx) {
  const { t, fmt } = ctx;
  const R = "ui.corp.result.";
  if (r.profit <= 0 && r.receipts <= 0) return null;
  const ay = values.ay ?? "2026-27";
  const rate = fmt.percent(r.effectiveRate * 100, { decimals: 1 });
  const hero = {
    label: t(`${R}headline`, { ay: fmt.digits(ay) }),
    value: fmt.taka(r.totalTax),
    sub: r.turnoverApplies
      ? t(`${R}subTurnover`, { tax: fmt.taka(r.turnoverTax) })
      : t(`${R}sub`, { rate: fmt.percent(r.rate), profit: fmt.taka(r.profit) }),
    kpis: [
      { label: t(`${R}regular`), value: fmt.taka(r.regularTax) },
      { label: t(`${R}turnover`), value: fmt.taka(r.turnoverTax) },
      { label: t(`${R}after`), value: fmt.taka(r.profitAfterTax) },
      r.taxPaid > 0
        ? {
            label:
              r.payable >= 0 ? t(`${R}payableLabel`) : t(`${R}refundLabel`),
            value: fmt.taka(Math.abs(r.payable)),
          }
        : { label: t(`${R}effective`), value: rate },
    ],
  };
  const inputs = [
    [t("ui.common.ay"), fmt.digits(ay)],
    [t("ui.corp.type.label"), t(`ui.corp.types.${r.type.id}`)],
    [t("ui.corp.taxableProfit.label"), fmt.taka(r.profit)],
  ];
  if (r.receipts > 0)
    inputs.push([t("ui.corp.grossReceipts.label"), fmt.taka(r.receipts)]);
  return {
    hero,
    sections: [
      {
        type: "steps",
        title: t("ui.common.report.steps"),
        items: steps(r, values, ctx),
      },
      { type: "notes", items: notes(r, values, ctx) },
      { type: "inputs", rows: inputs },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "corporate",
      ay,
      amount: r.totalTax,
      secondary: r.payable,
    },
  };
}
