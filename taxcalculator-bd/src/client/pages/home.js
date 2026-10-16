import { nextEvents } from "../../core/calendar.mjs";
import { computeIncomeTax } from "../../core/income-tax.mjs";
import { DEFAULT_AY } from "../../core/rules.mjs";
import { eventTitle } from "../../views/calendar-text.mjs";
import { esc, localToday } from "../lib/dom.js";
import { bindInputs, readForm, updateWords } from "../lib/form.js";
import { fmt } from "../lib/fmt.js";
import { t } from "../lib/i18n.js";

/** Replace the build-time deadline list with the next dates for the visitor's own "today". */
function renderDates() {
  const list = document.querySelector("[data-home-dates]");
  if (!list) return;
  list.innerHTML = nextEvents(localToday(), 4)
    .map((event) => {
      const when =
        event.daysLeft === 0
          ? t("ui.cal.soon.today")
          : event.daysLeft === 1
            ? t("ui.cal.soon.oneDay")
            : t("ui.cal.soon.days", { n: fmt.digits(event.daysLeft) });
      return `<li><span class="soon-date">${esc(fmt.date(event.date, { day: "numeric", month: "short" }))}</span><span>${esc(eventTitle(event, { t, fmt }))}</span><b>${esc(when)}</b></li>`;
    })
    .join("");
}

export function init() {
  renderDates();
  const form = document.querySelector("[data-quick]");
  if (!form) return;
  const out = (name) => form.querySelector(`[data-quick="${name}"]`);
  const link = form.querySelector("[data-quick-link]");
  const base = link.getAttribute("href");

  function update() {
    const values = readForm(form);
    const income = values.income;
    const salary = values.kind === "salary";
    const input = { ay: DEFAULT_AY, category: values.category };
    if (salary) input.employmentIncome = income;
    else input.otherIncome = income;
    const result = computeIncomeTax(input);
    out("tax").textContent = fmt.taka(result.totalTax);
    out("rate").textContent = fmt.percent(result.effectiveRate * 100, {
      decimals: 1,
    });
    out("month").textContent = fmt.taka(result.monthlyTax);
    updateWords(form);
    const params = new URLSearchParams({ category: values.category });
    if (income > 0)
      params.set(salary ? "employmentIncome" : "otherIncome", String(income));
    link.setAttribute("href", `${base}?${params}`);
  }

  bindInputs(form, update);
  update();
}
