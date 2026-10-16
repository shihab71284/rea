import { test } from "node:test";
import assert from "node:assert/strict";
import { dictionaries } from "../src/i18n/dictionaries.mjs";
import { createTranslator } from "../src/i18n/index.mjs";
import { makeFormatters } from "../src/core/format.mjs";
import { computeIncomeTax } from "../src/core/income-tax.mjs";
import { computeInvoice } from "../src/core/vat.mjs";
import { computeCorporateTax } from "../src/core/corporate.mjs";
import { salaryScenario } from "../src/core/salary.mjs";
import { buildIncomeReport } from "../src/views/income-report.mjs";
import { buildSalaryReport } from "../src/views/salary-report.mjs";
import {
  buildRebateReport,
  rebateScenario,
} from "../src/views/rebate-report.mjs";
import {
  buildInvoiceReport,
  buildVatReport,
  invoiceCsv,
  vatScenario,
} from "../src/views/vat-report.mjs";
import { buildCorporateReport } from "../src/views/corporate-report.mjs";
import {
  buildFilingReport,
  filingScenario,
} from "../src/views/filing-report.mjs";
import {
  buildPayrollReport,
  parsePayroll,
  payrollCsv,
  payrollScenario,
} from "../src/views/payroll-report.mjs";

const TODAY = "2026-10-16";
const ctxFor = (lang) => ({
  t: createTranslator(dictionaries[lang], lang, { strict: true }),
  fmt: makeFormatters(lang),
});

const SKIP_KEYS = new Set([
  "className",
  "state",
  "tone",
  "kind",
  "type",
  "csv",
  "summary",
  "numeric",
  "percent",
  "value_",
]);

function strings(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((child) => strings(child, out));
  else if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node))
      if (!SKIP_KEYS.has(key)) strings(child, out);
  }
  return out;
}

const income = (extra) => ({ ay: "2026-27", category: "general", ...extra });

const SCENARIOS = [
  [
    "income default",
    (c) =>
      buildIncomeReport(
        computeIncomeTax(income({ otherIncome: 1_200_000 })),
        income({ otherIncome: 1_200_000 }),
        c,
        TODAY,
      ),
  ],
  [
    "income full",
    (c) => {
      const v = income({
        employmentIncome: 3_000_000,
        otherIncome: 100_000,
        dps: 150_000,
        savingsCertificates: 600_000,
        lifePremium: 80_000,
        lifeSumAssured: 400_000,
        otherInvestment: 500_000,
        netWealth: 120_000_000,
        multipleCars: true,
        taxPaid: 900_000,
        dependants: 1,
      });
      return buildIncomeReport(computeIncomeTax(v), v, c, TODAY);
    },
  ],
  [
    "income refund + legacy AY",
    (c) => {
      const v = income({
        ay: "2025-26",
        area: "outside",
        otherIncome: 1_000_000,
        taxPaid: 200_000,
        firstTimeFiler: true,
      });
      return buildIncomeReport(computeIncomeTax(v), v, c, TODAY);
    },
  ],
  [
    "income below threshold",
    (c) =>
      buildIncomeReport(
        computeIncomeTax(income({ otherIncome: 300_000 })),
        income({ otherIncome: 300_000 }),
        c,
        TODAY,
      ),
  ],
  [
    "income minimum tax",
    (c) =>
      buildIncomeReport(
        computeIncomeTax(income({ otherIncome: 420_000 })),
        income({ otherIncome: 420_000 }),
        c,
        TODAY,
      ),
  ],
  [
    "salary gross",
    (c) => {
      const v = income({
        mode: "gross",
        monthlyGross: 100_000,
        bonusCount: 2,
        bonusAmount: 50_000,
        otherInvestment: 100_000,
      });
      return buildSalaryReport(salaryScenario(v), v, c, TODAY);
    },
  ],
  [
    "salary net",
    (c) => {
      const v = income({ mode: "net", targetNet: 96_250 });
      return buildSalaryReport(salaryScenario(v), v, c, TODAY);
    },
  ],
  [
    "rebate planner (open year)",
    (c) => {
      const v = income({
        ay: "2027-28",
        employmentIncome: 1_500_000,
        dps: 60_000,
      });
      return buildRebateReport(rebateScenario(v), v, c, TODAY);
    },
  ],
  [
    "rebate planner (closed year, maxed)",
    (c) => {
      const v = income({
        employmentIncome: 1_500_000,
        otherInvestment: 5_000_000,
      });
      return buildRebateReport(rebateScenario(v), v, c, TODAY);
    },
  ],
  [
    "rebate planner (no tax)",
    (c) => {
      const v = income({ ay: "2027-28", otherIncome: 300_000 });
      return buildRebateReport(rebateScenario(v), v, c, TODAY);
    },
  ],
  [
    "vat add",
    (c) =>
      buildVatReport(
        vatScenario({ mode: "add", price: 1000, vatPreset: "15", sdRate: 20 }),
        {},
        c,
      ),
  ],
  [
    "vat remove zero",
    (c) =>
      buildVatReport(
        vatScenario({ mode: "remove", grossPrice: 1150, vatPreset: "0" }),
        {},
        c,
      ),
  ],
  [
    "vat custom",
    (c) =>
      buildVatReport(
        vatScenario({
          mode: "add",
          price: 500,
          vatPreset: "custom",
          vatCustom: 2.4,
        }),
        {},
        c,
      ),
  ],
  [
    "vat turnover",
    (c) =>
      buildVatReport(
        vatScenario({ mode: "turnover", turnover: 1_000_000 }),
        {},
        c,
      ),
  ],
  [
    "invoice",
    (c) =>
      buildInvoiceReport(
        computeInvoice([
          {
            description: "Laptop",
            qty: 1,
            unitPrice: 85000,
            vatRate: 15,
            sdRate: 0,
          },
          {
            description: "Mouse",
            qty: 2.5,
            unitPrice: 1200,
            vatRate: 5,
            sdRate: 10,
          },
        ]),
        c,
      ),
  ],
  [
    "corporate regular",
    (c) =>
      buildCorporateReport(
        computeCorporateTax({
          typeId: "otherCompany",
          taxableProfit: 10_000_000,
          bankTransfers: true,
          taxPaid: 1_000_000,
        }),
        { ay: "2026-27" },
        c,
      ),
  ],
  [
    "corporate turnover",
    (c) =>
      buildCorporateReport(
        computeCorporateTax({
          typeId: "otherCompany",
          taxableProfit: 1_000_000,
          grossReceipts: 500_000_000,
        }),
        { ay: "2027-28" },
        c,
      ),
  ],
  [
    "corporate bank",
    (c) =>
      buildCorporateReport(
        computeCorporateTax({
          typeId: "bankListed",
          taxableProfit: 50_000_000,
        }),
        { ay: "2026-27" },
        c,
      ),
  ],
  ...[
    "2026-08-15",
    "2026-10-16",
    "2027-02-10",
    "2027-05-05",
    "2027-07-05",
    "2026-06-15",
  ].map((date) => [
    `filing ${date}`,
    (c) =>
      buildFilingReport(
        filingScenario({ ay: "2026-27", tax: 200_000, date }),
        { ay: "2026-27", date },
        c,
      ),
  ]),
  [
    "filing first-time",
    (c) =>
      buildFilingReport(
        filingScenario({
          ay: "2026-27",
          tax: 0,
          date: "2027-03-01",
          firstTime: true,
        }),
        { ay: "2026-27", date: "2027-03-01" },
        c,
      ),
  ],
  [
    "filing under notice",
    (c) =>
      buildFilingReport(
        filingScenario({
          ay: "2026-27",
          tax: 0,
          date: "2027-08-01",
          underNotice: true,
        }),
        { ay: "2026-27", date: "2027-08-01" },
        c,
      ),
  ],
  [
    "payroll",
    (c) => {
      const v = {
        ay: "2026-27",
        category: "general",
        rows: "Rahim Uddin, 85,000\nKarim\t120000\nbroken line\nSalma Akter 65000",
      };
      return buildPayrollReport(payrollScenario(v), v, c);
    },
  ],
];

for (const lang of ["en", "bn"]) {
  for (const [name, build] of SCENARIOS) {
    test(`report [${lang}] ${name}`, () => {
      const report = build(ctxFor(lang), lang);
      assert.ok(report, "expected a report");
      assert.ok(
        report.hero.label && report.hero.value,
        "hero has label and value",
      );
      assert.ok(
        report.bar.label && report.bar.value,
        "mobile bar has label and value",
      );
      assert.ok(report.summary?.tool, "summary names the tool");
      for (const text of strings(report)) {
        assert.ok(
          !/undefined|\bNaN\b|\[object|\{[a-z]+\}/.test(text),
          `bad text: ${text}`,
        );
        if (lang === "bn" && !/[A-Za-z]/.test(text))
          assert.ok(!/\d/.test(text), `ASCII digits in Bangla text: ${text}`);
      }
    });
  }
}

test("headline numbers are formatted per language", () => {
  const v = income({ employmentIncome: 1_200_000 });
  const en = buildIncomeReport(computeIncomeTax(v), v, ctxFor("en"), TODAY);
  const bn = buildIncomeReport(computeIncomeTax(v), v, ctxFor("bn"), TODAY);
  assert.equal(en.hero.value, "৳45,000");
  assert.equal(bn.hero.value, "৳৪৫,০০০");
  const steps = en.sections.find((section) => section.type === "steps").items;
  assert.equal(steps.length, 10);
  assert.equal(steps.at(-1).value, "৳45,000");
  assert.equal(steps.at(-1).kind, "final");
});

test("empty inputs produce no report (empty state)", () => {
  const c = ctxFor("en");
  assert.equal(
    buildIncomeReport(computeIncomeTax(income()), income(), c, TODAY),
    null,
  );
  assert.equal(
    buildVatReport(
      vatScenario({ mode: "add", price: 0, vatPreset: "15" }),
      {},
      c,
    ),
    null,
  );
  assert.equal(
    buildInvoiceReport(
      computeInvoice([{ description: "", qty: 1, unitPrice: 0, vatRate: 15 }]),
      c,
    ),
    null,
  );
  assert.equal(
    buildCorporateReport(
      computeCorporateTax({ typeId: "otherCompany" }),
      {},
      c,
    ),
    null,
  );
  assert.equal(
    buildFilingReport(
      filingScenario({ ay: "2026-27", tax: 1, date: "" }),
      {},
      c,
    ),
    null,
  );
  assert.equal(buildPayrollReport(payrollScenario({ rows: "" }), {}, c), null);
});

test("the planning tip only appears while the income year is still open", () => {
  const v = income({ ay: "2027-28", employmentIncome: 1_500_000 });
  const open = buildIncomeReport(computeIncomeTax(v), v, ctxFor("en"), TODAY);
  const tipOpen = open.sections
    .find((s) => s.type === "notes")
    .items.some((n) => /Tip:/.test(n.text));
  const late = buildIncomeReport(
    computeIncomeTax(v),
    v,
    ctxFor("en"),
    "2027-07-01",
  );
  const tipLate = late.sections
    .find((s) => s.type === "notes")
    .items.some((n) => /Tip:/.test(n.text));
  assert.equal(tipOpen, true);
  assert.equal(tipLate, false);
});

test("payroll parser copes with commas in amounts, tabs, quotes and junk lines", () => {
  const { rows, skipped } = parsePayroll(
    '"Uddin, Rahim", 1,20,000\nKarim\t95000\nSalma Akter 65000 Tk\n৳ only\n\nNusrat, ১,১০,০০০',
  );
  assert.deepEqual(
    rows.map((r) => [r.name, r.gross]),
    [
      ["Uddin, Rahim", 120000],
      ["Karim", 95000],
      ["Salma Akter", 65000],
      ["Nusrat", 110000],
    ],
  );
  assert.equal(skipped, 1);
});

test("CSV exports are escaped and complete", () => {
  const invoice = computeInvoice([
    {
      description: 'Cable, "USB"',
      qty: 2,
      unitPrice: 100,
      vatRate: 15,
      sdRate: 0,
    },
  ]);
  const csv = invoiceCsv(invoice);
  assert.ok(csv.startsWith('"Item","Qty"'));
  assert.ok(csv.includes('"Cable, ""USB"""'));
  assert.ok(csv.trimEnd().endsWith('"230"'));
  const payroll = payrollCsv(
    payrollScenario({ ay: "2026-27", category: "general", rows: "A, 100000" }),
  );
  assert.equal(payroll.trim().split("\r\n").length, 3);
});
