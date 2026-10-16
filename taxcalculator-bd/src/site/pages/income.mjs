import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import {
  amountField,
  areaField,
  ayField,
  categoryField,
  group,
  section,
  stepperField,
  switchField,
} from "../fields.mjs";
import { CALCULATOR_AYS, DEFAULT_AY, SOURCES } from "../../core/rules.mjs";

export default function income(ctx) {
  const { t } = ctx;
  const amount = (name, extra = {}) =>
    amountField(ctx, {
      name,
      label: t(`ui.it.${name}.label`),
      hint: t(`ui.it.${name}.hint`),
      ...extra,
    });

  const form = html`
    ${section(
      t("ui.it.groups.profile"),
      html`${ayField(ctx, { ays: CALCULATOR_AYS, value: DEFAULT_AY })}${categoryField(ctx)}
      ${stepperField(ctx, {
        name: "dependants",
        label: t("ui.it.dependants.label"),
        hint: t("ui.it.dependants.hint"),
      })}
      ${areaField(ctx)}
      ${switchField(ctx, {
        name: "firstTimeFiler",
        label: t("ui.it.firstTimeFiler.label"),
        hint: t("ui.it.firstTimeFiler.hint"),
      })}`,
    )}
    ${section(
      t("ui.it.groups.income"),
      html`${amount("employmentIncome")}${amount("otherIncome", { optional: true })}`,
    )}
    ${group(ctx, { title: t("ui.it.groups.credits"), body: amount("taxPaid", { optional: true }) })}
    ${group(ctx, {
      title: t("ui.it.groups.invest"),
      body: html`${amount("dps")}${amount("savingsCertificates")}${amount("lifePremium")}${amount("lifeSumAssured")}${amount("otherInvestment")}`,
    })}
    ${group(ctx, {
      title: t("ui.it.groups.wealth"),
      body: html`${amount("netWealth")}
        ${switchField(ctx, { name: "multipleCars", label: t("ui.it.multipleCars") })}
        ${switchField(ctx, { name: "largeHouse", label: t("ui.it.largeHouse") })}
        <p class="hint">${t("ui.it.surchargeHint")}</p>`,
    })}
  `;

  return calculatorPage(ctx, {
    id: "income",
    form,
    entries: ["income-tax"],
    lead: t("page.income.lead"),
    emptyText: t("page.income.empty"),
    explain: t.get("page.income.explain"),
    faq: t.get("page.income.faq"),
    related: ["salary", "rebate", "filing"],
    sources: [
      SOURCES.pwcPersonal,
      SOURCES.pwcFinanceAct,
      SOURCES.pwcDeductions,
      SOURCES.nbrFinanceActs,
    ],
  });
}
