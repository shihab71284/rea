import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeInvoice,
  turnoverTaxSmall,
  vatAdd,
  vatRemove,
} from "../src/core/vat.mjs";

test("adding 15% VAT", () => {
  assert.deepEqual(vatAdd({ net: 1000, vatRate: 15 }), {
    net: 1000,
    sd: 0,
    vatBase: 1000,
    vat: 150,
    gross: 1150,
    vatRate: 15,
    sdRate: 0,
  });
});

test("VAT is charged on the price plus supplementary duty", () => {
  const r = vatAdd({ net: 1000, vatRate: 15, sdRate: 20 });
  assert.equal(r.sd, 200);
  assert.equal(r.vatBase, 1200);
  assert.equal(r.vat, 180);
  assert.equal(r.gross, 1380);
});

test("reduced rates", () => {
  assert.equal(vatAdd({ net: 1000, vatRate: 7.5 }).vat, 75);
  assert.equal(vatAdd({ net: 1000, vatRate: 5 }).vat, 50);
  assert.equal(vatAdd({ net: 1000, vatRate: 0 }).gross, 1000);
});

test("removing VAT from an inclusive price", () => {
  const r = vatRemove({ gross: 1150, vatRate: 15 });
  assert.equal(r.net, 1000);
  assert.equal(r.vat, 150);
  const withSd = vatRemove({ gross: 1380, vatRate: 15, sdRate: 20 });
  assert.equal(withSd.net, 1000);
  assert.equal(withSd.sd, 200);
  assert.equal(withSd.vat, 180);
});

test("paisa rounding is half-up and components always sum to the total", () => {
  assert.equal(vatAdd({ net: 99.99, vatRate: 15 }).vat, 15);
  for (const gross of [1, 9.99, 100, 333.33, 1234.56, 99999.99]) {
    for (const [vatRate, sdRate] of [
      [15, 0],
      [15, 20],
      [7.5, 0],
      [10, 35],
      [5, 100],
    ]) {
      const r = vatRemove({ gross, vatRate, sdRate });
      assert.equal(
        Math.round((r.net + r.sd + r.vat) * 100),
        Math.round(gross * 100),
      );
    }
  }
});

test("add then remove returns the original price (within a paisa)", () => {
  for (let net = 1; net < 50_000; net += 977.17) {
    for (const [vatRate, sdRate] of [
      [15, 0],
      [15, 25],
      [10, 0],
      [7.5, 45],
    ]) {
      const added = vatAdd({ net, vatRate, sdRate });
      const back = vatRemove({ gross: added.gross, vatRate, sdRate });
      assert.ok(
        Math.abs(back.net - Math.round(net * 100) / 100) <= 0.011,
        `net ${net} @${vatRate}/${sdRate}`,
      );
    }
  }
});

test("invoice totals and VAT grouped by rate", () => {
  const invoice = computeInvoice([
    { description: "Item A", qty: 2, unitPrice: 500, vatRate: 15, sdRate: 0 },
    { description: "Item B", qty: 1, unitPrice: 1000, vatRate: 5, sdRate: 0 },
    { description: "Item C", qty: 3, unitPrice: 100, vatRate: 15, sdRate: 0 },
  ]);
  assert.equal(invoice.totals.net, 2300);
  assert.equal(invoice.totals.vat, 150 + 50 + 45);
  assert.equal(invoice.totals.gross, 2545);
  assert.deepEqual(
    invoice.byRate.map((r) => [r.rate, r.base, r.vat]),
    [
      [15, 1300, 195],
      [5, 1000, 50],
    ],
  );
});

test("small-business turnover tax is 4% of turnover", () => {
  const r = turnoverTaxSmall({ turnover: 1_000_000 });
  assert.equal(r.tax, 40_000);
  assert.equal(r.afterTax, 960_000);
});

test("negative or missing inputs are treated as zero", () => {
  assert.equal(vatAdd({ net: -50 }).gross, 0);
  assert.equal(vatRemove({ gross: undefined }).net, 0);
  assert.deepEqual(computeInvoice().totals, {
    net: 0,
    sd: 0,
    vat: 0,
    gross: 0,
  });
});
