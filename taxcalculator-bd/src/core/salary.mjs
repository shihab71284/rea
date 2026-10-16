import { computeIncomeTax } from "./income-tax.mjs";
import { roundTaka } from "./format.mjs";

const nonNeg = (n) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Annual employment income from monthly pay, festival bonuses and other pay. */
export function annualEmployment(input = {}) {
  const yearly = nonNeg(input.monthlyGross) * 12;
  const bonuses = nonNeg(input.bonusCount) * nonNeg(input.bonusAmount);
  return roundTaka(yearly + bonuses + nonNeg(input.otherEmployment));
}

/**
 * Salary tax: runs the income-tax engine on the annual pay and spreads the
 * result over 12 months, which is how employers deduct TDS.
 */
export function computeSalary(input = {}) {
  const employmentIncome = annualEmployment(input);
  const tax = computeIncomeTax({ ...input, employmentIncome });
  const monthlyGross = roundTaka(nonNeg(input.monthlyGross));
  const monthlyTds = tax.monthlyTax;
  return {
    ...tax,
    employmentIncome,
    monthly: {
      gross: monthlyGross,
      tds: monthlyTds,
      net: monthlyGross - monthlyTds,
      exempt: roundTaka(tax.income.exempt / 12),
    },
    annualNet: employmentIncome + tax.income.other - tax.totalTax,
  };
}

/**
 * Net-to-gross: the smallest monthly gross salary whose take-home
 * (gross minus monthly TDS) reaches `targetNet`.
 */
export function solveGrossFromNet({ targetNet, ...rest }) {
  const target = roundTaka(nonNeg(targetNet));
  const netFor = (gross) =>
    computeSalary({ ...rest, monthlyGross: gross }).monthly.net;
  if (computeSalary({ ...rest, monthlyGross: target }).totalTax === 0)
    return target;
  let low = target;
  let high = Math.max(target * 3, target + 100_000);
  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    if (netFor(mid) >= target) high = mid;
    else low = mid;
  }
  return high;
}

/**
 * Single entry point for the salary calculator.
 * mode "gross": tax from a monthly gross salary.
 * mode "net":   find the gross salary that leaves `targetNet` after monthly TDS.
 */
export function salaryScenario(values = {}) {
  const mode = values.mode === "net" ? "net" : "gross";
  const monthlyGross =
    mode === "net"
      ? solveGrossFromNet({ ...values, targetNet: values.targetNet })
      : values.monthlyGross;
  return {
    mode,
    targetNet: roundTaka(nonNeg(values.targetNet)),
    ...computeSalary({ ...values, monthlyGross }),
  };
}
