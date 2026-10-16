import { boot } from "../boot.js";
import { init } from "../pages/vat.js";

boot().then(init);
