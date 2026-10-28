module.exports = {
  default: {
    require: ['step-definitions/**/*.js', 'support/**/*.js'],
    format: ['progress', 'html:test-results/cucumber-report.html'],
    publishQuiet: true,
    retry: 0
  }
};
