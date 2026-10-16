import { COMPANY_TYPES, TURNOVER_TAX } from "./rules.mjs";
import { roundTaka } from "./format.mjs";

const nonNegWhole = (n) => (Number.isFinite(n) && n > 0 ? roundTaka(n) : 0);

/** Rate that applies to a company type (reduced rate needs full bank-transfer compliance). */
export function companyRate(typeId, bankTransfers = false) {
  const type =
    COMPANY_TYPES.find((candidate) => candidate.id === typeId) ??
    COMPANY_TYPES[2];
  const reduced = bankTransfers && type.reducedRate !== undefined;
  return { type, rate: reduced ? type.reducedRate : type.rate, reduced };
}

/**
 * Corporate income tax: the greater of regular tax on taxable profit and
 * turnover tax on gross receipts (turnover tax applies even in a loss year).
 */
export function computeCorporateTax(input = {}) {
  const { type, rate, reduced } = companyRate(
    input.typeId,
    Boolean(input.bankTransfers),
  );
  const profit = nonNegWhole(input.taxableProfit);
  const receipts = nonNegWhole(input.grossReceipts);
  const turnover =
    TURNOVER_TAX.find((t) => t.id === input.turnoverId) ?? TURNOVER_TAX[0];
  const regularTax = roundTaka((profit * rate) / 100);
  const turnoverTax = roundTaka((receipts * turnover.rate) / 100);
  const turnoverApplies = receipts > 0 && turnoverTax > regularTax;
  const totalTax = Math.max(regularTax, turnoverTax);
  const taxPaid = nonNegWhole(input.taxPaid);
  return {
    type,
    rate,
    reduced,
    reducedAvailable: type.reducedRate !== undefined,
    turnover,
    profit,
    receipts,
    regularTax,
    turnoverTax,
    turnoverApplies,
    totalTax,
    taxPaid,
    payable: totalTax - taxPaid,
    profitAfterTax: profit - totalTax,
    effectiveRate: profit > 0 ? totalTax / profit : 0,
  };
}
