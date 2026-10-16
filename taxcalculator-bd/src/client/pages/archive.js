import { toEnDigits } from "../../core/format.mjs";
import { refreshLangLinks } from "../lib/chrome.js";
import { $, $$, debounce } from "../lib/dom.js";
import { fmt } from "../lib/fmt.js";

const normalize = (text) => toEnDigits(text).toLowerCase().trim();

/** Which filters a document row has to pass: type, income year and every search word. */
const matcher = (state, haystacks) => {
  const terms = normalize(state.q).split(/\s+/).filter(Boolean);
  return (row) =>
    (!state.type || row.dataset.type === state.type) &&
    (!state.year || row.dataset.year === state.year) &&
    terms.every((term) => haystacks.get(row).includes(term));
};

/** Starting filters from the address (?q=jute&type=sro&year=2020-21), ignoring unknown values. */
function readState(types, years) {
  const params = new URLSearchParams(location.search);
  const pick = (name, allowed) =>
    allowed.includes(params.get(name)) ? params.get(name) : "";
  return {
    q: params.get("q") ?? "",
    type: pick("type", types),
    year: pick("year", years),
  };
}

function writeState(state) {
  const params = new URLSearchParams(location.search);
  for (const [name, value] of Object.entries(state)) {
    if (value) params.set(name, value);
    else params.delete(name);
  }
  const query = params.toString();
  history.replaceState(
    null,
    "",
    `${location.pathname}${query ? `?${query}` : ""}${location.hash}`,
  );
  refreshLangLinks();
}

export function init() {
  const root = $("[data-library]");
  if (!root) return;
  const els = {
    q: $("[data-library-q]", root),
    year: $("[data-library-year]", root),
    clear: $("[data-library-clear]", root),
    count: $("[data-library-count]", root),
    empty: $("[data-library-empty]", root),
  };
  const chips = $$("[data-library-type]", root);
  const rows = $$("[data-doc]", root);
  const groups = $$("[data-group]", root);
  // Each row is searched by its visible text (Bangla digits read as Latin) plus its extra terms.
  const haystacks = new Map(
    rows.map((row) => [
      row,
      normalize(`${row.textContent} ${row.dataset.search}`),
    ]),
  );
  const state = readState(
    chips.map((chip) => chip.dataset.libraryType),
    [...els.year.options].map((option) => option.value),
  );

  function apply() {
    const passes = matcher(state, haystacks);
    let shown = 0;
    for (const row of rows) {
      const ok = passes(row);
      row.hidden = !ok;
      if (ok) shown += 1;
    }
    for (const group of groups)
      group.hidden = !$("[data-doc]:not([hidden])", group);
    els.count.textContent = els.count.dataset.template
      .replace("{shown}", fmt.digits(shown))
      .replace("{total}", fmt.digits(rows.length));
    els.empty.hidden = shown !== 0;
    els.clear.hidden = !(state.q || state.type || state.year);
    for (const chip of chips)
      chip.setAttribute(
        "aria-pressed",
        String(chip.dataset.libraryType === state.type),
      );
    writeState(state);
  }

  const onSearch = debounce(() => {
    state.q = els.q.value;
    apply();
  }, 120);
  els.q.value = state.q;
  els.year.value = state.year;
  els.q.addEventListener("input", onSearch);
  els.year.addEventListener("change", () => {
    state.year = els.year.value;
    apply();
  });
  for (const chip of chips)
    chip.addEventListener("click", () => {
      state.type = chip.dataset.libraryType;
      apply();
    });
  els.clear.addEventListener("click", () => {
    Object.assign(state, { q: "", type: "", year: "" });
    els.q.value = "";
    els.year.value = "";
    apply();
  });
  apply();
}
