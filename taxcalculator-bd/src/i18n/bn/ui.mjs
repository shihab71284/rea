import common from "./ui-common.mjs";
import it from "./ui-income.mjs";
import sal from "./ui-salary.mjs";
import reb from "./ui-rebate.mjs";
import vat from "./ui-vat.mjs";
import corp from "./ui-corporate.mjs";
import fil from "./ui-filing.mjs";
import pay from "./ui-payroll.mjs";
import tools from "./ui-tools.mjs";

/** Strings used by scripts running in the browser (and by the calculator forms). */
export default { common, it, sal, reb, vat, corp, fil, pay, ...tools };
