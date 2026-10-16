import { $, debounce, localToday } from "./dom.js";
import {
  applyConditions,
  bindInputs,
  fromQuery,
  readForm,
  toQuery,
  updateWords,
  writeForm,
} from "./form.js";
import { renderEmpty, renderReport } from "./report.js";
import { addSaved } from "./storage.js";
import { toast, refreshLangLinks } from "./chrome.js";
import { t } from "./i18n.js";

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.className = "visually-hidden";
    document.body.append(area);
    area.select();
    const ok = document.execCommand?.("copy") ?? false;
    area.remove();
    return ok;
  }
}

/** Pin the result column while scrolling, but only when it fits on screen. */
function stickyLayout(column) {
  if (!column) return;
  const room = window.innerHeight - 68 - 32;
  const wide = window.matchMedia("(min-width: 1000px)").matches;
  column.classList.toggle("is-sticky", wide && column.scrollHeight < room);
}

/** Fill the mobile result bar and watch the hero so the bar hides while it is visible. */
function showBar(bar, resultEl, report, observer) {
  if (!bar) return;
  $("[data-bar-label]", bar).textContent = report.bar.label;
  $("[data-bar-value]", bar).textContent = report.bar.value;
  bar.hidden = false;
  const hero = $(".result-hero", resultEl);
  if (hero) observer?.observe(hero);
}

/**
 * Wire a calculator form to a live result column.
 *  compute(values)            -> engine result
 *  view(result, values, today) -> report (see views/*) or null for the empty state
 */
export function mountCalculator(options) {
  const {
    form,
    compute,
    view,
    emptyText,
    extraActions = "",
    onAction,
  } = options;
  const {
    root = document,
    urlSync = true,
    showSave = true,
    showCopy = true,
  } = options;
  const resultEl = $("[data-result]", root);
  const emptyMessage =
    emptyText ?? $(".result-empty p", resultEl)?.textContent ?? "";
  const column = $("[data-results-col]", root);
  const bar = $("[data-result-bar]", root);
  const defaults = readForm(form);
  const initial = urlSync ? fromQuery(location.search) : {};
  if (Object.keys(initial).length) writeForm(form, initial);
  let current = null;

  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          if (bar) bar.hidden = !current || entry.isIntersecting;
        })
      : null;

  const syncUrl = debounce(() => {
    if (!urlSync) return;
    const query = toQuery(readForm(form), defaults);
    history.replaceState(
      null,
      "",
      `${location.pathname}${query ? `?${query}` : ""}${location.hash}`,
    );
    refreshLangLinks();
  }, 300);

  function update() {
    const values = readForm(form);
    applyConditions(form, values);
    updateWords(form);
    const report = view(compute(values), values, localToday());
    current = report ? { report, values } : null;
    observer?.disconnect();
    if (report) {
      renderReport(resultEl, report, { extraActions, showSave, showCopy });
      showBar(bar, resultEl, report, observer);
    } else {
      renderEmpty(resultEl, emptyMessage);
      if (bar) bar.hidden = true;
    }
    stickyLayout(column);
    syncUrl();
  }

  async function handleAction(action) {
    if (action === "print") window.print();
    else if (action === "copy") {
      syncUrl.flush();
      toast(
        (await copyText(location.href))
          ? t("ui.common.actions.linkCopied")
          : t("ui.common.actions.copyFailed"),
      );
    } else if (action === "save" && current) {
      addSaved({
        ...current.report.summary,
        query: toQuery(current.values, defaults),
      });
      toast(t("ui.common.actions.saved"));
    } else if (onAction && current) onAction(action, current);
  }

  resultEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) handleAction(button.dataset.action);
  });
  $("[data-action=reset]", form)?.addEventListener("click", () => {
    form.reset();
    update();
    if (urlSync) {
      history.replaceState(null, "", location.pathname);
      refreshLangLinks();
    }
  });

  const run = debounce(update, 40);
  bindInputs(form, run);
  window.addEventListener(
    "resize",
    debounce(() => stickyLayout(column), 150),
  );
  update();
  return { update };
}
