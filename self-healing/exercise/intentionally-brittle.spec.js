// Exercise-only: intentionally incorrect or brittle locators. Never run with the normal suite.
const { test, expect } = require('@playwright/test');
const baseURL = process.env.BASE_URL;

test('1 broken text locator: old heading label', async ({ page }) => {
  await page.goto(baseURL);
  await expect(page.getByRole('heading', { name: 'Savings Overview Old Label' })).toBeVisible();
});

test('2 brittle nth-child locator: old card position', async ({ page }) => {
  await page.goto(baseURL);
  await expect(page.locator('.summary-grid > article:nth-child(7)')).toBeVisible();
});

test('3 outdated button label', async ({ page }) => {
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Create Savings Item' }).click();
});

test('4 brittle XPath-style selector', async ({ page }) => {
  await page.goto(baseURL);
  await expect(page.locator('//*[@data-widget="does-not-exist"]')).toBeVisible();
});

test('5 unstable generated ID', async ({ page }) => {
  await page.goto(baseURL);
  await expect(page.locator('#goal-card-dynamic-999')).toBeVisible();
});
