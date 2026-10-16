import { computeCorporateTax } from "../../core/corporate.mjs";
import { buildCorporateReport } from "../../views/corporate-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  mountCalculator({
    form: document.querySelector('form[data-calc="corporate"]'),
    compute: computeCorporateTax,
    view: (result, values) => buildCorporateReport(result, values, { t, fmt }),
  });
}
