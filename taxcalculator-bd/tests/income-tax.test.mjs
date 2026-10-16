import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeIncomeTax,
  employmentExemption,
  minimumTaxFor,
  slabTax,
  surchargeFor,
  thresholdFor,
} from "../src/core/income-tax.mjs";
import { CRORE } from "../src/core/rules.mjs";

const tax = (taxable, extra = {}) =>
  computeIncomeTax({ ay: "2026-27", otherIncome: taxable, ...extra });

test("AY 2026-27 slabs: cumulative tax at slab boundaries (general taxpayer)", () => {
  // 4,00,000 tax-free, then 10% x 3L, 15% x 4L, 20% x 5L, 25% x 20L, 30% above.
  assert.equal(slabTax(400_000, 400_000, "2026-27").total, 0);
  assert.equal(slabTax(700_000, 400_000, "2026-27").total, 30_000);
  assert.equal(slabTax(1_100_000, 400_000, "2026-27").total, 90_000);
  assert.equal(slabTax(1_600_000, 400_000, "2026-27").total, 190_000);
  assert.equal(slabTax(3_600_000, 400_000, "2026-27").total, 690_000);
  assert.equal(slabTax(4_000_000, 400_000, "2026-27").total, 810_000);
});

test("published worked examples", () => {
  // Roy Law Nexus guide: taxable 12,00,000 -> gross tax 1,10,000.
  assert.equal(tax(1_200_000).grossTax, 110_000);
  // Taxable 8,64,000 -> 54,600 (monthly TDS 4,550).
  const r = tax(864_000);
  assert.equal(r.totalTax, 54_600);
  assert.equal(r.monthlyTax, 4_550);
});

test("salary exemption is the lower of one-third or BDT 5 lakh", () => {
  assert.equal(employmentExemption(1_200_000), 400_000);
  assert.equal(employmentExemption(600_000), 200_000);
  assert.equal(employmentExemption(1_500_000), 500_000);
  assert.equal(employmentExemption(3_000_000), 500_000);
  assert.equal(employmentExemption(0), 0);
  assert.equal(employmentExemption(-5), 0);
});

test("salary income of 12,00,000: taxable 8,00,000, tax 45,000", () => {
  const r = computeIncomeTax({ ay: "2026-27", employmentIncome: 1_200_000 });
  assert.equal(r.income.exempt, 400_000);
  assert.equal(r.income.totalTaxable, 800_000);
  assert.equal(r.totalTax, 45_000);
  assert.equal(r.monthlyTax, 3_750);
});

test("salary of 6,00,000 falls inside the tax-free threshold", () => {
  const r = computeIncomeTax({ ay: "2026-27", employmentIncome: 600_000 });
  assert.equal(r.income.totalTaxable, 400_000);
  assert.equal(r.totalTax, 0);
  assert.equal(r.exceedsThreshold, false);
});

test("salary of 30,00,000: exemption capped at 5 lakh, tax 4,15,000", () => {
  const r = computeIncomeTax({ ay: "2026-27", employmentIncome: 3_000_000 });
  assert.equal(r.income.exempt, 500_000);
  assert.equal(r.income.totalTaxable, 2_500_000);
  assert.equal(r.totalTax, 415_000);
  assert.equal(r.marginalRate, 25);
});

test("thresholds by taxpayer category", () => {
  assert.equal(thresholdFor("2026-27", "general").total, 400_000);
  assert.equal(thresholdFor("2026-27", "womanSenior").total, 450_000);
  assert.equal(thresholdFor("2026-27", "disabled").total, 525_000);
  assert.equal(thresholdFor("2026-27", "thirdGender").total, 525_000);
  assert.equal(thresholdFor("2026-27", "freedomFighter").total, 550_000);
  assert.equal(thresholdFor("2026-27", "disabled", 1).total, 575_000);
  assert.equal(thresholdFor("2027-28", "general").total, 400_000);
  assert.equal(thresholdFor("2025-26", "general").total, 350_000);
  assert.equal(thresholdFor("2026-27", "general", 2).extra, 100_000);
  assert.equal(thresholdFor("2026-27", "general", -3).extra, 0);
});

test("a woman taxpayer gets BDT 4.5 lakh tax-free", () => {
  assert.equal(tax(750_000, { category: "womanSenior" }).totalTax, 30_000);
  assert.equal(tax(450_000, { category: "womanSenior" }).totalTax, 0);
});

test("parent of a disabled person gets +50,000 per dependant", () => {
  const r = tax(875_000, { category: "general", dependants: 1 });
  assert.equal(r.threshold.total, 450_000);
  // 4,25,000 above the threshold: 3L@10% + 1.25L@15% = 30,000 + 18,750
  assert.equal(r.totalTax, 48_750);
});

test("minimum tax: BDT 5,000 flat once income crosses the threshold", () => {
  const justOver = tax(420_000);
  assert.equal(justOver.grossTax, 2_000);
  assert.equal(justOver.totalTax, 5_000);
  assert.equal(justOver.minimumApplied, true);
  assert.equal(tax(400_000).totalTax, 0);
  assert.equal(tax(400_000).minimumApplied, false);
  // New taxpayers: minimum tax is BDT 1,000 (slab tax here is only BDT 500).
  assert.equal(tax(405_000).totalTax, 5_000);
  assert.equal(tax(405_000, { firstTimeFiler: true }).totalTax, 1_000);
  assert.equal(
    tax(420_000, { firstTimeFiler: true }).totalTax,
    2_000,
    "slab tax above the minimum",
  );
});

test("minimum tax follows area only for AY 2025-26", () => {
  const base = { ay: "2025-26", otherIncome: 360_000 };
  assert.equal(computeIncomeTax({ ...base, area: "dhakaCtg" }).totalTax, 5_000);
  assert.equal(
    computeIncomeTax({ ...base, area: "otherCity" }).totalTax,
    4_000,
  );
  assert.equal(computeIncomeTax({ ...base, area: "outside" }).totalTax, 3_000);
  assert.equal(minimumTaxFor({ ay: "2026-27", area: "outside" }), 5_000);
  assert.equal(minimumTaxFor({ ay: "2027-28", area: "otherCity" }), 5_000);
});

test("AY 2025-26 keeps the old 5% slab and 3.5 lakh threshold", () => {
  const r = computeIncomeTax({ ay: "2025-26", otherIncome: 1_000_000 });
  // 1L@5% + 4L@10% + 1.5L@15% = 5,000 + 40,000 + 22,500
  assert.equal(r.grossTax, 67_500);
  assert.equal(r.rebate.rate, 15);
});

test("investment rebate is the lowest of 3% of income, 10% of investment and 7.5 lakh", () => {
  const r = tax(1_200_000, { dps: 120_000, otherInvestment: 180_000 });
  assert.equal(r.rebate.eligible.total, 300_000);
  assert.equal(r.rebate.byInvestment, 30_000);
  assert.equal(r.rebate.byIncome, 36_000);
  assert.equal(r.rebate.amount, 30_000);
  assert.equal(r.rebate.binding, "investment");
  assert.equal(r.totalTax, 80_000);

  const income = tax(1_000_000, { otherInvestment: 1_000_000 });
  assert.equal(income.rebate.amount, 30_000, "capped by 3% of income");
  assert.equal(income.rebate.binding, "income");

  const big = tax(250 * 100_000, { otherInvestment: 7_500_000 });
  assert.equal(big.rebate.amount, 750_000, "tie at the BDT 7.5 lakh cap");
  const capped = tax(500 * 100_000, { otherInvestment: 90_000_000 });
  assert.equal(capped.rebate.amount, 750_000);
  assert.equal(capped.rebate.binding, "cap");
});

test("rebate limits per instrument are applied before the 10%", () => {
  const r = tax(2_000_000, {
    dps: 300_000, // limit 1,20,000
    savingsCertificates: 900_000, // limit 5,00,000
    lifePremium: 100_000,
    lifeSumAssured: 500_000, // premium limited to 10% of sum = 50,000
  });
  const allowed = Object.fromEntries(
    r.rebate.eligible.parts.map((p) => [p.key, p.allowed]),
  );
  assert.deepEqual(allowed, {
    dps: 120_000,
    savingsCertificates: 500_000,
    life: 50_000,
    other: 0,
  });
  assert.equal(r.rebate.eligible.total, 670_000);
  assert.equal(r.rebate.amount, 60_000, "3% of 20 lakh is the binding limit");
});

test("rebate never exceeds the tax and minimum tax still applies", () => {
  const r = tax(450_000, { otherInvestment: 1_000_000 });
  assert.equal(r.grossTax, 5_000);
  assert.equal(r.rebate.amount, 5_000);
  assert.equal(r.afterRebate, 0);
  assert.equal(r.totalTax, 5_000, "minimum tax overrides the rebate");
  assert.equal(r.minimumApplied, true);
});

test("net-wealth and lifestyle surcharge", () => {
  assert.equal(surchargeFor({ netWealth: 4 * CRORE }).rate, 0);
  assert.equal(surchargeFor({ netWealth: 4 * CRORE + 1 }).rate, 10);
  assert.equal(surchargeFor({ netWealth: 10 * CRORE + 1 }).rate, 20);
  assert.equal(surchargeFor({ netWealth: 30 * CRORE }).rate, 30);
  assert.equal(surchargeFor({ netWealth: 60 * CRORE }).rate, 35);
  assert.equal(surchargeFor({ multipleCars: true }).rate, 10);
  assert.equal(surchargeFor({ largeHouse: true }).rate, 10);
  assert.equal(
    surchargeFor({ netWealth: 15 * CRORE, multipleCars: true }).rate,
    20,
  );
  const r = tax(1_200_000, { netWealth: 5 * CRORE });
  assert.equal(r.surcharge.amount, 11_000);
  assert.equal(r.totalTax, 121_000);
});

test("tax already paid produces a payable or refundable balance", () => {
  assert.equal(tax(1_200_000, { taxPaid: 100_000 }).payable, 10_000);
  assert.equal(tax(1_200_000, { taxPaid: 120_000 }).payable, -10_000);
});

test("income below the threshold pays nothing and ignores wealth surcharge", () => {
  const r = tax(300_000, { netWealth: 60 * CRORE });
  assert.equal(r.totalTax, 0);
  assert.equal(r.surcharge.amount, 0);
});

test("inputs are sanitised: negatives, NaN, decimals", () => {
  assert.equal(
    computeIncomeTax({ ay: "2026-27", otherIncome: -50_000 }).totalTax,
    0,
  );
  assert.equal(
    computeIncomeTax({ ay: "2026-27", otherIncome: Number.NaN }).totalTax,
    0,
  );
  assert.equal(
    computeIncomeTax({ ay: "nope", otherIncome: 1_200_000 }).ay,
    "2026-27",
  );
  assert.equal(
    computeIncomeTax({ ay: "2026-27", otherIncome: 1_200_000.4 }).income
      .totalTaxable,
    1_200_000,
  );
});

test("tax never decreases as income grows, and rows add up", () => {
  let previous = -1;
  for (let income = 0; income <= 60_000_000; income += 37_500) {
    const r = tax(income);
    assert.ok(r.totalTax >= previous, `monotonic at ${income}`);
    previous = r.totalTax;
    const rowTotal = r.slab.rows.reduce((sum, row) => sum + row.tax, 0);
    assert.equal(rowTotal, r.grossTax, `rows add up at ${income}`);
    const covered = r.slab.rows.reduce((sum, row) => sum + row.amount, 0);
    assert.equal(covered, income, `slabs cover the full income at ${income}`);
  }
});

test("future assessment years: 35% band starts at BDT 3 crore", () => {
  const at = (income, ay) =>
    slabTax(income, thresholdFor(ay, "general").total, ay);
  const below = at(30_000_000, "2028-29").total;
  const above = at(31_000_000, "2028-29").total;
  assert.equal(above - below, 350_000, "extra 10 lakh taxed at 35%");
  const late = at(31_000_000, "2030-31");
  assert.equal(late.marginalRate, 35);
});
