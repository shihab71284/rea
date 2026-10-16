import { turnoverTaxSmall, vatAdd, vatRemove } from "../core/vat.mjs";

/** Engine run for the single-price VAT calculator (add, remove or turnover tax). */
export function vatScenario(values) {
  const vatRate =
    values.vatPreset === "custom"
      ? values.vatCustom
      : Number(values.vatPreset ?? 15);
  const sdRate = values.sdRate || 0;
  if (values.mode === "turnover")
    return {
      mode: "turnover",
      ...turnoverTaxSmall({ turnover: values.turnover }),
    };
  if (values.mode === "remove")
    return {
      mode: "remove",
      ...vatRemove({ gross: values.grossPrice, vatRate, sdRate }),
    };
  return { mode: "add", ...vatAdd({ net: values.price, vatRate, sdRate }) };
}

const money = (fmt, value) => fmt.taka(value, { decimals: 2 });

function turnoverReport(r, { t, fmt }) {
  const R = "ui.vat.result.";
  if (r.turnover <= 0) return null;
  const hero = {
    label: t(`${R}headlineTurnover`),
    value: money(fmt, r.tax),
    sub: t(`${R}subTurnover`, {
      rate: fmt.percent(r.rate),
      turnover: money(fmt, r.turnover),
    }),
    kpis: [
      { label: t(`${R}turnover`), value: money(fmt, r.turnover) },
      { label: t(`${R}rate`), value: fmt.percent(r.rate) },
      { label: t(`${R}afterTax`), value: money(fmt, r.afterTax) },
    ],
  };
  return {
    hero,
    sections: [
      {
        type: "notes",
        items: [{ tone: "info", text: t(`${R}notes.turnover`) }],
      },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: { tool: "vat", ay: "", amount: r.tax, secondary: r.turnover },
  };
}

function priceReport(r, values, { t, fmt }) {
  const R = "ui.vat.result.";
  const add = r.mode === "add";
  if ((add ? r.net : r.gross) <= 0) return null;
  const share = r.gross > 0 ? ((r.sd + r.vat) / r.gross) * 100 : 0;
  const hero = {
    label: t(add ? `${R}headlineAdd` : `${R}headlineRemove`),
    value: money(fmt, add ? r.gross : r.net),
    sub: add
      ? t(`${R}subAdd`, {
          net: money(fmt, r.net),
          sd: money(fmt, r.sd),
          vat: money(fmt, r.vat),
        })
      : t(`${R}subRemove`, { gross: money(fmt, r.gross) }),
    kpis: [
      { label: t(`${R}net`), value: money(fmt, r.net) },
      { label: t(`${R}sd`), value: money(fmt, r.sd) },
      { label: t(`${R}vat`), value: money(fmt, r.vat) },
      { label: t(`${R}taxShare`), value: fmt.percent(share, { decimals: 1 }) },
    ],
  };
  const B = `${R}breakdown.`;
  const table = {
    type: "table",
    head: [t(`${B}item`), t(`${B}amount`)],
    numeric: [1],
    rows: [
      [t(`${B}net`), money(fmt, r.net)],
      [t(`${B}sd`, { rate: fmt.percent(r.sdRate) }), money(fmt, r.sd)],
      [t(`${B}vatBase`), money(fmt, r.vatBase)],
      [t(`${B}vat`, { rate: fmt.percent(r.vatRate) }), money(fmt, r.vat)],
    ],
    foot: [t(`${B}gross`), money(fmt, r.gross)],
  };
  const part = (key, value, className) => ({
    label: t(`${R}bar.${key}`),
    display: money(fmt, value),
    percent: r.gross > 0 ? (value / r.gross) * 100 : 0,
    className,
  });
  const segments = [
    part("net", r.net, "c0"),
    part("sd", r.sd, "c4"),
    part("vat", r.vat, "c2"),
  ].filter((s) => s.percent > 0);
  const notes = [];
  if (r.sdRate > 0) notes.push({ tone: "info", text: t(`${R}notes.formula`) });
  if (r.vatRate === 0) notes.push({ tone: "info", text: t(`${R}notes.zero`) });
  notes.push({ tone: "info", text: t(`${R}notes.invoice`) });
  return {
    hero,
    sections: [
      {
        type: "group",
        title: t(`${B}title`),
        children: [{ type: "bar", segments }, table],
      },
      { type: "notes", items: notes },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "vat",
      ay: "",
      amount: add ? r.gross : r.net,
      secondary: r.vat,
    },
  };
}

export function buildVatReport(r, values, ctx) {
  return r.mode === "turnover"
    ? turnoverReport(r, ctx)
    : priceReport(r, values, ctx);
}

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

/** CSV text of an invoice (header + one row per item + totals). */
export function invoiceCsv(invoice) {
  const rows = [
    ["Item", "Qty", "Unit price", "VAT %", "SD %", "Net", "SD", "VAT", "Total"],
  ];
  for (const row of invoice.rows) {
    rows.push([
      row.description,
      row.qty,
      row.unitPrice,
      row.vatRate,
      row.sdRate ?? 0,
      row.net,
      row.sd,
      row.vat,
      row.gross,
    ]);
  }
  const { totals } = invoice;
  rows.push([
    "Total",
    "",
    "",
    "",
    "",
    totals.net,
    totals.sd,
    totals.vat,
    totals.gross,
  ]);
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function buildInvoiceReport(invoice, { t, fmt }) {
  const R = "ui.vat.invoice.result.";
  if (!invoice.rows.some((row) => row.net > 0)) return null;
  const { totals } = invoice;
  const qty = (value) =>
    fmt.n(value, { decimals: Number.isInteger(value) ? 0 : 2 });
  const hero = {
    label: t(`${R}headline`),
    value: money(fmt, totals.gross),
    sub: t(`${R}sub`, {
      vat: money(fmt, totals.vat),
      sd: money(fmt, totals.sd),
    }),
    kpis: [
      { label: t(`${R}net`), value: money(fmt, totals.net) },
      { label: t(`${R}sd`), value: money(fmt, totals.sd) },
      { label: t(`${R}vat`), value: money(fmt, totals.vat) },
    ],
  };
  const L = `${R}lines.`;
  const lines = {
    type: "table",
    title: t(`${L}title`),
    head: [
      t(`${L}item`),
      t(`${L}qty`),
      t(`${L}unit`),
      t(`${L}vat`),
      t(`${L}total`),
    ],
    numeric: [1, 2, 3, 4],
    rows: invoice.rows
      .filter((row) => row.net > 0)
      .map((row) => [
        row.description || "\u2014",
        qty(row.qty),
        money(fmt, row.unitPrice),
        fmt.percent(row.vatRate),
        money(fmt, row.gross),
      ]),
    foot: [t(`${L}sum`), "", "", "", money(fmt, totals.gross)],
  };
  const B = `${R}byRate.`;
  const byRate = {
    type: "table",
    title: t(`${B}title`),
    head: [t(`${B}rate`), t(`${B}base`), t(`${B}vat`)],
    numeric: [1, 2],
    rows: invoice.byRate.map((entry) => [
      fmt.percent(entry.rate),
      money(fmt, entry.base),
      money(fmt, entry.vat),
    ]),
  };
  return {
    hero,
    sections: [
      lines,
      byRate,
      { type: "notes", items: [{ tone: "warn", text: t(`${R}notOfficial`) }] },
    ],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "invoice",
      ay: "",
      amount: totals.gross,
      secondary: totals.vat,
    },
    csv: invoiceCsv(invoice),
  };
}
