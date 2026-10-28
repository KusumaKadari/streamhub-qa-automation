const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DashboardPage = require('../pages/DashboardPage');

Given('the dashboard is open with a cleared goal list', async function () {
  this.dashboard = new DashboardPage(this.page);
  await this.dashboard.resetGoals();
});

Then('the dashboard heading and four summary cards are visible', function () {
  return this.dashboard.expectDashboardLoaded();
});

When('the user opens Reports', function () { return this.dashboard.goToReports(); });
Then('the Savings Report heading is visible', function () {
  return expect(this.page.getByRole('heading', { name: 'Savings Report' })).toBeVisible();
});

When('the user adds a goal named {string} with target {int} saved {int} and date {string}', function (name, target, saved, date) {
  return this.dashboard.addGoal({ name, target, saved, date });
});
Then('the goal {string} appears on the dashboard', function (name) { return this.dashboard.expectGoalVisible(name); });
Then('the goal total saved should be calculated as {int}', async function (saved) {
  const expected = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(saved);
  await expect(this.page.locator('#total-savings')).toHaveText(expected);
});

When('the user submits invalid goal data name {string} target {int} saved {int} and date {string}', function (name, target, saved, date) {
  return this.dashboard.addGoal({ name, target, saved, date });
});
Then('validation feedback contains {string}', function (message) { return this.dashboard.expectValidation(message); });

When('the user adds {int} money to {string}', function (amount, name) { return this.dashboard.addMoney(name, amount); });
Then('{string} should show saved {int} remaining {int} and progress {int} percent', async function (name, saved, remaining, progress) {
  const card = this.dashboard.goalCard(name);
  await expect(card).toContainText(`₹${new Intl.NumberFormat('en-IN').format(saved)}`);
  await expect(card).toContainText(`Remaining: ₹${new Intl.NumberFormat('en-IN').format(remaining)}`);
  await expect(card).toContainText(`${progress}%`);
  await expect(card.getByRole('progressbar', { name: `${name} progress` })).toHaveAttribute('aria-valuenow', String(progress));
});

When('the user searches for {string}', function (text) { return this.dashboard.searchGoals(text); });
Then('only {string} is visible', async function (name) {
  await expect(this.page.getByRole('heading', { name, exact: true })).toBeVisible();
  await expect(this.page.locator('[data-testid="goal-card"]')).toHaveCount(1);
});
When('the user clears the search', function () { return this.dashboard.searchGoals(''); });
When('the user filters goals by status {string}', function (status) { return this.dashboard.filterStatus(status); });

When('the user deletes {string}', function (name) { return this.dashboard.deleteGoal(name); });
Then('the goal {string} is not visible', async function (name) {
  await expect(this.page.getByRole('heading', { name, exact: true })).toHaveCount(0);
});

Then('the chart is visible with valid saved and remaining data', async function () {
  await this.dashboard.expectChartValid();
  const chart = await this.page.evaluate(() => {
    const c = Chart.getChart(document.getElementById('savings-chart'));
    return c.data.datasets.map(d => d.data);
  });
  const expectedSaved = 300;
  const expectedRemaining = 1200 - 300;
  expect(chart[0]).toEqual([expectedSaved]);
  expect(chart[1]).toEqual([expectedRemaining]);
});

Then('the empty goals state is visible', function () { return this.dashboard.emptyState(); });
