import { parseAmount } from "../core/format.mjs";
import { computeSalary } from "../core/salary.mjs";

const MAX_ROWS = 2000;
const AMOUNT_AT_END =
  /([\d\u09E6-\u09EF][\d\u09E6-\u09EF,]*(?:\.\d+)?)\s*(?:tk\.?|bdt|taka|\u09F3)?\s*$/i;

/** One employee per line: "Name, 85,000" / "Name<TAB>85000" / "Name 85000". */
export function parsePayroll(text) {
  const rows = [];
  let skipped = 0;
  for (const line of String(text ?? "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = AMOUNT_AT_END.exec(line);
    const gross = match ? parseAmount(match[1]) : 0;
    if (!(gross > 0) || rows.length >= MAX_ROWS) {
      skipped += 1;
      continue;
    }
    const name = line
      .slice(0, match.index)
      .replace(/[\s,;:\t-]+$/, "")
      .replace(/^["']|["']$/g, "")
      .trim();
    rows.push({ name, gross });
  }
  return { rows, skipped };
}

export function payrollScenario(values) {
  const { rows, skipped } = parsePayroll(values.rows);
  const people = rows.map((row, index) => {
    const r = computeSalary({
      ay: values.ay,
      category: values.category,
      monthlyGross: row.gross,
    });
    return {
      name: row.name || `#${index + 1}`,
      gross: row.gross,
      annualTax: r.totalTax,
      tds: r.monthly.tds,
      net: r.monthly.net,
    };
  });
  const sum = (key) => people.reduce((total, person) => total + person[key], 0);
  return {
    people,
    skipped,
    totals: {
      gross: sum("gross"),
      annualTax: sum("annualTax"),
      tds: sum("tds"),
      net: sum("net"),
    },
  };
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

export function payrollCsv(scenario) {
  const rows = [
    ["Employee", "Monthly gross", "Annual tax", "Monthly TDS", "Take-home"],
  ];
  for (const p of scenario.people)
    rows.push([p.name, p.gross, p.annualTax, p.tds, p.net]);
  const { totals } = scenario;
  rows.push(["Total", totals.gross, totals.annualTax, totals.tds, totals.net]);
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function buildPayrollReport(s, values, { t, fmt }) {
  const R = "ui.pay.result.";
  if (!s.people.length) return null;
  const count = fmt.digits(s.people.length);
  const hero = {
    label: t(`${R}headline`),
    value: fmt.taka(s.totals.tds),
    sub: t(`${R}sub`, { count, gross: fmt.taka(s.totals.gross) }),
    kpis: [
      { label: t(`${R}count`), value: count },
      { label: t(`${R}gross`), value: fmt.taka(s.totals.gross) },
      { label: t(`${R}net`), value: fmt.taka(s.totals.net) },
      { label: t(`${R}annual`), value: fmt.taka(s.totals.annualTax) },
    ],
  };
  const T = `${R}table.`;
  const table = {
    type: "table",
    title: t(`${T}title`),
    head: [
      t(`${T}name`),
      t(`${T}gross`),
      t(`${T}annual`),
      t(`${T}tds`),
      t(`${T}net`),
    ],
    numeric: [1, 2, 3, 4],
    rows: s.people.map((p) => [
      p.name,
      fmt.taka(p.gross),
      fmt.taka(p.annualTax),
      fmt.taka(p.tds),
      fmt.taka(p.net),
    ]),
    foot: [
      t(`${T}total`),
      fmt.taka(s.totals.gross),
      fmt.taka(s.totals.annualTax),
      fmt.taka(s.totals.tds),
      fmt.taka(s.totals.net),
    ],
  };
  const notes = [{ tone: "info", text: t(`${R}notes.assumptions`) }];
  if (s.skipped)
    notes.push({
      tone: "warn",
      text: t(`${R}notes.skipped`, { count: fmt.digits(s.skipped) }),
    });
  return {
    hero,
    sections: [table, { type: "notes", items: notes }],
    bar: { label: hero.label, value: hero.value },
    summary: {
      tool: "payroll",
      ay: values.ay,
      amount: s.totals.tds,
      secondary: s.totals.annualTax,
    },
    csv: payrollCsv(s),
  };
}
