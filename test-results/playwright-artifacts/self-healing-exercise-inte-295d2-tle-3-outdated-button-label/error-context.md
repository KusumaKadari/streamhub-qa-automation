# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: self-healing\exercise\intentionally-brittle.spec.js >> 3 outdated button label
- Location: self-healing\exercise\intentionally-brittle.spec.js:15:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Create Savings Item' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "SaveSmart dashboard" [ref=e4] [cursor=pointer]:
        - /url: "#dashboard"
        - generic [aria-hidden] [ref=e5]: S
        - generic [ref=e6]: SaveSmart
      - navigation "Main navigation" [ref=e7]:
        - button "Dashboard" [ref=e8] [cursor=pointer]
        - button "Reports" [ref=e9] [cursor=pointer]
  - main [ref=e10]:
    - region [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - paragraph [ref=e14]: Your financial overview
          - heading "Savings Dashboard" [level=1] [ref=e15]
        - button "Add New Goal" [ref=e16] [cursor=pointer]: ï¼‹ Add New Goal
      - region "Savings summary" [ref=e17]:
        - article [ref=e18]:
          - generic [aria-hidden] [ref=e19]: â‚¹
          - generic [ref=e20]:
            - paragraph [ref=e21]: Total Savings
            - strong [ref=e22]: â‚¹0
        - article [ref=e23]:
          - generic [aria-hidden] [ref=e24]: â—Ž
          - generic [ref=e25]:
            - paragraph [ref=e26]: Total Target
            - strong [ref=e27]: â‚¹0
        - article [ref=e28]:
          - generic [aria-hidden] [ref=e29]: â†’
          - generic [ref=e30]:
            - paragraph [ref=e31]: Remaining
            - strong [ref=e32]: â‚¹0
        - article [ref=e33]:
          - generic [aria-hidden] [ref=e34]: "%"
          - generic [ref=e35]:
            - paragraph [ref=e36]: Overall Progress
            - strong [ref=e37]: 0%
      - region [ref=e38]:
        - generic [ref=e39]:
          - generic [ref=e40]:
            - paragraph [ref=e41]: Plan your future
            - heading "Your Savings Goals" [level=2] [ref=e42]
          - generic [ref=e43]:
            - generic [ref=e44]:
              - generic [ref=e45]: Search goals
              - searchbox "Search goals" [ref=e46]
            - generic [ref=e47]:
              - generic [ref=e48]: Filter by status
              - combobox "Filter by status" [ref=e49] [cursor=pointer]:
                - option "All Statuses" [selected]
                - option "In Progress"
                - option "Completed"
        - generic [ref=e50]:
          - generic [aria-hidden] [ref=e51]: â—Ž
          - heading "No goals found" [level=3] [ref=e52]
          - paragraph [ref=e53]: Try a different filter or add a new savings goal.
      - region [ref=e54]:
        - generic [ref=e56]:
          - paragraph [ref=e57]: Visual summary
          - heading "Savings Progress by Goal" [level=2] [ref=e58]
        - img "Savings progress chart" [ref=e60]
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
> 17 |   await page.getByRole('button', { name: 'Create Savings Item' }).click();
     |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  18 | });
  19 |
  20 | test('4 brittle XPath-style selector', async ({ page }) => {
  21 |   await page.goto(baseURL);
  22 |   await expect(page.locator('//*[@data-widget="does-not-exist"]')).toBeVisible();
  23 | });
  24 |
  25 | test('5 unstable generated ID', async ({ page }) => {
  26 |   await page.goto(baseURL);
  27 |   await expect(page.locator('#goal-card-dynamic-999')).toBeVisible();
  28 | });
  29 |
```
