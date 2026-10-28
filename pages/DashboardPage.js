const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) { this.page = page; this.baseUrl = process.env.BASE_URL; }

  async open() {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async resetGoals() {
    await this.page.addInitScript(() => localStorage.removeItem('savesmart_goals'));
    await this.open();
  }

  summaryCards() { return this.page.locator('.summary-card'); }
  async expectDashboardLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Savings Dashboard' })).toBeVisible();
    await expect(this.summaryCards()).toHaveCount(4);
  }

  async goToReports() { await this.page.getByRole('button', { name: 'Reports' }).click(); }

  async addGoal({ name, target, saved = 0, date }) {
    const openButton = this.page.getByRole('button', { name: /Add New Goal/ });
    if ((await openButton.getAttribute('aria-expanded')) !== 'true') await openButton.click();
    await this.page.getByLabel('Goal Name').fill(name);
    await this.page.getByLabel('Target Amount (₹)').fill(String(target));
    await this.page.getByLabel('Current Saved Amount (₹)').fill(String(saved));
    await this.page.getByLabel('Target Date').fill(date);
    await this.page.getByRole('button', { name: 'Save Goal' }).click();
  }

  goalCard(name) { return this.page.getByRole('article').filter({ has: this.page.getByRole('heading', { name, exact: true }) }); }
  async expectGoalVisible(name) { await expect(this.page.getByRole('heading', { name, exact: true })).toBeVisible(); }

  async expectValidation(message) { await expect(this.page.getByRole('alert')).toContainText(message); }

  async addMoney(name, amount) {
    const card = this.goalCard(name);
    await card.getByRole('spinbutton', { name: `Add money to ${name}` }).fill(String(amount));
    await card.getByRole('button', { name: 'Add Money' }).click();
  }

  async searchGoals(text) { await this.page.getByTestId('goal-search').fill(text); }
  async filterStatus(status) { await this.page.getByTestId('status-filter').selectOption(status); }

  async deleteGoal(name) {
    this.page.once('dialog', dialog => dialog.accept());
    await this.page.getByRole('button', { name: `Delete ${name}` }).click();
  }

  async expectChartValid() {
    await expect(this.page.getByRole('img', { name: 'Savings progress chart' })).toBeVisible();
    const result = await this.page.evaluate(() => {
      const canvas = document.getElementById('savings-chart');
      const chart = Chart.getChart(canvas);
      return chart ? { labels: chart.data.labels, datasets: chart.data.datasets.map(d => ({ label: d.label, data: d.data })) } : null;
    });
    expect(result).not.toBeNull();
    expect(result.labels.length).toBeGreaterThan(0);
    expect(result.datasets).toHaveLength(2);
  }

  async emptyState() { await expect(this.page.getByRole('heading', { name: 'No goals found' })).toBeVisible(); }
}
module.exports = DashboardPage;
