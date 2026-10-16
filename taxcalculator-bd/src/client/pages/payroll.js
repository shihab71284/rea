import {
  buildPayrollReport,
  payrollScenario,
} from "../../views/payroll-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { downloadText } from "../lib/chrome.js";
import { icon } from "../lib/dom.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

export function init() {
  const form = document.querySelector('form[data-calc="payroll"]');
  const csvButton = `<button class="btn btn-secondary btn-sm" type="button" data-action="csv">${icon("download")}<span>${t("ui.pay.csv")}</span></button>`;
  mountCalculator({
    form,
    urlSync: false,
    showSave: false,
    showCopy: false,
    extraActions: csvButton,
    compute: payrollScenario,
    view: (result, values) => buildPayrollReport(result, values, { t, fmt }),
    onAction: (action, current) => {
      if (action === "csv")
        downloadText(
          "payroll-tds.csv",
          current.report.csv,
          "text/csv;charset=utf-8",
        );
    },
  });
  const notify = () =>
    form.dispatchEvent(new Event("input", { bubbles: true }));
  form
    .querySelector("[data-load-sample]")
    .addEventListener("click", (event) => {
      form.elements.rows.value = event.currentTarget.dataset.sample;
      notify();
    });
  form.querySelector("[data-clear-rows]").addEventListener("click", () => {
    form.elements.rows.value = "";
    notify();
  });
}
