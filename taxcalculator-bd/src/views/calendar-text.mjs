/** Wording for tax-calendar events, shared by the calendar page and the dashboard. */

/** ["2026-07", "2026-09"] -> "Jul-Sep 2026" (localised month names and digits). */
export function periodLabel(period, fmt) {
  const [from, to] = period;
  const month = (ym) => fmt.date(`${ym}-01`, { month: "short" });
  return `${month(from)}\u2013${month(to)} ${fmt.date(`${to}-01`, { year: "numeric" })}`;
}

const params = (event, fmt) =>
  event.period ? { period: periodLabel(event.period, fmt) } : {};

export const eventTitle = (event, { t, fmt }) =>
  t(`ui.cal.events.${event.key}.title`, params(event, fmt));
export const eventDesc = (event, { t, fmt }) =>
  t(`ui.cal.events.${event.key}.desc`, params(event, fmt));
