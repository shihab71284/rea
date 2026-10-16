import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import {
  amountField,
  ayField,
  categoryField,
  group,
  section,
} from "../fields.mjs";
import { CALCULATOR_AYS, SOURCES } from "../../core/rules.mjs";

export default function rebate(ctx) {
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
      t("ui.reb.groups.profile"),
      html`${ayField(ctx, { ays: CALCULATOR_AYS, value: "2027-28" })}${categoryField(ctx)}`,
    )}
    ${section(
      t("ui.reb.groups.income"),
      html`${amount("employmentIncome")}${amount("otherIncome", { optional: true })}`,
    )}
    ${group(ctx, {
      title: t("ui.reb.groups.invest"),
      open: true,
      body: html`<p class="hint">${t("ui.reb.investHint")}</p>
        ${amount("dps", { optional: true })}${amount("savingsCertificates", { optional: true })}${amount("lifePremium", { optional: true })}${amount("lifeSumAssured", { optional: true })}${amount("otherInvestment", { optional: true })}`,
    })}
  `;
  return calculatorPage(ctx, {
    id: "rebate",
    form,
    entries: ["rebate"],
    lead: t("page.rebate.lead"),
    emptyText: t("page.rebate.empty"),
    explain: t.get("page.rebate.explain"),
    faq: t.get("page.rebate.faq"),
    related: ["income", "salary", "filing"],
    sources: [
      SOURCES.pwcDeductions,
      SOURCES.pwcFinanceAct,
      SOURCES.pwcPersonal,
    ],
  });
}
