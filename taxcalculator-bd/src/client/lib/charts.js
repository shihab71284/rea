import { esc } from "./dom.js";

const W = 600;
const H = 250;
const PAD = { left: 92, right: 30, top: 20, bottom: 42 };

/**
 * Minimal responsive line chart (SVG). Colours come from CSS classes so the
 * chart follows the light/dark theme.
 *  points: [[x, y], ...]  marker: { x, y }  ticks: [{ value, label }]
 */
export function lineChartSvg({
  points,
  marker,
  xMax,
  yMax,
  xTicks,
  yTicks,
  label,
}) {
  const sx = (x) => PAD.left + (x / xMax) * (W - PAD.left - PAD.right);
  const sy = (y) => H - PAD.bottom - (y / yMax) * (H - PAD.top - PAD.bottom);
  const line = points
    .map(
      ([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`,
    )
    .join("");
  const last = points[points.length - 1];
  const area = `${line}L${sx(last[0]).toFixed(1)} ${sy(0)}L${sx(points[0][0]).toFixed(1)} ${sy(0)}Z`;
  const grid = yTicks
    .map(
      (tick) =>
        `<line class="chart-grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${sy(tick.value)}" y2="${sy(tick.value)}"/>`,
    )
    .join("");
  const yLabels = yTicks
    .map(
      (tick) =>
        `<text class="chart-text" x="${PAD.left - 8}" y="${sy(tick.value) + 4}" text-anchor="end">${esc(tick.label)}</text>`,
    )
    .join("");
  const xLabels = xTicks
    .map((tick, index) => {
      const anchor =
        index === 0 ? "start" : index === xTicks.length - 1 ? "end" : "middle";
      return `<text class="chart-text" x="${sx(tick.value)}" y="${H - PAD.bottom + 20}" text-anchor="${anchor}">${esc(tick.label)}</text>`;
    })
    .join("");
  const dot = marker
    ? `<line class="chart-guide" x1="${sx(marker.x)}" x2="${sx(marker.x)}" y1="${sy(marker.y)}" y2="${sy(0)}"/><circle class="chart-marker" cx="${sx(marker.x)}" cy="${sy(marker.y)}" r="7"/>`
    : "";
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${grid}<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>${dot}${yLabels}${xLabels}</svg>`;
}
