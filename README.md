# Money Hub
Save path: C:/MarvelApps/moneyhub/README.md

Live (once pushed): https://smarvel1963-ops.github.io/moneyhub/ - app #6 of the Marvel Corp Hub family (Scott 2026-10-15,
plan: C:/MarvelDesktop/docs/MONEY_HUB_PLAN_FROM_OUTSIDE_CHAT_2026-10-15.md).

This repo is Money Hub's OWN shell: index.html, manifest.json, icons and sw.js. The app itself is the shared Hub
engine in the Day Hub repo run with window.DH_MODE = "money" plus money.js.

- Own data on the phone (moneyhub.v1). No bank logins - balances are typed, spending is typed or a bank's CSV.
- Phase 1: dashboard, accounts, spending + CSV import, bills, budget, debt payoff, subscriptions, payday planner, reports.
- Money Hub Pro $2.99/mo (30-day free trial) = the MONEY_PASS switch in ../dayhub/features.js, OFF until the Whop product.
- Icons from Scott's logo (10/15), original in ../dayhub/brand/money_hub_logo_original.png.
- Tests + release steps: the Day Hub repo (python tests/run_tests.py).
