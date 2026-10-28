module.exports = {
  testDir: './api-tests',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  outputDir: 'test-results/api-artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/api-report', open: 'never' }],
    ['json', { outputFile: 'test-results/api-results.json' }]
  ],
  use: {}
};
