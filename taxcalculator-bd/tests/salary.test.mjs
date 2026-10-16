import { test } from "node:test";
import assert from "node:assert/strict";
import {
  annualEmployment,
  computeSalary,
  solveGrossFromNet,
} from "../src/core/salary.mjs";

const base = { ay: "2026-27", category: "general" };

test("monthly 1,00,000 salary: tax 45,000 a year, 3,750 a month", () => {
  const r = computeSalary({ ...base, monthlyGross: 100_000 });
  assert.equal(r.employmentIncome, 1_200_000);
  assert.equal(r.totalTax, 45_000);
  assert.equal(r.monthly.tds, 3_750);
  assert.equal(r.monthly.net, 96_250);
  assert.equal(r.monthly.exempt, 33_333);
});

test("festival bonuses are part of annual employment income", () => {
  assert.equal(
    annualEmployment({
      monthlyGross: 100_000,
      bonusCount: 2,
      bonusAmount: 50_000,
    }),
    1_300_000,
  );
  const r = computeSalary({
    ...base,
    monthlyGross: 100_000,
    bonusCount: 2,
    bonusAmount: 50_000,
  });
  // exempt 4,33,333 -> taxable 8,66,667 -> 30,000 + 25,000 = 55,000
  assert.equal(r.income.exempt, 433_333);
  assert.equal(r.totalTax, 55_000);
  assert.equal(r.monthly.tds, 4_583);
});

test("low salaries pay no tax", () => {
  const r = computeSalary({ ...base, monthlyGross: 30_000 });
  assert.equal(r.totalTax, 0);
  assert.equal(r.monthly.net, 30_000);
});

test("other annual income is added on top of salary", () => {
  const r = computeSalary({
    ...base,
    monthlyGross: 100_000,
    otherIncome: 100_000,
  });
  assert.equal(r.income.totalTaxable, 900_000);
});

test("investments reduce monthly TDS", () => {
  const without = computeSalary({ ...base, monthlyGross: 100_000 });
  const withRebate = computeSalary({
    ...base,
    monthlyGross: 100_000,
    otherInvestment: 240_000,
  });
  // 3% of 8,00,000 = 24,000 = 10% of 2,40,000
  assert.equal(without.totalTax - withRebate.totalTax, 24_000);
  assert.equal(withRebate.monthly.tds, 1_750);
});

test("net-to-gross returns the smallest gross that reaches the target", () => {
  assert.equal(solveGrossFromNet({ ...base, targetNet: 96_250 }), 100_000);
  assert.equal(solveGrossFromNet({ ...base, targetNet: 30_000 }), 30_000);
  assert.equal(solveGrossFromNet({ ...base, targetNet: 0 }), 0);
});

test("net-to-gross inverts the forward calculation across the range", () => {
  for (let gross = 20_000; gross <= 900_000; gross += 7_919) {
    const net = computeSalary({ ...base, monthlyGross: gross }).monthly.net;
    const solved = solveGrossFromNet({ ...base, targetNet: net });
    const solvedNet = computeSalary({ ...base, monthlyGross: solved }).monthly
      .net;
    assert.ok(solvedNet >= net, `reaches the target at gross ${gross}`);
    assert.ok(solved <= gross, `no larger than needed at gross ${gross}`);
    if (solved > net) {
      const below = computeSalary({ ...base, monthlyGross: solved - 1 }).monthly
        .net;
      assert.ok(below < net || solved - 1 < net, `minimal at gross ${gross}`);
    }
  }
});
