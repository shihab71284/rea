/**
 * Site-wide settings. Override with environment variables at build time:
 *   SITE_URL   canonical origin, default https://taxcalculator.bd
 *   SITE_BASE  path prefix when hosted in a sub-folder, e.g. /taxcalculator/
 */
const base = (process.env.SITE_BASE ?? "/").replace(/\/?$/, "/");

export default {
  name: "TaxCalculator.bd",
  domain: "taxcalculator.bd",
  url: (process.env.SITE_URL ?? "https://taxcalculator.bd").replace(/\/$/, ""),
  base,
  languages: ["en", "bn"],
  defaultLanguage: "en",
  // PLACEHOLDER: replace with a mailbox you control before launch.
  contactEmail: "hello@taxcalculator.bd",
  // Optional: a WhatsApp number in international format, digits only (e.g. "8801XXXXXXXXX").
  // Leave empty to hide the WhatsApp button.
  whatsapp: "",
  // Date the tax rules in src/core/rules.mjs were last checked against official/primary sources.
  rulesVerifiedOn: "2026-10-16",
  themeColor: "#0a1b45",
};
