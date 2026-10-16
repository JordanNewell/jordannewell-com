---
title: "MedRecall"
tagline: "Recall risk, ranked months before the announcement."
description: "MedRecall reads every adverse-event report the FDA publishes and ranks your device portfolio for post-market review — so your QA team works the drift, not the deadline."
status: "beta"
shipDate: 2026-10-14
homepage: "https://getmedrecall.com"
logo: "/products/medrecall/logo.png"
pricing: "paid"
license: "Proprietary"
order: 3
ogImage: "/products/medrecall/og.png"
stats:
  - k: "MAUDE reports ingested"
    v: "17.4M+"
  - k: "re-ranking cadence"
    v: "daily"
  - k: "ranking horizon"
    v: "6-mo"
features:
  - title: "Trajectory, not counts"
    body: "30/60/90/180/365-day adverse-event velocity and acceleration, severity language scoring, and manufacturer recall history. The features describe a drift, not a snapshot — the input that moves before enforcement notices do."
  - title: "Tuned to stay quiet"
    body: "The scoring model is tuned for high specificity, because a flag should mean something. Every score exposes the features that drove it, so your QA lead can argue with it."
  - title: "A ranked queue, not a firehose"
    body: "Monthly portfolio signal sheet, continuous read API, and an estimated review horizon per device family. Your team's judgment does the rest — on the right devices first."
faq:
  - q: "What does MedRecall actually do?"
    a: "It reads every adverse-event report the FDA publishes through openFDA — MAUDE plus recall enforcement records — computes per-device risk trajectories, and ranks your device portfolio for post-market review. Continuously, with an estimated lead time per device family."
  - q: "Isn't MAUDE garbage data?"
    a: "The FDA's own documentation warns against naive use: underreporting, unverified causation, no cross-device rate comparisons. That's why the methodology, not the data access, is the product. Duplicate and follow-up reports are linked and deduplicated before any feature is computed, the pre- and post-2019 reporting regimes are treated as structurally different, and high report volume is never read as high danger."
  - q: "Is it predicting recalls?"
    a: "No — and the distinction matters. Outputs are probabilistic rankings that direct human review. They are decision support for manufacturer QA/RA teams: not predictions of regulatory action, not medical advice, not clinical decision support, and not a substitute for any regulatory obligation."
  - q: "How do pilots start?"
    a: "Email info@getmedrecall.com with your device families and portfolio size. Pilot onboarding is by application while the product stays small enough to walk every customer through the method."
privacy: "MedRecall is built entirely on public data — the FDA's openFDA platform (MAUDE adverse-event reports; recall enforcement reports). No patient data is collected. Outputs are decision-support analytics for post-market surveillance prioritization. MedRecall is not affiliated with, endorsed by, or sponsored by the FDA."
---

Monitoring tells you a recall happened. Ranking tells you where to look now.

[MedRecall](https://getmedrecall.com) reads every adverse-event report the FDA publishes and ranks your device portfolio for post-market review — months before an announcement makes it obvious. Every commercial tool in this category monitors: it matches FDA notices to your inventory after the agency acts. MedRecall works from adverse-event velocity, the input that moves before notices do — 90-day velocity, severity mix, manufacturer history, ranked into a review queue with an estimated lead time.

The step from after to ahead is unclaimed in this category. MedRecall takes it as engineering, not prophecy: quantified scores, exposed features, and the judgment stays with your people — on the right devices first.
