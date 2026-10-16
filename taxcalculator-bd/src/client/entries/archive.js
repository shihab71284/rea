import { initChrome } from "../lib/chrome.js";
import { init } from "../pages/archive.js";

// The archive needs no translations of its own: the server renders every label.
initChrome();
init();
