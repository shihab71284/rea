import { html, inline } from "./html.mjs";
import { callout, resolveLinks } from "./components.mjs";
import { computeIncomeTax } from "../core/income-tax.mjs";

/**
 * Renders translated long-form content. Blocks are tuples so both languages
 * stay structurally identical (checked by tests/i18n.test.mjs):
 *   ["h2", text] ["h3", text] ["p", text] ["ul", [text...]] ["ol", [text...]]
 *   ["callout", tone, text] ["table", head[], rows[][]]
 *   ["steps", [{ title, text }]] ["slabExample", { ay, income, category }]
 * Text supports **bold**, `code` and [links](url).
 */
export const slug = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

function renderTable(head, rows, numericColumns, rich) {
  const numeric = new Set(numericColumns);
  // Focusable so keyboard users can scroll a table that is wider than the screen.
  return html`<div class="table-wrap" tabindex="0">
    <table class="table">
      <thead>
        <tr>
          ${head.map((cell, i) => html`<th scope="col" class="${numeric.has(i) ? "num" : ""}">${cell}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${rows.map(
          (row) =>
            html`<tr>
              ${row.map((cell, i) => html`<td class="${numeric.has(i) ? "num" : ""}">${rich(cell)}</td>`)}
            </tr>`,
        )}
      </tbody>
    </table>
  </div>`;
}

function slabExample(ctx, { ay, income, category = "general" }) {
  const { t, fmt } = ctx;
  const result = computeIncomeTax({ ay, otherIncome: income, category });
  const label = (row, index) => {
    if (index === 0)
      return `${t("ui.it.result.slabs.first", { amount: fmt.taka(row.width) })} (${t("ui.it.result.slabs.free")})`;
    return Number.isFinite(row.width)
      ? t("ui.it.result.slabs.next", { amount: fmt.taka(row.width) })
      : t("ui.it.result.slabs.rest");
  };
  const visible = result.slab.rows.filter(
    (row, index) => index === 0 || row.amount > 0,
  );
  const rows = visible.map((row) => [
    label(row, result.slab.rows.indexOf(row)),
    fmt.percent(row.rate),
    fmt.taka(row.amount),
    fmt.taka(row.tax),
  ]);
  rows.push([
    `**${t("ui.common.words.total")}**`,
    "",
    `**${fmt.taka(income)}**`,
    `**${fmt.taka(result.totalTax)}**`,
  ]);
  const head = [
    t("ui.it.result.slabs.slab"),
    t("ui.it.result.slabs.rate"),
    t("ui.it.result.slabs.amount"),
    t("ui.it.result.slabs.tax"),
  ];
  return renderTable(head, rows, [1, 2, 3], inline);
}

export function renderBlocks(ctx, blocks) {
  const rich = (text) => inline(resolveLinks(ctx, text));
  return blocks.map((block) => {
    const [type, ...rest] = block;
    switch (type) {
      case "h2":
        return html`<h2 id="${rest[1] ?? slug(rest[0])}">${rest[0]}</h2>`;
      case "h3":
        return html`<h3>${rest[0]}</h3>`;
      case "p":
        return html`<p>${rich(rest[0])}</p>`;
      case "ul":
        return html`<ul>
          ${rest[0].map((item) => html`<li>${rich(item)}</li>`)}
        </ul>`;
      case "ol":
        return html`<ol>
          ${rest[0].map((item) => html`<li>${rich(item)}</li>`)}
        </ol>`;
      case "callout":
        return callout(ctx, rest[0], rest[1]);
      case "table":
        return renderTable(rest[0], rest[1], rest[2], rich);
      case "steps":
        return html`<ol class="guide-steps">
          ${rest[0].map((step) => html`<li><strong>${step.title}</strong><span>${rich(step.text)}</span></li>`)}
        </ol>`;
      case "slabExample":
        return slabExample(ctx, rest[0]);
      case "details":
        return html`<details class="group" ${rest[2] ? "open" : ""}>
          <summary>${rest[0]}${ctx.icon("chevronDown")}</summary>
          <div class="group-body">${renderBlocks(ctx, rest[1])}</div>
        </details>`;
      default:
        throw new Error(`Unknown content block: ${type}`);
    }
  });
}
