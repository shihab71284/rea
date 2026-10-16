import { test } from "node:test";
import assert from "node:assert/strict";
import { dictionaries } from "../src/i18n/dictionaries.mjs";
import { makeFormatters } from "../src/core/format.mjs";
import { computeIncomeTax } from "../src/core/income-tax.mjs";
import { planRebate } from "../src/core/rebate.mjs";
import { computeSalary } from "../src/core/salary.mjs";
import { vatAdd } from "../src/core/vat.mjs";
import { filingAdjustment } from "../src/core/filing.mjs";

/** Numbers quoted in guides and explainers must match what the engine produces. */
const copy = (lang, path) =>
  JSON.stringify(
    path.split(".").reduce((node, key) => node[key], dictionaries[lang]),
  );

for (const lang of ["en", "bn"]) {
  const fmt = makeFormatters(lang);
  const taka = (n) => fmt.taka(n);

  test(`[${lang}] income-tax guide example matches the engine`, () => {
    const r = computeIncomeTax({
      ay: "2026-27",
      employmentIncome: 1_500_000,
      otherIncome: 100_000,
      dps: 120_000,
      otherInvestment: 200_000,
      taxPaid: 50_000,
    });
    assert.deepEqual(
      [
        r.income.totalTaxable,
        r.grossTax,
        r.rebate.amount,
        r.afterRebate,
        r.payable,
      ],
      [1_100_000, 90_000, 32_000, 58_000, 8_000],
    );
    const text = copy(lang, "guides.items.calculateIncomeTax.blocks");
    for (const n of [
      1_100_000, 90_000, 32_000, 58_000, 8_000, 500_000, 33_000, 320_000,
    ]) {
      assert.ok(text.includes(taka(n)), `guide mentions ${taka(n)}`);
    }
  });

  test(`[${lang}] salary explainer and guide match the engine`, () => {
    const r = computeSalary({
      ay: "2026-27",
      category: "general",
      monthlyGross: 100_000,
    });
    assert.deepEqual(
      [r.totalTax, r.monthly.tds, r.monthly.net],
      [45_000, 3_750, 96_250],
    );
    const page = copy(lang, "page.salary.explain");
    for (const n of [1_200_000, 400_000, 800_000, 45_000, 3_750, 96_250])
      assert.ok(page.includes(taka(n)), `explainer mentions ${taka(n)}`);
    const guide = copy(lang, "guides.items.salaryTax.blocks");
    for (const n of [1_200_000, 400_000, 800_000, 45_000, 3_750])
      assert.ok(guide.includes(taka(n)), `guide mentions ${taka(n)}`);
  });

  test(`[${lang}] rebate sweet spot example matches the engine`, () => {
    const plan = planRebate({ ay: "2026-27", totalIncome: 1_200_000 });
    assert.deepEqual(
      [plan.maxRebate, plan.investmentNeeded],
      [36_000, 360_000],
    );
    for (const path of ["page.rebate.explain", "guides.items.rebate.blocks"]) {
      const text = copy(lang, path);
      assert.ok(
        text.includes(taka(36_000)) && text.includes(taka(360_000)),
        path,
      );
    }
  });

  test(`[${lang}] VAT examples match the engine`, () => {
    const r = vatAdd({ net: 1000, vatRate: 15, sdRate: 20 });
    assert.deepEqual([r.sd, r.vatBase, r.vat, r.gross], [200, 1200, 180, 1380]);
    for (const path of ["page.vat.explain", "guides.items.vat.blocks"]) {
      const text = copy(lang, path);
      for (const n of [1000, 200, 180, 1380])
        assert.ok(text.includes(taka(n)), `${path} mentions ${taka(n)}`);
    }
  });

  test(`[${lang}] filing example matches the engine`, () => {
    const at = (date) =>
      filingAdjustment({ ay: "2026-27", tax: 200_000, date });
    assert.deepEqual(
      [
        at("2026-08-15").payable,
        at("2027-02-10").payable,
        at("2027-05-05").payable,
      ],
      [190_000, 204_000, 210_000],
    );
    const text = copy(lang, "page.filing.explain");
    for (const n of [200_000, 10_000, 190_000, 4_000, 204_000])
      assert.ok(text.includes(taka(n)), `filing explainer mentions ${taka(n)}`);
  });

  test(`[${lang}] home page "four numbers" match the rules`, () => {
    const text = copy(lang, "home.changes.items");
    for (const value of [
      taka(400_000),
      fmt.percent(10),
      taka(5_000),
      fmt.percent(5),
    ])
      assert.ok(text.includes(value), value);
  });
}
