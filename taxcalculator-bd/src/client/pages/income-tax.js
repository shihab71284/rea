import { computeIncomeTax } from "../../core/income-tax.mjs";
import { buildIncomeReport } from "../../views/income-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  const form = document.querySelector('form[data-calc="income"]');
  mountCalculator({
    id: "income",
    form,
    compute: computeIncomeTax,
    view: (result, values, today) =>
      buildIncomeReport(result, values, { t, fmt }, today),
  });
}
