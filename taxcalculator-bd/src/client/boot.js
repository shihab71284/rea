import { initChrome } from "./lib/chrome.js";
import { loadDictionary } from "./lib/i18n.js";

/** Shared start-up for every page: site chrome first, then the language dictionary. */
export async function boot() {
  initChrome();
  await loadDictionary();
}
