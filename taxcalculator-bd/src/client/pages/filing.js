import {
  buildFilingReport,
  filingScenario,
} from "../../views/filing-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { localToday } from "../lib/dom.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  const form = document.querySelector('form[data-calc="filing"]');
  const dateInput = form.elements.date;
  const params = new URLSearchParams(location.search);
  if (!params.has("date")) dateInput.value = localToday();
  mountCalculator({
    form,
    compute: filingScenario,
    view: (result, values) => buildFilingReport(result, values, { t, fmt }),
  });
}
