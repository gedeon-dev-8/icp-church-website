# Security Policy

We take the privacy and safety of our church family seriously. This document explains how to report security concerns and what to expect when you do.

---

## What counts as a security issue

Things we'd treat as security-sensitive:

- A vulnerability that exposes visitor data (form submissions, IP addresses, browser fingerprints, etc.) beyond what the site is intentionally collecting
- A way to inject malicious content (XSS, open redirects, unauthorised script execution) into pages served from `icpretoria.org`
- A misconfiguration that leaks credentials, API keys, or server-side details that shouldn't be public
- A supply-chain issue in a dependency we ship to visitors (e.g. a compromised npm package)
- Anything that could let an outside party impersonate the church or its leadership

Things that **aren't** security issues but are still welcome via regular bug reports:

- A broken layout, typo, or stale piece of content
- A link that 404s
- A theme bug — light mode looks wrong on a particular screen size

For those, please open a normal issue using the templates under `.github/ISSUE_TEMPLATE/`.

---

## How to report

**Please don't open a public GitHub issue for security matters.** Email us instead:

- **icpeip012@gmail.com** — for general security concerns or content-related takedown requests

Include:

1. A description of the issue
2. Steps to reproduce (or a proof-of-concept link / screenshot)
3. The impact you've assessed
4. Your contact details so we can follow up

If you've found a way to exploit the issue, please give us a reasonable window — at minimum 14 days — to investigate and patch before publishing or disclosing further.

---

## What you can expect from us

- **Acknowledgement** within 48 hours of receiving your report (usually much faster).
- **An update** within 5 working days letting you know whether we've confirmed the issue, what we plan to do, and a rough timeline.
- **A fix** as soon as the issue is reproduced and a patch is available.
- **Credit** in the changelog and a thank-you note if you'd like one. We don't run a paid bug-bounty programme — this is a small congregational website with no security budget — but we deeply appreciate responsible disclosure.

---

## Personal data and POPIA

The Republic of South Africa's Protection of Personal Information Act (POPIA) applies to the data we collect. We aim to:

- Collect only what's necessary (contact form name + email + message)
- Never share visitor data with third parties beyond service providers (Formspree / Web3Forms for form delivery, Google Analytics for aggregate stats)
- Anonymise IP addresses on the analytics side (`anonymize_ip: true` is set in `gtag` config)
- Respect a visitor's request to delete any data we hold about them

If you'd like to exercise a data-access or deletion right, please email **icpeip012@gmail.com**.

---

## Content takedown

If something on the site features you (a photograph, a name, a quote) and you'd like it removed, no questions asked — please email us and we'll take it down. We'd rather err on the side of pastoral care than archival completeness.

---

## Maintenance posture

This is a volunteer-maintained project. We patch security issues as quickly as we can but cannot guarantee a 24/7 response. Critical patches are typically out within a day; less urgent fixes within a week.

The site's dependencies are reviewed periodically (Vite, React, React Router, Sharp, Font Awesome). Major version bumps go through a PR with manual smoke-testing before merging.
