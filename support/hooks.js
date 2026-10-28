require('dotenv').config();
const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

setDefaultTimeout(30 * 1000);

Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({ viewport: { width: 1280, height: 900 } });
  this.page = await this.context.newPage();
  this.page.on('pageerror', error => console.error(`PAGE ERROR: ${error.message}`));
  await this.page.addInitScript(() => localStorage.removeItem('savesmart_goals'));
});

After(async function (scenario) {
  if (scenario.result.status === Status.FAILED) {
    const safeName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const screenshot = await this.page.screenshot({ path: `test-results/failure-${safeName}.png`, fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  await this.context.close();
  await this.browser.close();
});
