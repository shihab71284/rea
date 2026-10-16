import { toast } from "../lib/chrome.js";
import { $ } from "../lib/dom.js";

export function init() {
  const form = $("[data-contact]");
  const copy = $("[data-copy-email]");
  copy?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.copyEmail);
      toast(copy.dataset.copied);
    } catch {
      /* clipboard blocked: the address is visible as a link anyway */
    }
  });
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      data.get("message"),
      "",
      "--",
      data.get("name"),
      data.get("email"),
    ].filter((line) => line !== null);
    const subject = `[TaxCalculator.bd] ${data.get("topic")}`;
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
}
