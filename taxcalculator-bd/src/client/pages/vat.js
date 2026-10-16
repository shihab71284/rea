import { parseAmount } from "../../core/format.mjs";
import { computeInvoice } from "../../core/vat.mjs";
import {
  buildInvoiceReport,
  buildVatReport,
  vatScenario,
} from "../../views/vat-report.mjs";
import { mountCalculator } from "../lib/calculator.js";
import { $, $$, icon } from "../lib/dom.js";
import { downloadText } from "../lib/chrome.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

function initMain() {
  mountCalculator({
    form: document.querySelector('form[data-calc="vat"]'),
    compute: vatScenario,
    view: (result, values) => buildVatReport(result, values, { t, fmt }),
  });
}

function initInvoice() {
  const root = $("[data-invoice]");
  if (!root) return;
  const form = $("form", root);
  const list = $("[data-lines]", root);
  const template = $("template[data-line-template]", root);
  const notify = () =>
    form.dispatchEvent(new Event("input", { bubbles: true }));

  const addLine = () => {
    list.append(template.content.cloneNode(true));
    return list.lastElementChild;
  };
  const readLines = () =>
    $$("[data-line]", list).map((row) => {
      const get = (name) => $(`[data-f="${name}"]`, row).value;
      const number = (name) => {
        const value = parseAmount(get(name));
        return Number.isFinite(value) ? value : 0;
      };
      return {
        description: get("description").trim(),
        qty: number("qty"),
        unitPrice: number("unitPrice"),
        vatRate: Number(get("vatRate")),
        sdRate: number("sdRate"),
      };
    });

  addLine();
  const csvButton = `<button class="btn btn-secondary btn-sm" type="button" data-action="csv">${icon("download")}<span>${t("ui.vat.invoice.csv")}</span></button>`;
  mountCalculator({
    root,
    form,
    urlSync: false,
    showSave: false,
    showCopy: false,
    extraActions: csvButton,
    compute: () => computeInvoice(readLines()),
    view: (invoice) => buildInvoiceReport(invoice, { t, fmt }),
    onAction: (action, current) => {
      if (action === "csv")
        downloadText(
          "invoice.csv",
          current.report.csv,
          "text/csv;charset=utf-8",
        );
    },
  });

  list.addEventListener("focusin", (event) => {
    const input = event.target;
    if (!input.matches('[data-f="qty"]')) return;
    input.addEventListener("mouseup", (up) => up.preventDefault(), {
      once: true,
    });
    input.select();
  });

  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-add-line]"))
      addLine().querySelector("input").focus();
    else if (event.target.closest("[data-remove-line]")) {
      event.target.closest("[data-line]").remove();
      if (!$("[data-line]", list)) addLine();
      notify();
    } else if (event.target.closest("[data-clear-lines]")) {
      list.replaceChildren();
      addLine();
      notify();
    }
  });
}

export function init() {
  initMain();
  initInvoice();
}
