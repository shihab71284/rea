import {
  buildRebateReport,
  rebateScenario,
} from "../../views/rebate-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  mountCalculator({
    form: document.querySelector('form[data-calc="rebate"]'),
    compute: rebateScenario,
    view: (scenario, values, today) =>
      buildRebateReport(scenario, values, { t, fmt }, today),
  });
}
