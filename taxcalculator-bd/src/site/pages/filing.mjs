import { html } from "../html.mjs";
import { calculatorPage } from "../calc-page.mjs";
import {
  amountField,
  ayField,
  dateField,
  section,
  switchField,
} from "../fields.mjs";
import { SOURCES } from "../../core/rules.mjs";

export default function filing(ctx) {
  const { t } = ctx;
  const form = html`
    ${section(
      t("ui.fil.title"),
      html`${ayField(ctx, { ays: ["2027-28", "2026-27"], value: "2026-27", help: false })}
      ${amountField(ctx, { name: "tax", label: t("ui.fil.tax.label"), hint: t("ui.fil.tax.hint") })}
      ${dateField(ctx, { name: "date", label: t("ui.fil.date.label"), hint: t("ui.fil.date.hint") })}
      ${switchField(ctx, { name: "firstTime", label: t("ui.fil.firstTime.label"), hint: t("ui.fil.firstTime.hint") })}
      ${switchField(ctx, { name: "underNotice", label: t("ui.fil.underNotice.label"), hint: t("ui.fil.underNotice.hint") })}`,
    )}
  `;
  return calculatorPage(ctx, {
    id: "filing",
    form,
    entries: ["filing"],
    lead: t("page.filing.lead"),
    emptyText: t("page.filing.empty"),
    explain: t.get("page.filing.explain"),
    faq: t.get("page.filing.faq"),
    related: ["income", "calendar", "rebate"],
    sources: [SOURCES.pwcAdmin, SOURCES.pwcFinanceAct, SOURCES.nbrFinanceActs],
  });
}
