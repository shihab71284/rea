import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import {
  amountField,
  ayField,
  section,
  selectField,
  switchField,
} from "../fields.mjs";
import { COMPANY_TYPES, SOURCES, TURNOVER_TAX } from "../../core/rules.mjs";

export default function corporate(ctx) {
  const { t, fmt } = ctx;
  const money = (name, optional = false) =>
    amountField(ctx, {
      name,
      label: t(`ui.corp.${name}.label`),
      hint: t(`ui.corp.${name}.hint`),
      optional,
    });
  const reducedTypes = COMPANY_TYPES.filter(
    (type) => type.reducedRate !== undefined,
  ).map((type) => type.id);
  const form = html`
    ${section(
      t("ui.corp.groups.company"),
      html`${ayField(ctx, { ays: ["2027-28", "2026-27"], value: "2026-27", help: false })}
      ${selectField(ctx, {
        name: "typeId",
        label: t("ui.corp.type.label"),
        hint: t("ui.corp.type.hint"),
        value: "otherCompany",
        options: COMPANY_TYPES.map((type) => ({
          value: type.id,
          label: t(`ui.corp.types.${type.id}`),
        })),
      })}
      ${switchField(ctx, {
        name: "bankTransfers",
        label: t("ui.corp.bankTransfers.label"),
        hint: t("ui.corp.bankTransfers.hint"),
        attributes: { "data-show-when": `typeId=${reducedTypes.join(",")}` },
      })}`,
    )}
    ${section(
      t("ui.corp.groups.figures"),
      html`${money("taxableProfit")}${money("grossReceipts", true)}
      ${selectField(ctx, {
        name: "turnoverId",
        label: t("ui.corp.turnoverCategory.label"),
        value: "general",
        options: TURNOVER_TAX.map((entry) => ({
          value: entry.id,
          label: `${t(`ui.corp.turnoverCategory.${entry.id}`)} (${fmt.percent(entry.rate)})`,
        })),
      })}
      ${money("taxPaid", true)}`,
    )}
  `;
  return calculatorPage(ctx, {
    id: "corporate",
    form,
    entries: ["corporate"],
    lead: t("page.corporate.lead"),
    emptyText: t("page.corporate.empty"),
    explain: t.get("page.corporate.explain"),
    faq: t.get("page.corporate.faq"),
    related: ["income", "vat", "calendar"],
    sources: [SOURCES.pwcFinanceAct, SOURCES.nbrFinanceActs],
  });
}
