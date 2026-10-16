import { salaryScenario } from "../../core/salary.mjs";
import { buildSalaryReport } from "../../views/salary-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  mountCalculator({
    id: "salary",
    form: document.querySelector('form[data-calc="salary"]'),
    compute: salaryScenario,
    view: (result, values, today) =>
      buildSalaryReport(result, values, { t, fmt }, today),
  });
}
