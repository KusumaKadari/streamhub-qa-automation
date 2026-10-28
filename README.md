# SaveSmart – Savings Goal Tracker and QA Automation

SaveSmart is a responsive, beginner-friendly savings goal dashboard built with HTML, CSS, and JavaScript. Goals are stored only in the browser's `localStorage`; no backend or database is used.

## Project Overview

The application provides:

- A dashboard with total savings, total target, remaining savings, and overall progress.
- Goal creation with validation.
- Search and status filters.
- Add-money and delete actions.
- A report table.
- A Chart.js stacked savings chart.

## Application Folder Structure

```text
index.html                  Application markup, dashboard, form, report table, and chart
styles.css                  Responsive application styling
app.js                      State, validation, localStorage, rendering, reports, and chart
```

## Automation Architecture

```text
features/                   Cucumber business-readable scenarios
step-definitions/           JavaScript bindings between Gherkin and page objects
pages/                      Reusable Page Object Model code
support/hooks.js            Browser setup, cleanup, screenshots, and page error logging
api-tests/                  Separate Playwright APIRequestContext tests
test-results/api-*          Actual JSONPlaceholder JSON, Markdown, HTML, and artifacts
cucumber.js                 Cucumber format and discovery configuration
playwright.config.js        Playwright browser, screenshot, trace, and output settings
playwright.api.config.js    Playwright API reporter and artifact configuration
.env                        BASE_URL environment configuration
test-results/               HTML report, screenshots, execution artifacts, and SQL output
sql/                        SQLite schemas, sample data, solutions, verifier, and SQL output
self-healing/               AI locator self-healing guide and separate exercise tests
```

## Prerequisites

- Node.js 18 or newer (Node.js 24 verified during assessment setup)
- npm
- Chromium installed through Playwright
- Python 3 for the SQLite verification runner
- The static application server

## Installation

```powershell
npm install
npx playwright install chromium
```

## Environment Configuration

The application URL is read from `.env`:

```text
BASE_URL=http://localhost:3000
```

Do not hardcode a test URL in normal step definitions. Start from `.env.example`, copy it to `.env`, and change `BASE_URL` only when the application runs on another origin. `.env` and `node_modules/` are excluded from Git.

## Run the Application

```powershell
npm start
```

Then open `http://localhost:3000`. The server must remain running while tests execute.

## Run Automated Tests

Run the complete normal Cucumber suite:

```powershell
npm test
```

Equivalent explicit command:

```powershell
npm run test:cucumber
```

Run the intentionally failing self-healing exercise separately:

```powershell
npm run test:self-healing
```

Run the separate JSONPlaceholder API tests:

```powershell
npm run test:api
```

Verify both SQL challenges with the built-in Python SQLite engine:

```powershell
npm run test:sql
```

The self-healing exercise and API tests are separate from the normal UI Cucumber suite.

## Test Coverage

The normal suite covers dashboard summary cards, Reports navigation, valid goal creation, actual application validation messages, independent money/progress calculations, search, status filtering, deletion, chart data, and empty state behavior. Each scenario clears browser storage before execution; individual scenarios therefore start without inherited test data.

## JSONPlaceholder API Test Coverage

The API suite uses Playwright `APIRequestContext` against `POST https://jsonplaceholder.typicode.com/posts` and is kept outside the Cucumber UI suite. It executes:

- A normal valid post.
- An excessively long title containing 2048 characters.
- HTML and Unicode special characters.
- A payload with no `userId`.
- An empty payload with all required fields missing.

JSONPlaceholder is a mock API. These cases therefore record the service's actual behavior rather than assuming standard validation will produce 4xx responses.

## Execution Results

Executed on 2026-10-28 with Chromium through Playwright:

- First run: 10 scenarios passed, 1 failed. The failure was an add-money locator matched both an input and a button with the same accessible label.
- Correction: scoped the action to Playwright's `spinbutton` role.
- Final run: **11 scenarios passed and 61 steps passed**.

Cucumber report: [test-results/cucumber-report.html](test-results/cucumber-report.html). Failure screenshots, if any, are written to `test-results/` by `support/hooks.js` with a scenario-based filename.

The separate exercise was also executed intentionally: **5 of 5 self-healing tests failed**, as designed, and Playwright preserved screenshots, traces, and error context under `test-results/playwright-artifacts/`. They demonstrate obsolete text, brittle positional/XPath/generated-ID locators, and an outdated button label; they are not counted as defects of the passing normal suite.

### API Execution Results

Executed successfully on 2026-10-28:

- Normal valid request: HTTP **201**; returned the submitted title, body, userId, and generated `id: 101`.
- Excessively long title: HTTP **201**; the complete 2048-character title was echoed.
- Special characters: HTTP **201**; HTML, symbols, Unicode text, and emoji were echoed.
- Missing `userId`: HTTP **201**; returned title, body, and generated `id: 101` without `userId`.
- Missing all required fields: HTTP **201**; returned only generated `id: 101`.

**Final API result: 5 tests passed.** This behavior differs from typical server-side validation expectations because JSONPlaceholder intentionally accepts and echoes mock POST payloads.

Evidence is saved in:

- [test-results/api-execution-summary.md](test-results/api-execution-summary.md)
- [test-results/api-execution-results.json](test-results/api-execution-results.json)
- [test-results/api-results.json](test-results/api-results.json)
- [Playwright API HTML report](test-results/api-report/index.html)

## SQL Challenges

Both SQL solutions use **SQLite dialect**. Reproducible schemas and sample data are separate from the solution queries:

- [round_trip_schema.sql](sql/round_trip_schema.sql)
- [round_trip_data.sql](sql/round_trip_data.sql)
- [round_trip_solution.sql](sql/round_trip_solution.sql)
- [ipl_schema.sql](sql/ipl_schema.sql)
- [ipl_data.sql](sql/ipl_data.sql)
- [ipl_consecutive_solution.sql](sql/ipl_consecutive_solution.sql)
- [verify_sql.py](sql/verify_sql.py)

### Challenge 1: Round-trip transactions

The solution joins each transaction to its reverse transfer, where account A is the sender and account B is the receiver in the opposite direction. It requires reverse time to be after the first transfer but no more than 24 hours later, requires the monetary difference to be at most 10% of the larger amount, and orders account names lexicographically so one account pair is returned once. It also excludes account-to-self transfers.

The sample data contains qualifying A/B and A/C pairs plus a non-qualifying amount mismatch, an over-24-hour pair, and a self-transfer.

### Challenge 2: IPL 2024 consecutive scoring streaks

The solution crosses the complete 2024 match schedule with every sample player. `LEFT JOIN` makes a missing batting appearance `NULL`, and window functions compare each player's consecutive scheduled match numbers while requiring each appearance to have at least 30 runs. Streak grouping therefore stops at missing matches, low scores, or a non-consecutive match gap. The returned date is the first date in each streak that has at least three qualifying matches.

The sample data demonstrates consecutive qualifying scores, scores interrupted by a low innings, a missing match appearance, and a player whose qualifying streak starts after earlier low scores.

### Actual SQL Verification

Executed successfully on 2026-10-28 using Python's built-in SQLite engine in memory:

- Challenge 1 returned 2 qualifying pairs:
  - Transactions 1 and 2: ₹100 / ₹95 within 24 hours.
  - Transactions 3 and 4: ₹500 / ₹450 within 24 hours.
- Challenge 2 returned 2 qualifying players:
  - `IPL Qualifier`, streak started 2024-03-22.
  - `Interrupted Player`, streak started 2024-03-25.

The sample includes non-qualifying cases that did not appear in these results: a 25% amount difference, a reverse transfer more than 24 hours later, low-score interruptions, and the intentionally missing match for `Missing-Game Player`. The IPL data is synthetic, IPL-style demonstration data rather than an official downloaded match dataset, so it validates streak logic reproducibly without claiming real-world tournament completeness.

Actual output is preserved in [test-results/sql-verification.md](test-results/sql-verification.md).

## Locator Strategy

The framework prefers semantic Playwright locators: role, label, text, test ID, and accessible names. Stable app test IDs include `goal-name`, `target-amount`, `current-saved`, `target-date`, `goal-search`, `status-filter`, and `report-search`. Only a small goal-card test ID is used in application markup, alongside accessible names on actions.

## AI-Assisted Locator Self-Healing

See [AI_LOCATOR_SELF_HEALING.md](self-healing/AI_LOCATOR_SELF_HEALING.md). It explains failure detection, DOM/context collection, AI prompting, human review, validation, and applying fixes only after passing tests. The intentional exercise locators are isolated in `self-healing/exercise/intentionally-brittle.spec.js`.

## Known Limitations

- Data is browser-local; clearing site storage resets goals.
- The app has no backend authentication or database.
- Chart.js is loaded through CDN, so chart rendering requires network access to that CDN.
- Deleting a goal uses the browser confirmation dialog; Playwright hooks accept it during automation.
- The self-healing exercise intentionally fails and is an assessment demonstration, not part of the normal passing suite.

## AI-Assisted Development Reflection

AI assistance helped produce a repeatable POM structure, Gherkin coverage, and reusable setup quickly. What required manual correction was real Page Object behavior: Playwright's same accessible label was shared by an add-money input and button, so a generic label locator was ambiguous. I fixed it by targeting the `spinbutton` role. I also confirmed the framework against real browser execution rather than assuming generated code was correct, inspected actual validation messages, and reran the suite until all normal scenarios passed.
