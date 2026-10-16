import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import { ayField, categoryField, section } from "../fields.mjs";
import { CALCULATOR_AYS, DEFAULT_AY, SOURCES } from "../../core/rules.mjs";

export default function payroll(ctx) {
  const { t } = ctx;
  const form = html`
    ${section(
      t("ui.pay.title"),
      html`${ayField(ctx, { ays: CALCULATOR_AYS, value: DEFAULT_AY, help: false })}${categoryField(ctx)}
        <div class="field" data-field="rows">
          <label for="f-rows">${t("ui.pay.rows.label")}</label>
          <textarea
            class="control"
            id="f-rows"
            name="rows"
            rows="9"
            spellcheck="false"
            autocomplete="off"
            placeholder="${t("ui.pay.rows.placeholder")}"
            aria-describedby="f-rows-hint"
          ></textarea>
          <p class="hint" id="f-rows-hint">${t("ui.pay.rows.hint")}</p>
          <div class="cluster">
            <button
              class="btn btn-secondary btn-sm"
              type="button"
              data-load-sample
              data-sample="${t("ui.pay.example")}"
            >
              ${t("ui.pay.sample")}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" data-clear-rows>
              ${t("ui.pay.clear")}
            </button>
          </div>
        </div>`,
    )}
  `;
  return calculatorPage(ctx, {
    id: "payroll",
    form,
    entries: ["payroll"],
    lead: t("page.payroll.lead"),
    emptyText: t("page.payroll.empty"),
    explain: t.get("page.payroll.explain"),
    faq: t.get("page.payroll.faq"),
    related: ["salary", "calendar", "income"],
    sources: [SOURCES.pwcDeductions, SOURCES.pwcFinanceAct],
  });
}
