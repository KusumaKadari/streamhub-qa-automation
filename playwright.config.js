require('dotenv').config();

module.exports = {
  testDir: '.',
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  outputDir: 'test-results/playwright-artifacts'
};
