import { attrs, esc, html, raw } from "./html.mjs";
import { ICONS } from "./icons.mjs";
import { markBody } from "./brand.mjs";
import { OFFICIAL_LINKS } from "../core/rules.mjs";
import { ARCHIVE_YEARS, LAST_INCOME_YEAR } from "../archive/years.mjs";
import {
  ARCHIVE_SECTIONS,
  RESOURCES,
  TOOLS,
  archiveYearId,
  isArchivePage,
} from "./registry.mjs";

const LOCALES = { en: "en_GB", bn: "bn_BD" };

function sprite(ctx) {
  const symbols = [...ctx.usedIcons]
    .sort()
    .map(
      (name) =>
        `<symbol id="i-${name}" viewBox="0 0 24 24">${ICONS[name]}</symbol>`,
    )
    .join("");
  const mark = `<symbol id="brand-mark" viewBox="0 0 64 64">${markBody()}</symbol>`;
  return raw(
    `<svg class="sprite" aria-hidden="true" focusable="false">${mark}${symbols}</svg>`,
  );
}

function langSwitch(ctx, pageId) {
  const { t, lang } = ctx;
  const item = (code, label) =>
    html`<a
      href="${ctx.pageUrl(pageId, code)}"
      hreflang="${code}"
      lang="${code}"
      data-lang-switch="${code}"
      ${attrs({ "aria-current": lang === code ? "true" : null })}
      >${label}</a
    >`;
  return html`<div
    class="lang-switch"
    role="group"
    aria-label="${t("site.nav.language")}"
  >
    ${item("en", "English")}${item("bn", "বাংলা")}
  </div>`;
}

function toolLink(ctx, tool, className) {
  const tile = tool.tile ? ` tile--${tool.tile}` : "";
  return html`<a class="${className}" href="${ctx.pageUrl(tool.id)}">
    <span class="tile${tile}">${ctx.icon(tool.icon)}</span>
    <span
      ><strong>${ctx.t(`site.tools.${tool.id}.name`)}</strong
      ><span>${ctx.t(`site.tools.${tool.id}.desc`)}</span></span
    >
  </a>`;
}

function megaMenu(ctx) {
  const all = html`<a class="mega-link" href="${ctx.pageUrl("hub")}">
    <span class="tile tile--blue">${ctx.icon("layers")}</span>
    <span
      ><strong>${ctx.t("site.nav.allTools")}</strong
      ><span>${ctx.t("site.meta.hub.title")}</span></span
    >
  </a>`;
  return html`<div class="mega" id="menu-calculators" hidden>
    <div class="mega-grid">
      ${TOOLS.map((tool) => toolLink(ctx, tool, "mega-link"))}${all}
    </div>
  </div>`;
}

function archiveTile(ctx, section) {
  const tile = section.tile ? ` tile--${section.tile}` : "";
  const key = (name) => `page.archive.types.${section.type}.${name}`;
  return html`<a class="mega-link" href="${ctx.pageUrl(section.id)}">
    <span class="tile${tile}">${ctx.icon(section.icon)}</span>
    <span
      ><strong>${ctx.t(key("name"))}</strong
      ><span>${ctx.t(key("desc"))}</span></span
    >
  </a>`;
}

function archiveMenu(ctx) {
  const { t, fmt } = ctx;
  const search = html`<a
    class="mega-link"
    href="${ctx.pageUrl("archive")}#library"
  >
    <span class="tile tile--blue">${ctx.icon("search")}</span>
    <span
      ><strong>${t("page.archive.menu.all")}</strong
      ><span>${t("page.archive.menu.allDesc")}</span></span
    >
  </a>`;
  return html`<div class="mega mega--archive" id="menu-archive" hidden>
    <div class="mega-grid">
      <p class="mega-title">
        ${t("page.archive.menu.title", { last: fmt.digits(LAST_INCOME_YEAR) })}
      </p>
      ${ARCHIVE_SECTIONS.map((section) => archiveTile(ctx, section))}${search}
    </div>
    <div class="mega-years">
      <span>${t("page.archive.menu.byYear")}</span>
      <div class="chips">
        ${ARCHIVE_YEARS.map(
          (year) =>
            html`<a class="chip" href="${ctx.pageUrl(archiveYearId(year))}"
              >${fmt.digits(year)}</a
            >`,
        )}
      </div>
    </div>
  </div>`;
}

function navLink(ctx, id, current, label) {
  return html`<a
    class="nav-link"
    href="${ctx.pageUrl(id)}"
    ${attrs({ "aria-current": current === id ? "page" : null })}
    >${label}</a
  >`;
}

function header(ctx, page) {
  const { t } = ctx;
  const current = page.navId ?? page.id;
  const isTool = TOOLS.some((tool) => tool.id === current) || current === "hub";
  return html`<header
    class="site-header"
    data-header
    ${attrs({ "data-overlay": page.overlayHeader ? "true" : null })}
  >
    <div class="container header-inner">
      <a
        class="brand"
        href="${ctx.pageUrl("home")}"
        aria-label="${t("site.nav.home")}"
      >
        <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
          <use href="#brand-mark" />
        </svg>
        <span class="brand-name">TaxCalculator<span>.bd</span></span>
      </a>
      <nav class="primary-nav" aria-label="${t("site.nav.primary")}">
        <div>
          <button
            class="nav-link"
            type="button"
            aria-expanded="false"
            aria-controls="menu-calculators"
            data-menu-button
            ${attrs({ "aria-current": isTool ? "page" : null })}
          >
            ${t("site.nav.calculators")}${ctx.icon("chevronDown")}
          </button>
          ${megaMenu(ctx)}
        </div>
        <div class="nav-item nav-item--archive">
          <button
            class="nav-link"
            type="button"
            aria-expanded="false"
            aria-controls="menu-archive"
            data-menu-button
            ${attrs({ "aria-current": isArchivePage(current) ? "page" : null })}
          >
            ${t("site.nav.archive")}${ctx.icon("chevronDown")}
          </button>
          ${archiveMenu(ctx)}
        </div>
        ${navLink(ctx, "rates", current, t("site.nav.rates"))}
        ${navLink(ctx, "guides", current, t("site.nav.guides"))}
        ${navLink(ctx, "calendar", current, t("site.nav.calendar"))}
        ${navLink(ctx, "dashboard", current, t("site.nav.dashboard"))}
      </nav>
      <div class="header-actions">
        ${langSwitch(ctx, page.id)}
        <button
          class="icon-btn theme-btn"
          type="button"
          data-theme-toggle
          aria-label="${t("site.nav.theme")}"
        >
          ${ctx.icon("sun", "icon--sun")}${ctx.icon("moon", "icon--moon")}
        </button>
        <button
          class="icon-btn nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-nav"
          aria-label="${t("site.nav.menu")}"
          data-nav-toggle
        >
          ${ctx.icon("menu")}
        </button>
      </div>
    </div>
    ${mobileNav(ctx)}
  </header>`;
}

function mobileNav(ctx) {
  const { t } = ctx;
  const simple = (id, icon, label) =>
    html`<a href="${ctx.pageUrl(id)}">${ctx.icon(icon)}${label}</a>`;
  return html`<div class="mobile-nav" id="mobile-nav" hidden>
    <h2>${t("site.nav.calculators")}</h2>
    ${TOOLS.map((tool) => simple(tool.id, tool.icon, t(`site.tools.${tool.id}.name`)))}
    <h2>${t("site.footer.archive")}</h2>
    ${ARCHIVE_SECTIONS.map((section) => simple(section.id, section.icon, t(`page.archive.types.${section.type}.name`)))}
    ${simple("archive", "archive", t("page.archive.menu.all"))}
    <h2>${t("site.footer.learn")}</h2>
    ${RESOURCES.map((item) => simple(item.id, item.icon, t(`site.tools.${item.id}.name`)))}
    ${simple("guides", "book", t("site.nav.guides"))}${simple("faq", "help", t("site.nav.faq"))}
    <h2>${t("site.footer.company")}</h2>
    ${simple("about", "info", t("site.nav.about"))}${simple("contact", "mail", t("site.nav.contact"))}
  </div>`;
}

function footer(ctx, page) {
  const { t, config } = ctx;
  const portals = [
    ["nbr", OFFICIAL_LINKS.nbr],
    ["etin", OFFICIAL_LINKS.etin],
    ["ereturn", OFFICIAL_LINKS.ereturn],
    ["achallan", OFFICIAL_LINKS.achallan],
    ["vat", OFFICIAL_LINKS.vat],
    ["acts", OFFICIAL_LINKS.financeActs],
  ];
  const li = (href, label, external = false) =>
    html`<li>
      <a
        href="${href}"
        ${attrs(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >${label}</a
      >
    </li>`;
  return html`<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a
          class="brand"
          href="${ctx.pageUrl("home")}"
          aria-label="${t("site.nav.home")}"
        >
          <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
            <use href="#brand-mark" />
          </svg>
          <span class="brand-name">TaxCalculator<span>.bd</span></span>
        </a>
        <p>${t("site.footer.blurb")}</p>
        <div class="footer-controls">
          ${langSwitch(ctx, page.id)}
          <button
            class="icon-btn"
            type="button"
            data-theme-toggle
            aria-label="${t("site.nav.theme")}"
          >
            ${ctx.icon("sun", "icon--sun")}${ctx.icon("moon", "icon--moon")}
          </button>
        </div>
      </div>
      <div>
        <h2>${t("site.footer.calculators")}</h2>
        <ul>
          ${TOOLS.map((tool) => li(ctx.pageUrl(tool.id), t(`site.tools.${tool.id}.name`)))}
        </ul>
      </div>
      <div>
        <h2>${t("site.footer.learn")}</h2>
        <ul>
          ${li(ctx.pageUrl("rates"), t("site.tools.rates.name"))}
          ${li(ctx.pageUrl("calendar"), t("site.tools.calendar.name"))}
          ${li(ctx.pageUrl("dashboard"), t("site.tools.dashboard.name"))}
          ${li(ctx.pageUrl("guides"), t("site.nav.guides"))}
          ${li(ctx.pageUrl("faq"), t("site.nav.faq"))}
        </ul>
      </div>
      <div>
        <h2>${t("site.footer.archive")}</h2>
        <ul>
          ${ARCHIVE_SECTIONS.map((section) => li(ctx.pageUrl(section.id), t(`page.archive.types.${section.type}.name`)))}
          ${li(ctx.pageUrl("archive"), t("page.archive.menu.all"))}
        </ul>
      </div>
      <div>
        <h2>${t("site.footer.company")}</h2>
        <ul>
          ${li(ctx.pageUrl("about"), t("site.nav.about"))}
          ${li(ctx.pageUrl("contact"), t("site.nav.contact"))}
          ${li(ctx.pageUrl("privacy"), t("site.footer.privacy"))}
          ${li(ctx.pageUrl("disclaimer"), t("site.footer.disclaimerLink"))}
        </ul>
      </div>
      <div>
        <h2>${t("site.footer.official")}</h2>
        <ul>
          ${portals.map(([key, href]) => li(href, t(`site.footer.portals.${key}`), true))}
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>
        ${t("site.footer.rights", { year: ctx.fmt.digits(new Date().getUTCFullYear()) })}
        · ${t("site.footer.disclaimer")}
      </p>
      <p>
        ${t("site.common.verified", { date: ctx.fmt.date(config.rulesVerifiedOn) })}
      </p>
    </div>
  </footer>`;
}

function languageBanner(ctx, page) {
  if (ctx.lang !== "en") return "";
  return html`<div class="lang-banner" lang="bn" data-lang-banner hidden>
    <span>${ctx.t("site.banner.switchToBn")}</span>
    <a href="${ctx.pageUrl(page.id, "bn")}" data-lang-switch="bn"
      >${ctx.t("site.banner.switchAction")}</a
    >
    <button
      type="button"
      aria-label="${ctx.t("site.banner.dismiss")}"
      data-banner-dismiss
    >
      ${ctx.icon("x")}
    </button>
  </div>`;
}

function metaTags(ctx, page, title) {
  const { lang, config } = ctx;
  const canonical = ctx.absolute(ctx.pageUrl(page.id, lang));
  const image = ctx.absolute(ctx.asset("assets/og-image.png"));
  const alternates = ["en", "bn"].map(
    (code) =>
      `<link rel="alternate" hreflang="${code}" href="${esc(ctx.absolute(ctx.pageUrl(page.id, code)))}">`,
  );
  alternates.push(
    `<link rel="alternate" hreflang="x-default" href="${esc(ctx.absolute(ctx.pageUrl(page.id, "en")))}">`,
  );
  const og = [
    ["og:type", "website"],
    ["og:site_name", config.name],
    ["og:title", title],
    ["og:description", page.description],
    ["og:url", canonical],
    ["og:image", image],
    ["og:image:width", "1200"],
    ["og:image:height", "630"],
    ["og:image:alt", ctx.t("site.tagline")],
    ["og:locale", LOCALES[lang]],
    ["og:locale:alternate", LOCALES[lang === "en" ? "bn" : "en"]],
  ].map(
    ([property, content]) =>
      `<meta property="${property}" content="${esc(content)}">`,
  );
  const twitter = [
    ["twitter:card", "summary_large_image"],
    ["twitter:title", title],
    ["twitter:description", page.description],
    ["twitter:image", image],
  ].map(([name, content]) => `<meta name="${name}" content="${esc(content)}">`);
  return raw(
    [
      `<link rel="canonical" href="${esc(canonical)}">`,
      ...alternates,
      ...og,
      ...twitter,
    ].join("\n    "),
  );
}

export function renderDocument(ctx, page) {
  const { lang, t, config, assets } = ctx;
  const title =
    page.id === "home" ? page.title : `${page.title} | ${config.name}`;
  const fonts = [
    assets.fonts.latin,
    ...(lang === "bn" ? [assets.fonts.bengali] : []),
  ];
  const jsonld = (page.jsonld ?? []).map(
    (data) =>
      `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
  );
  const body = html`<a class="skip-link" href="#main">${t("site.skip")}</a>
    ${header(ctx, page)}
    <main id="main" tabindex="-1">${page.body}</main>
    ${footer(ctx, page)} ${languageBanner(ctx, page)}
    <div
      class="toast-region"
      role="status"
      aria-live="polite"
      data-toasts
    ></div>`;
  const scripts = (page.entries ?? []).map(
    (name) =>
      `<script type="module" src="${ctx.asset(assets.js[name])}"></script>`,
  );
  const bodyClass = ["page-" + page.id.replace(/\W+/g, "-"), page.bodyClass]
    .filter(Boolean)
    .join(" ");
  const bodyHtml = body.value;
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(page.description)}">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#070f24" media="(prefers-color-scheme: dark)">
    ${page.noindex ? '<meta name="robots" content="noindex, follow">' : ""}
    ${metaTags(ctx, page, title).value}
    <link rel="icon" href="${ctx.asset("favicon.svg")}" type="image/svg+xml">
    <link rel="icon" href="${ctx.asset("favicon.ico")}" sizes="32x32">
    <link rel="apple-touch-icon" href="${ctx.asset("apple-touch-icon.png")}">
    <link rel="manifest" href="${ctx.asset("manifest.webmanifest")}">
    ${fonts.map((href) => `<link rel="preload" href="${ctx.asset(href)}" as="font" type="font/woff2" crossorigin>`).join("\n    ")}
    <script src="${ctx.asset(assets.themeInit)}"></script>
    <link rel="stylesheet" href="${ctx.asset(assets.css)}">
    ${jsonld.join("\n    ")}
  </head>
  <body class="${esc(bodyClass)}">
    ${sprite(ctx).value}
    ${bodyHtml}
    ${scripts.join("\n    ")}
  </body>
</html>
`;
}
