/**
 * The official pages the archive follows. The labels are in the "lists"
 * section of each language's page-archive.mjs; these are only the addresses.
 */

export const OFFICIAL_LISTS = {
  nbrParipatra:
    "https://nbr.gov.bd/taxtypes/income-tax/income-tax-paripatra/eng",
  surveyNirdeshika: "https://taxsurvey.gov.bd/publications-forms/nirdeshika",
  nbrSros: "https://nbr.gov.bd/regulations/sros/income-tax-sros/eng",
  nbrActs: "https://nbr.gov.bd/regulations/acts/income-tax-acts/eng",
  nbrFinanceActs: "https://nbr.gov.bd/regulations/acts/finance-acts/eng",
  bdlawsOrdinance: "http://bdlaws.minlaw.gov.bd/act-672.html",
};

/** Which official lists belong to each type of document. */
export const LISTS_BY_TYPE = {
  circular: ["nbrParipatra"],
  directive: ["surveyNirdeshika", "nbrParipatra"],
  sro: ["nbrSros"],
  law: ["nbrActs", "nbrFinanceActs", "bdlawsOrdinance"],
};
