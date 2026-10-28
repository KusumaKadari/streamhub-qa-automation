# AI-Assisted Locator Self-Healing

## Workflow
1. **Detect:** A Playwright action reports timeout, strict-mode ambiguity, or "locator resolved to 0 elements." Mark the test and capture the locator strategy, timeout, expected action, and screenshot.
2. **Collect:** Gather the current DOM, accessibility snapshot, page URL, browser console/page errors, and a small HTML excerpt around interactive elements. Remove secrets and unrelated data before use.
3. **Prompt:** Ask an AI model for candidate locators, prioritizing `getByRole`, `getByLabel`, `getByText`, and `getByTestId`. The prompt must require a confidence score and explanation.
4. **Review:** A human or automated policy filters suggestions for uniqueness, accessibility, stability, and unintended matches. Never auto-accept generated code.
5. **Validate and apply:** Run the candidate only in a test branch or rerun the exercise. Apply it to the source file only if the relevant scenario passes, and preferably add a short comment explaining the healed locator.
6. **Learn safely:** Save the old locator, suggested replacement, validation result, screenshot, and approval in `test-results`. Do not silently change normal passing tests.

## Exercise Files
The files under `self-healing/exercise/` intentionally use incorrect or brittle locators. Do not include this folder in the normal passing Cucumber command. Each exercise should fail first, then be corrected manually using the workflow above.
