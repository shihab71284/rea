import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import {
  amountField,
  areaField,
  ayField,
  categoryField,
  group,
  section,
  segmentedField,
  stepperField,
  switchField,
} from "../fields.mjs";
import { CALCULATOR_AYS, DEFAULT_AY, SOURCES } from "../../core/rules.mjs";

export default function salary(ctx) {
  const { t } = ctx;
  const own = (name, extra = {}) =>
    amountField(ctx, {
      name,
      label: t(`ui.sal.${name}.label`),
      hint: t(`ui.sal.${name}.hint`),
      ...extra,
    });
  const shared = (name, extra = {}) =>
    amountField(ctx, {
      name,
      label: t(`ui.it.${name}.label`),
      hint: t(`ui.it.${name}.hint`),
      ...extra,
    });

  const form = html`
    ${section(
      t("ui.sal.groups.profile"),
      html`${ayField(ctx, { ays: CALCULATOR_AYS, value: DEFAULT_AY })}${categoryField(ctx)}`,
    )}
    ${section(
      t("ui.sal.groups.pay"),
      html`${segmentedField(ctx, {
          name: "mode",
          legend: t("ui.sal.mode.label"),
          value: "gross",
          options: [
            { value: "gross", label: t("ui.sal.mode.gross") },
            { value: "net", label: t("ui.sal.mode.net") },
          ],
        })}
        ${own("monthlyGross", { attributes: { "data-show-when": "mode=gross" } })}
        ${own("targetNet", { attributes: { "data-show-when": "mode=net", hidden: true } })}
        <div class="field-row">
          ${stepperField(ctx, {
            name: "bonusCount",
            label: t("ui.sal.bonusCount.label"),
            hint: t("ui.sal.bonusCount.hint"),
            max: 6,
          })}
          ${own("bonusAmount", { optional: true })}
        </div>
        ${own("otherIncome", { optional: true })}`,
    )}
    ${group(ctx, {
      title: t("ui.it.groups.invest"),
      body: html`${shared("dps")}${shared("savingsCertificates")}${shared("lifePremium")}${shared("lifeSumAssured")}${shared("otherInvestment")}`,
    })}
    ${group(ctx, {
      title: t("ui.sal.groups.more"),
      body: html`${stepperField(ctx, {
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
    })}
  `;

  return calculatorPage(ctx, {
    id: "salary",
    form,
    entries: ["salary"],
    lead: t("page.salary.lead"),
    emptyText: t("page.salary.empty"),
    explain: t.get("page.salary.explain"),
    faq: t.get("page.salary.faq"),
    related: ["income", "rebate", "payroll"],
    sources: [
      SOURCES.pwcDeductions,
      SOURCES.pwcPersonal,
      SOURCES.pwcFinanceAct,
    ],
  });
}
