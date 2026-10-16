export default {
  hub: {
    lead: "Seven free calculators and three planning tools for Bangladesh tax, all built on the Finance Act 2026 and all showing their working.",
    groups: {
      individuals: "For individuals",
      business: "For businesses",
      plan: "Plan and learn",
    },
  },
  notFound: {
    heading: "We couldn't find that page",
    text: "The link may be out of date, or the address may have a typo. Try one of these instead.",
    home: "Go to the home page",
  },
  about: {
    lead: "TaxCalculator.bd turns Bangladesh's tax rules into simple calculators that show their working, in English and বাংলা.",
    blocks: [
      ["h2", "Why this site exists"],
      [
        "p",
        "Bangladesh's tax rules change with every budget, and the answers people find online are often out of date or locked inside spreadsheets. We put the current rules into fast calculators and plain-language guides, so that you can see where every taka of your tax comes from.",
      ],
      ["h2", "What you can do here"],
      [
        "ul",
        [
          "Work out **income tax** and **salary TDS** step by step, in the order of the e-Return.",
          "Plan your **investment rebate** and see the effect of your **filing date**.",
          "Add or remove **VAT and supplementary duty**, build invoices and check **company tax**.",
          "Run **payroll TDS** for a whole team and export it to CSV.",
          "Keep a private **dashboard** of saved results and a filing checklist.",
        ],
      ],
      ["h2", "Where the numbers come from"],
      [
        "p",
        "Rates and limits come from the Finance Act 2026 and public guidance: the National Board of Revenue and published analyses such as PwC Bangladesh's *Finance Act, 2026: Key Amendments*. Every rule lives in one file in our code, with automated tests that check the calculators against worked examples. Each page shows the date the rules were last verified.",
      ],
      [
        "callout",
        "warn",
        "We are an independent project. We are not affiliated with the National Board of Revenue or any government body, and the results are estimates for information, not tax advice.",
      ],
      ["h2", "Private by design"],
      [
        "p",
        "Everything is calculated in your browser. There are no accounts and no tracking, and we never see your numbers. Read the [privacy policy]({@privacy}).",
      ],
      ["h2", "Found a mistake?"],
      [
        "p",
        "Tax law is detailed, and errors happen. Tell us through the [contact page]({@contact}), with the assessment year and the figures you entered, and we will check it against the law.",
      ],
    ],
  },
  contact: {
    lead: "Report a mistake, suggest a calculator, or ask a question about this website. We read every message.",
    emailTitle: "Email us",
    emailText:
      "Write to {email}. For a calculation issue, include the assessment year and the figures you entered, or paste the link from the \u201cCopy link\u201d button.",
    whatsapp: "Message us on WhatsApp",
    formTitle: "Send a message",
    formNote:
      "This opens your email app with the message filled in. Nothing is sent from this page.",
    name: "Your name",
    email: "Your email",
    topic: "What is this about?",
    topics: {
      mistake: "Report a mistake",
      feature: "Suggest a feature",
      question: "Ask a question",
      business: "Business enquiry",
    },
    message: "Message",
    send: "Open in my email app",
    copy: "Copy email address",
    copied: "Email address copied",
    adviceTitle: "Need tax advice?",
    adviceText:
      "We cannot give personal tax advice. For your own return, speak to a qualified tax practitioner or the NBR helpdesk.",
  },
  privacy: {
    lead: "TaxCalculator.bd runs in your browser. We do not ask who you are and we do not see your numbers.",
    updated: "Last updated {date}",
    blocks: [
      ["h2", "What we collect"],
      [
        "p",
        "Nothing about you. The calculators run on your device, so the incomes, investments and other figures you enter are never sent to us. There are no accounts, no tracking cookies, no analytics and no third-party scripts or fonts.",
      ],
      ["h2", "What stays in your browser"],
      [
        "ul",
        [
          "Your **theme and language** choice.",
          "**Saved calculations** and **checklist progress**, if you use the dashboard.",
          "These are stored with your browser's local storage on your own device. Clearing your browser data removes them.",
        ],
      ],
      ["h2", "Links that contain your inputs"],
      [
        "p",
        "To make results shareable, the address of a calculator page includes the figures you entered. Anyone who has the link can see those figures, so share it only with people you trust.",
      ],
      ["h2", "Email and hosting"],
      [
        "p",
        "If you email us, we use your message and address only to reply. Our hosting provider may keep standard server logs, such as IP addresses and page requests, for security and reliability.",
      ],
      ["h2", "Changes and questions"],
      [
        "p",
        "If this policy changes, we will update the date above. Questions? Use the [contact page]({@contact}).",
      ],
    ],
  },
  disclaimer: {
    lead: "Please read this before relying on any result from this website.",
    blocks: [
      ["h2", "Estimates, not advice"],
      [
        "p",
        "The calculators and guides give general information and estimates. They are not tax, legal, accounting or investment advice, and they do not replace a qualified professional who knows your facts.",
      ],
      ["h2", "Rules change"],
      [
        "p",
        "Tax law is amended by Finance Acts, Statutory Regulatory Orders and NBR notices. We update the site when rules change and show the date they were last verified, but a rule may change before we do. Always confirm the figures in the NBR e-Return and the Finance Act 2026 text before you file.",
      ],
      ["h2", "Independent and unofficial"],
      [
        "p",
        "TaxCalculator.bd is an independent project. It is not affiliated with, endorsed by or operated by the National Board of Revenue or any government body. Links to official portals are provided for convenience.",
      ],
      ["h2", "No warranty"],
      [
        "p",
        "We work hard to be accurate but give no warranty that the site is complete, current or error-free. To the extent the law allows, we are not liable for any loss arising from the use of, or reliance on, the site.",
      ],
      ["h2", "Your return is your responsibility"],
      [
        "p",
        "You are responsible for the accuracy of the return you file and for meeting deadlines. If your situation is complicated, such as business income, foreign income or an audit notice, speak to a tax practitioner.",
      ],
    ],
  },
};
