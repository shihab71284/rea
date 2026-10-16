import { $, $$, esc, icon } from "./dom.js";
import { lang } from "./i18n.js";
import { getPref, setPref } from "./storage.js";

export function toast(message) {
  const region = $("[data-toasts]");
  if (!region) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `${icon("circleCheck")}<span>${esc(message)}</span>`;
  region.append(node);
  setTimeout(() => node.remove(), 2800);
}

/** Offer `text` as a file download without a server round trip. */
export function downloadText(
  filename,
  text,
  type = "text/plain;charset=utf-8",
) {
  const bom = type.startsWith("text/csv") ? "\uFEFF" : "";
  const url = URL.createObjectURL(new Blob([`${bom}${text}`], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Keep the language switch pointing at the same page *with* the current query string. */
export function refreshLangLinks() {
  for (const link of $$("[data-lang-switch]")) {
    const url = new URL(link.getAttribute("href"), location.href);
    link.setAttribute(
      "href",
      `${url.pathname}${location.search}${location.hash}`,
    );
  }
}

function initTheme() {
  for (const button of $$("[data-theme-toggle]")) {
    button.addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      setPref("theme", next);
    });
  }
}

function initMenus() {
  const nav = $("[data-nav-toggle]");
  const mobile = $("#mobile-nav");
  const menuButton = $("[data-menu-button]");
  const menu = $("#menu-calculators");

  const setMobile = (open) => {
    if (!nav || !mobile) return;
    mobile.hidden = !open;
    nav.setAttribute("aria-expanded", String(open));
  };
  const setMenu = (open) => {
    if (!menuButton || !menu) return;
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
  };

  nav?.addEventListener("click", () => setMobile(mobile.hidden));
  menuButton?.addEventListener("click", () => setMenu(menu.hidden));
  document.addEventListener("click", (event) => {
    if (
      menu &&
      !menu.hidden &&
      !event.target.closest("[data-menu-button], #menu-calculators")
    )
      setMenu(false);
    if (
      mobile &&
      !mobile.hidden &&
      !event.target.closest("[data-nav-toggle], #mobile-nav")
    )
      setMobile(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menu && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
    if (mobile && !mobile.hidden) {
      setMobile(false);
      nav.focus();
    }
  });
  menu?.addEventListener("focusout", (event) => {
    if (
      !menu.contains(event.relatedTarget) &&
      event.relatedTarget !== menuButton
    )
      setMenu(false);
  });
}

function initHeaderScroll() {
  const header = $("[data-header]");
  if (!header) return;
  const update = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/** Remember an explicit language choice and honour it on later visits. */
function initLanguagePreference() {
  const stored = getPref("lang");
  if (stored && stored !== lang && !location.search.includes("nolang")) {
    const target = $(`[data-lang-switch="${stored}"]`);
    if (target) {
      const { pathname } = new URL(target.getAttribute("href"), location.href);
      location.replace(`${pathname}${location.search}${location.hash}`);
      return;
    }
  }
  for (const link of $$("[data-lang-switch]")) {
    link.addEventListener("click", () =>
      setPref("lang", link.dataset.langSwitch),
    );
  }
  const banner = $("[data-lang-banner]");
  const prefersBangla = (navigator.languages ?? [navigator.language]).some(
    (code) => /^bn\b/i.test(code ?? ""),
  );
  if (banner && prefersBangla && !stored && !getPref("langBannerDismissed")) {
    banner.hidden = false;
    $("[data-banner-dismiss]", banner)?.addEventListener("click", () => {
      banner.hidden = true;
      setPref("langBannerDismissed", true);
    });
  }
}

function initReveal() {
  const items = $$("[data-reveal]");
  if (!items.length || !("IntersectionObserver" in window)) {
    for (const item of items) item.classList.add("in-view");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const item of items) observer.observe(item);
}

export function initChrome() {
  initTheme();
  initMenus();
  initHeaderScroll();
  initLanguagePreference();
  refreshLangLinks();
  initReveal();
}
