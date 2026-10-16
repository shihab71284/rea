import { html, raw } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import { amountField, segmentedField, selectField } from "../fields.mjs";
import { SOURCES, VAT_PRESETS } from "../../core/rules.mjs";

const SD_AND_RATE = "mode=add,remove";

function mainForm(ctx) {
  const { t } = ctx;
  const percent = (name, extra = {}) =>
    amountField(ctx, {
      name,
      prefix: "",
      suffix: "%",
      showWords: false,
      ...extra,
      label: extra.label ?? t(`ui.vat.${name}.label`),
    });
  const presetOptions = [...VAT_PRESETS.map(String), "custom"].map((value) => ({
    value,
    label: t(
      `ui.vat.vatRate.presets.${value === "custom" ? value : `r${value.replace(".", "_")}`}`,
    ),
  }));
  const money = (name, mode, hidden) =>
    amountField(ctx, {
      name,
      label: t(`ui.vat.${name}.label`),
      hint: t(`ui.vat.${name}.hint`),
      attributes: { "data-show-when": `mode=${mode}`, hidden },
    });
  return html`${segmentedField(ctx, {
    name: "mode",
    legend: t("ui.vat.mode.label"),
    value: "add",
    options: ["add", "remove", "turnover"].map((value) => ({
      value,
      label: t(`ui.vat.mode.${value}`),
    })),
  })}
  ${money("price", "add", false)}${money("grossPrice", "remove", true)}${money("turnover", "turnover", true)}
  ${selectField(ctx, {
    name: "vatPreset",
    label: t("ui.vat.vatRate.label"),
    value: "15",
    options: presetOptions,
    attributes: { "data-show-when": SD_AND_RATE },
  })}
  ${percent("vatCustom", {
    label: t("ui.vat.vatRate.custom"),
    attributes: {
      "data-show-when": `${SD_AND_RATE};vatPreset=custom`,
      hidden: true,
    },
  })}
  ${percent("sdRate", { hint: t("ui.vat.sdRate.hint"), attributes: { "data-show-when": SD_AND_RATE } })}`;
}

function lineTemplate(ctx) {
  const { t } = ctx;
  const rates = VAT_PRESETS.map(
    (rate) =>
      `<option value="${rate}"${rate === 15 ? " selected" : ""}>${ctx.fmt.percent(rate)}</option>`,
  ).join("");
  const label = (text, control) =>
    `<label class="line-field"><span>${text}</span>${control}</label>`;
  const row = `<div class="line" data-line>
    <label class="line-name"><span class="visually-hidden">${t("ui.vat.invoice.item")}</span><input class="control" data-f="description" type="text" autocomplete="off" placeholder="${t("ui.vat.invoice.itemPlaceholder")}"></label>
    ${label(t("ui.vat.invoice.qty"), `<input class="control" data-f="qty" data-type="amount" inputmode="decimal" autocomplete="off" value="${ctx.fmt.digits(1)}">`)}
    ${label(t("ui.vat.invoice.unitPrice"), `<input class="control" data-f="unitPrice" data-type="amount" inputmode="decimal" autocomplete="off" placeholder="${t("ui.common.placeholder")}">`)}
    ${label(t("ui.vat.invoice.vat"), `<select class="control" data-f="vatRate">${rates}</select>`)}
    ${label(t("ui.vat.invoice.sd"), `<input class="control" data-f="sdRate" data-type="amount" inputmode="decimal" autocomplete="off" placeholder="${t("ui.common.placeholder")}">`)}
    <button class="icon-btn" type="button" data-remove-line aria-label="${t("ui.vat.invoice.remove")}">${ctx.icon("x").value}</button>
  </div>`;
  return raw(`<template data-line-template>${row}</template>`);
}

function invoiceWorkspace(ctx) {
  const { t } = ctx;
  return html`<section
    class="workspace workspace--invoice"
    id="invoice"
    data-invoice
    aria-labelledby="invoice-title"
  >
    <div class="container">
      <div class="section-head">
        <h2 id="invoice-title">${t("ui.vat.invoice.heading")}</h2>
        <p>${t("ui.vat.invoice.lead")}</p>
      </div>
      <div class="workspace-grid">
        <form class="panel form-panel" novalidate autocomplete="off">
          <div class="panel-body">
            <div class="lines" data-lines></div>
            ${lineTemplate(ctx)}
            <div class="cluster">
              <button
                class="btn btn-secondary btn-sm"
                type="button"
                data-add-line
              >
                ${ctx.icon("plus")}${t("ui.vat.invoice.add")}
              </button>
              <button
                class="btn btn-ghost btn-sm"
                type="button"
                data-clear-lines
              >
                ${ctx.icon("trash")}${t("ui.vat.invoice.clear")}
              </button>
            </div>
          </div>
        </form>
        <div class="results-col" data-results-col>
          <div data-result tabindex="-1">
            <div class="panel result-empty">
              <p>${t("ui.vat.invoice.result.empty")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

export default function vat(ctx) {
  const { t } = ctx;
  return calculatorPage(ctx, {
    id: "vat",
    form: mainForm(ctx),
    entries: ["vat"],
    lead: t("page.vat.lead"),
    emptyText: t("page.vat.empty"),
    explain: t.get("page.vat.explain"),
    faq: t.get("page.vat.faq"),
    related: ["corporate", "income", "calendar"],
    sources: [SOURCES.pwcFinanceAct, SOURCES.nbrFinanceActs],
    extraWorkspaces: invoiceWorkspace(ctx),
  });
}
