# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: self-healing\exercise\intentionally-brittle.spec.js >> 5 unstable generated ID
- Location: self-healing\exercise\intentionally-brittle.spec.js:25:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#goal-card-dynamic-999')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('#goal-card-dynamic-999') with timeout 5000ms
  - waiting for locator('#goal-card-dynamic-999')

```

```yaml
- banner:
  - link "SaveSmart dashboard":
    - /url: "#dashboard"
    - text: SaveSmart
  - navigation "Main navigation":
    - button "Dashboard"
    - button "Reports"
- main:
  - region "Savings Dashboard":
    - paragraph: Your financial overview
    - heading "Savings Dashboard" [level=1]
    - button "Add New Goal"
    - region "Savings summary":
      - article:
        - paragraph: Total Savings
        - strong: â‚¹0
      - article:
        - paragraph: Total Target
        - strong: â‚¹0
      - article:
        - paragraph: Remaining
        - strong: â‚¹0
      - article:
        - paragraph: Overall Progress
        - strong: 0%
    - region "Your Savings Goals":
      - paragraph: Plan your future
      - heading "Your Savings Goals" [level=2]
      - text: Search goals
      - searchbox "Search goals"
      - text: Filter by status
      - combobox "Filter by status":
        - option "All Statuses" [selected]
        - option "In Progress"
        - option "Completed"
      - heading "No goals found" [level=3]
      - paragraph: Try a different filter or add a new savings goal.
    - region "Savings Progress by Goal":
      - paragraph: Visual summary
      - heading "Savings Progress by Goal" [level=2]
      - img "Savings progress chart"
```

# Test source

```ts
  1  | // Exercise-only: intentionally incorrect or brittle locators. Never run with the normal suite.
  2  | const { test, expect } = require('@playwright/test');
  3  | const baseURL = process.env.BASE_URL;
  4  |
  5  | test('1 broken text locator: old heading label', async ({ page }) => {
  6  |   await page.goto(baseURL);
  7  |   await expect(page.getByRole('heading', { name: 'Savings Overview Old Label' })).toBeVisible();
  8  | });
  9  |
  10 | test('2 brittle nth-child locator: old card position', async ({ page }) => {
  11 |   await page.goto(baseURL);
  12 |   await expect(page.locator('.summary-grid > article:nth-child(7)')).toBeVisible();
  13 | });
  14 |
  15 | test('3 outdated button label', async ({ page }) => {
  16 |   await page.goto(baseURL);
  17 |   await page.getByRole('button', { name: 'Create Savings Item' }).click();
  18 | });
  19 |
  20 | test('4 brittle XPath-style selector', async ({ page }) => {
  21 |   await page.goto(baseURL);
  22 |   await expect(page.locator('//*[@data-widget="does-not-exist"]')).toBeVisible();
  23 | });
  24 |
  25 | test('5 unstable generated ID', async ({ page }) => {
  26 |   await page.goto(baseURL);
> 27 |   await expect(page.locator('#goal-card-dynamic-999')).toBeVisible();
     |                                                        ^ Error: expect(locator).toBeVisible() failed
  28 | });
  29 |
```
