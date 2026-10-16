import { SMALL_BUSINESS_TURNOVER_TAX } from "./rules.mjs";

/** Work in poisha (1/100 taka) and basis points so money maths never drifts. */
const toPoisha = (taka) => Math.round((Number(taka) || 0) * 100);
const bps = (percent) => Math.round((Number(percent) || 0) * 100);

/** Round-half-up of (a * b) / d for non-negative integers, exact via BigInt. */
function mulDiv(a, b, d) {
  const product = BigInt(a) * BigInt(b);
  const divisor = BigInt(d);
  return Number((product * 2n + divisor) / (divisor * 2n));
}

const result = (parts) => ({
  net: parts.netP / 100,
  sd: parts.sdP / 100,
  vatBase: (parts.netP + parts.sdP) / 100,
  vat: parts.vatP / 100,
  gross: (parts.netP + parts.sdP + parts.vatP) / 100,
  vatRate: parts.vatRate,
  sdRate: parts.sdRate,
});

/**
 * Price before VAT -> price with SD and VAT.
 * In Bangladesh VAT is charged on the price *plus* supplementary duty.
 */
export function vatAdd({ net, vatRate = 15, sdRate = 0 }) {
  const netP = Math.max(0, toPoisha(net));
  const sdP = mulDiv(netP, bps(sdRate), 10_000);
  const vatP = mulDiv(netP + sdP, bps(vatRate), 10_000);
  return result({ netP, sdP, vatP, vatRate, sdRate });
}

/** VAT-inclusive price -> price before SD and VAT (VAT is the balancing figure). */
export function vatRemove({ gross, vatRate = 15, sdRate = 0 }) {
  const grossP = Math.max(0, toPoisha(gross));
  const factor = (10_000 + bps(sdRate)) * (10_000 + bps(vatRate));
  const netP = mulDiv(grossP, 100_000_000, factor);
  const sdP = mulDiv(netP, bps(sdRate), 10_000);
  const vatP = grossP - netP - sdP;
  return result({ netP, sdP, vatP, vatRate, sdRate });
}

/** Multi-line invoice. Each line is priced before VAT. */
export function computeInvoice(lines = []) {
  const rows = lines.map((line) => {
    const qty = Math.max(0, Number(line.qty) || 0);
    const unit = Math.max(0, Number(line.unitPrice) || 0);
    const parts = vatAdd({
      net: Math.round(qty * unit * 100) / 100,
      vatRate: line.vatRate,
      sdRate: line.sdRate,
    });
    return { ...line, qty, unitPrice: unit, ...parts };
  });
  const sum = (key) =>
    Math.round(rows.reduce((total, row) => total + row[key] * 100, 0)) / 100;
  const byRate = new Map();
  for (const row of rows) {
    const entry = byRate.get(row.vatRate) ?? {
      rate: row.vatRate,
      base: 0,
      vat: 0,
    };
    entry.base = Math.round((entry.base + row.vatBase) * 100) / 100;
    entry.vat = Math.round((entry.vat + row.vat) * 100) / 100;
    byRate.set(row.vatRate, entry);
  }
  return {
    rows,
    totals: {
      net: sum("net"),
      sd: sum("sd"),
      vat: sum("vat"),
      gross: sum("gross"),
    },
    byRate: [...byRate.values()].sort((a, b) => b.rate - a.rate),
  };
}

/** Turnover tax for small enlisted businesses (4% of turnover, no input credit). */
export function turnoverTaxSmall({
  turnover,
  rate = SMALL_BUSINESS_TURNOVER_TAX.rate,
}) {
  const turnoverP = Math.max(0, toPoisha(turnover));
  const taxP = mulDiv(turnoverP, bps(rate), 10_000);
  return {
    turnover: turnoverP / 100,
    rate,
    tax: taxP / 100,
    afterTax: (turnoverP - taxP) / 100,
  };
}
