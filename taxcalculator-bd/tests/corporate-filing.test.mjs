import { test } from "node:test";
import assert from "node:assert/strict";
import { companyRate, computeCorporateTax } from "../src/core/corporate.mjs";
import { filingAdjustment, filingWindows } from "../src/core/filing.mjs";

test("company rates: standard and bank-transfer reduced", () => {
  assert.equal(companyRate("otherCompany").rate, 27.5);
  assert.equal(companyRate("otherCompany", true).rate, 25);
  assert.equal(companyRate("publicIpo10", true).rate, 20);
  assert.equal(companyRate("publicIpoLess").rate, 25);
  assert.equal(companyRate("publicIpoLess", true).rate, 22.5);
  assert.equal(
    companyRate("bankListed", true).rate,
    37.5,
    "no reduced rate for banks",
  );
  assert.equal(companyRate("bankUnlisted").rate, 40);
  assert.equal(companyRate("tobacco").rate, 45);
  assert.equal(companyRate("cooperative").rate, 20);
  assert.equal(companyRate("privateEdu").rate, 5);
  assert.equal(
    companyRate("unknown").rate,
    27.5,
    "falls back to other companies",
  );
});

test("regular tax on 1 crore profit", () => {
  assert.equal(
    computeCorporateTax({ typeId: "otherCompany", taxableProfit: 10_000_000 })
      .totalTax,
    2_750_000,
  );
  assert.equal(
    computeCorporateTax({
      typeId: "otherCompany",
      taxableProfit: 10_000_000,
      bankTransfers: true,
    }).totalTax,
    2_500_000,
  );
});

test("turnover tax applies when higher than regular tax, even in a loss year", () => {
  const profitable = computeCorporateTax({
    typeId: "otherCompany",
    taxableProfit: 10_000_000,
    grossReceipts: 500_000_000,
  });
  assert.equal(profitable.regularTax, 2_750_000);
  assert.equal(profitable.turnoverTax, 5_000_000);
  assert.equal(profitable.turnoverApplies, true);
  assert.equal(profitable.totalTax, 5_000_000);
  const loss = computeCorporateTax({
    typeId: "otherCompany",
    taxableProfit: 0,
    grossReceipts: 100_000_000,
  });
  assert.equal(loss.totalTax, 1_000_000);
  const lowTurnover = computeCorporateTax({
    typeId: "otherCompany",
    taxableProfit: 10_000_000,
    grossReceipts: 20_000_000,
  });
  assert.equal(lowTurnover.turnoverApplies, false);
  assert.equal(lowTurnover.totalTax, 2_750_000);
});

test("turnover tax categories", () => {
  const tobacco = computeCorporateTax({
    typeId: "tobacco",
    grossReceipts: 100_000_000,
    turnoverId: "tobacco",
  });
  assert.equal(tobacco.turnoverTax, 3_000_000);
  assert.equal(
    computeCorporateTax({
      typeId: "mno",
      grossReceipts: 100_000_000,
      turnoverId: "telecom",
    }).turnoverTax,
    1_500_000,
  );
  assert.equal(
    computeCorporateTax({
      typeId: "otherCompany",
      grossReceipts: 100_000_000,
      turnoverId: "newIndustry",
    }).turnoverTax,
    200_000,
  );
});

test("tax paid reduces the balance", () => {
  const r = computeCorporateTax({
    typeId: "otherCompany",
    taxableProfit: 10_000_000,
    taxPaid: 3_000_000,
  });
  assert.equal(r.payable, -250_000);
  assert.equal(r.profitAfterTax, 7_250_000);
});

test("filing windows for AY 2026-27 follow the income year ending 30 June 2026", () => {
  const w = filingWindows("2026-27");
  assert.deepEqual(
    w.map((x) => [x.id, x.from, x.to]),
    [
      ["rebate", "2026-07-01", "2026-09-30"],
      ["neutral", "2026-10-01", "2026-12-31"],
      ["additional2", "2027-01-01", "2027-03-31"],
      ["additional5", "2027-04-01", "2027-06-30"],
    ],
  );
});

test("early filing earns 5% capped at BDT 25,000", () => {
  const small = filingAdjustment({
    ay: "2026-27",
    tax: 400_000,
    date: "2026-08-15",
  });
  assert.equal(small.kind, "rebate");
  assert.equal(small.amount, 20_000);
  assert.equal(small.payable, 380_000);
  const big = filingAdjustment({
    ay: "2026-27",
    tax: 1_000_000,
    date: "2026-09-30",
  });
  assert.equal(big.amount, 25_000);
});

test("October to December is neutral", () => {
  const r = filingAdjustment({
    ay: "2026-27",
    tax: 100_000,
    date: "2026-10-16",
  });
  assert.equal(r.kind, "neutral");
  assert.equal(r.payable, 100_000);
  assert.equal(r.daysLeftInWindow, 76);
  assert.equal(r.nextWindow.id, "additional2");
  assert.equal(r.nextCost, 3_000);
  assert.equal(
    filingAdjustment({ ay: "2026-27", tax: 500_000, date: "2026-12-31" })
      .nextCost,
    10_000,
  );
});

test("late filing: 2% (min 3,000) then 5% (min 5,000)", () => {
  const q1 = filingAdjustment({
    ay: "2026-27",
    tax: 100_000,
    date: "2027-02-10",
  });
  assert.equal(q1.kind, "additional");
  assert.equal(q1.amount, 3_000);
  assert.equal(
    filingAdjustment({ ay: "2026-27", tax: 500_000, date: "2027-01-01" })
      .amount,
    10_000,
  );
  const q2 = filingAdjustment({
    ay: "2026-27",
    tax: 50_000,
    date: "2027-05-05",
  });
  assert.equal(q2.amount, 5_000);
  assert.equal(
    filingAdjustment({ ay: "2026-27", tax: 400_000, date: "2027-06-30" })
      .amount,
    20_000,
  );
  assert.equal(q2.payable, 55_000);
});

test("after the tax year it is a delayed return (10% or 15% under notice)", () => {
  const delayed = filingAdjustment({
    ay: "2026-27",
    tax: 200_000,
    date: "2027-07-01",
  });
  assert.equal(delayed.kind, "delayed");
  assert.equal(delayed.amount, 20_000);
  assert.equal(
    filingAdjustment({ ay: "2026-27", tax: 20_000, date: "2027-07-01" }).amount,
    5_000,
  );
  const notice = filingAdjustment({
    ay: "2026-27",
    tax: 200_000,
    date: "2027-07-01",
    underNotice: true,
  });
  assert.equal(notice.amount, 30_000);
  assert.equal(
    filingAdjustment({
      ay: "2026-27",
      tax: 20_000,
      date: "2027-07-01",
      underNotice: true,
    }).amount,
    10_000,
  );
});

test("before the filing year opens and first-time filers", () => {
  assert.equal(
    filingAdjustment({ ay: "2026-27", tax: 100_000, date: "2026-06-15" }).kind,
    "notOpen",
  );
  const first = filingAdjustment({
    ay: "2026-27",
    tax: 100_000,
    date: "2027-03-01",
    firstTime: true,
  });
  assert.equal(first.kind, "firstTime");
  assert.equal(first.amount, 0);
  assert.equal(first.dueDate, "2027-06-30");
  assert.equal(
    filingAdjustment({
      ay: "2026-27",
      tax: 100_000,
      date: "2027-08-01",
      firstTime: true,
    }).kind,
    "delayed",
  );
});
